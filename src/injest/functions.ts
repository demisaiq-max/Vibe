// src/injest/functions.ts
import { injest } from './client';

// Define the event payload
interface CodeAgentRunEvent {
  name: 'code-agent/run';
  data: {
    projectId: string;
    value: string; // The user's prompt
  };
}

export const codeAgentFunction = injest.createFunction(
  { id: 'code-agent' },
  { event: 'code-agent/run' },
  async ({ event, step }: any) => {
    // We will implement the AI logic here in future phases.
    // For now, we'll just log the event.
    console.log('Received event to run code agent:', event.data);

    await step.sleep('wait-a-moment', '1s');

    return {
      message: `Background job completed for project: ${event.data.projectId}`,
    };
  }
);

