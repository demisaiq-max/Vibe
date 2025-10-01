// src/injest/functions.ts
import { injest } from './client';
import { createAgent, openai } from '@inngest/agent-kit';

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

    // Run the agent with the user's prompt
    const result = await step.run('run-agent', async () => {
      return await codeAgent.run(userPrompt);
    });

    console.log('AI Agent output:', result.output);

    // We will add logic to save the result here later
    return {
      message: 'Agent run completed.',
      output: result.output,
    };
  }
);
