// src/injest/functions.ts
import { injest } from './client';
import { createAgent, openai } from '@inngest/agent-kit';
import { Sandbox } from 'e2b';

// Define the event payload
interface CodeAgentRunEvent {
  name: 'code-agent/run';
  data: {
    projectId: string;
    value: string; // The user's prompt
  };
}

// A placeholder for our robust system prompt
const placeholderSystemPrompt = `You are an expert Next.js developer. Your goal is to build a functional Next.js application based on the user's request.`;

// E2B Template ID - This will be generated when you build the template
// To build: cd e2b && e2b template build
// Then copy the Template ID from the output and paste it here
const E2B_TEMPLATE_ID = process.env.E2B_TEMPLATE_ID || 'abt5vfj6rombuxv4pjst';

// Create the AI agent
const codeAgent = createAgent({
  name: 'coding-agent',
  // We will use the placeholder for now. Later, this will be a detailed prompt.
  system: placeholderSystemPrompt,
  model: openai({
    // Recommended model for balance of cost, speed, and capability
    model: 'gpt-4-turbo',
  }),
  // We will add tools in a later phase
  // tools: [],
});

export const codeAgentFunction = injest.createFunction(
  { id: 'code-agent' },
  { event: 'code-agent/run' },
  async ({ event, step }: any) => {
    const { value: userPrompt } = event.data;

    // Wrap the sandbox creation in a named step for observability in the Ingest dashboard
    const sandbox = await step.run('create-sandbox', async () => {
      // This is the call to E2B's API via the SDK
      // First argument is the template ID, second is options
      return await Sandbox.create(E2B_TEMPLATE_ID, {
        // Automatically close the sandbox after 15 minutes of inactivity to save resources
        timeoutMs: 900000, // 15 minutes in milliseconds
      });
    });

    console.log('Sandbox successfully created with ID:', sandbox.sandboxId);
    
    // In the next phase, we'll give the agent tools to interact with this sandbox.
    const result = await step.run('run-agent', async () => {
      return await codeAgent.run(userPrompt);
    });

    console.log('AI Agent output:', result.output);

    // It is CRITICAL to close the sandbox when you're done.
    // Otherwise, it will keep running until the timeout, consuming your free credits.
    await step.run('close-sandbox', async () => {
      await sandbox.close();
    });

    console.log('Sandbox closed.');

    // We will add logic to save the result here later
    return {
      message: 'Agent run and sandbox cycle completed.',
      output: result.output,
    };
  }
);
