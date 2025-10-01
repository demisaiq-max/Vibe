// src/injest/functions.ts
import { injest } from './client';
import { createAgent, openai, createNetwork } from '@inngest/agent-kit';
import { Sandbox } from 'e2b';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { terminalTool, createOrUpdateFilesTool, readFilesTool, completionTool } from './tools';
import { db } from '@/lib/db';

// Define the event payload
interface CodeAgentRunEvent {
  name: 'code-agent/run';
  data: {
    projectId: string;
    value: string; // The user's prompt
  };
}

// E2B Template ID
const E2B_TEMPLATE_ID = process.env.E2B_TEMPLATE_ID || 'abt5vfj6rombuxv4pjst';

// Create the AI agent with tools
const codeAgent = createAgent({
  name: 'coding-agent',
  system: SYSTEM_PROMPT,
  model: openai({
    model: 'gpt-4-turbo',
  }),
  tools: [
    terminalTool,
    createOrUpdateFilesTool,
    readFilesTool,
    completionTool,
  ],
});

// Create the agent network
const agentNetwork = createNetwork({
  name: 'coding-agent-network',
  agents: [codeAgent],
  defaultModel: openai({
    model: 'gpt-4-turbo',
  }),
  router: ({ network }) => {
    // Check if the agent has signaled completion
    const summary = network?.state.kv.get('summary');
    
    if (summary) {
      // Task is complete
      return undefined;
    }
    
    // Continue with the coding agent
    return codeAgent;
  },
});

export const codeAgentFunction = injest.createFunction(
  { 
    id: 'code-agent',
    timeout: '15m', // Increase timeout for complex tasks
  },
  { event: 'code-agent/run' },
  async ({ event, step }: any) => {
    const { projectId, value: userPrompt } = event.data;

    // Create sandbox
    const sandbox = await step.run('create-sandbox', async () => {
      return await Sandbox.create(E2B_TEMPLATE_ID, {
        timeoutMs: 900000, // 15 minutes
      });
    });

    console.log('Sandbox successfully created with ID:', sandbox.sandboxId);

    // Run the agent network with the sandbox context
    const result = await step.run('run-agent-network', async () => {
      // Run the network with sandbox ID in context
      const networkResult = await agentNetwork.run(userPrompt, {
        state: {
          sandboxId: sandbox.sandboxId,
        },
      });

      return networkResult;
    });

    // Get the sandbox URL
    const sandboxUrl = sandbox.getHost(3000);
    const fullSandboxUrl = sandboxUrl ? `https://${sandboxUrl}` : null;

    // Close the sandbox
    await step.run('close-sandbox', async () => {
      await sandbox.close();
    });

    console.log('Sandbox closed.');

    // Extract results from the network state
    const summary = result.state?.kv?.get('summary') as string | undefined;
    const files = result.state?.kv?.get('files') as Record<string, string> || {};

    // Step to save the final result to the database
    await step.run('save-to-db', async () => {
      if (!summary) {
        // Handle cases where the agent failed to provide a summary
        await db.message.create({
          data: {
            projectId: projectId,
            role: 'assistant',
            type: 'error',
            content: 'The AI agent failed to complete the request.',
          },
        });
        return;
      }

      // Create the assistant's message and the associated fragment
      await db.message.create({
        data: {
          projectId: projectId,
          role: 'assistant',
          type: 'result',
          content: summary,
          fragment: {
            create: {
              title: 'Generated Code', // We will improve this later
              sandboxUrl: fullSandboxUrl || '',
              files: files,
            },
          },
        },
      });
    });

    return {
      message: 'Process completed and results saved.',
      summary: summary || 'Agent network completed without summary.',
      files,
      sandboxUrl: fullSandboxUrl,
      projectId,
    };
  }
);
