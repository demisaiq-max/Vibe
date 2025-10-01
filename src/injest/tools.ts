// src/injest/tools.ts
import { createTool } from '@inngest/agent-kit';
import { z } from 'zod';
import { Sandbox } from 'e2b';

// Helper to connect to an existing sandbox
const getSandbox = async (sandboxId: string) => await Sandbox.connect(sandboxId);

export const terminalTool = createTool({
  name: 'terminal',
  description: 'Execute terminal commands in the sandbox.',
  parameters: z.object({
    command: z.string().describe("The command to execute, e.g., 'npm install lodash'"),
  }),
  handler: async ({ command }, context) => {
    const sandboxId = (context as any).sandboxId as string | undefined;
    if (!sandboxId) throw new Error('Sandbox ID is required.');
    
    const sandbox = await getSandbox(sandboxId);

    const result = await sandbox.commands.run(command);

    if (result.stderr) {
      console.error('Terminal command error:', result.stderr);
      // Return the error to the agent so it can potentially self-correct
      return `Error: ${result.stderr}\nStdout: ${result.stdout}`;
    }
    return result.stdout || 'Command executed successfully';
  },
});

export const createOrUpdateFilesTool = createTool({
  name: 'createOrUpdateFiles',
  description: 'Create or update one or more files in the sandbox.',
  parameters: z.object({
    files: z.array(z.object({
      path: z.string().describe("The relative path of the file, e.g., 'src/components/Button.tsx'"),
      content: z.string().describe("The full content of the file."),
    })),
  }),
  handler: async ({ files }, context) => {
    const sandboxId = (context as any).sandboxId as string | undefined;
    if (!sandboxId) throw new Error('Sandbox ID is required.');
    
    const sandbox = await getSandbox(sandboxId);

    // Write all files in parallel
    await Promise.all(
      files.map(file => sandbox.files.write(file.path, file.content))
    );

    // Track the created files in the context
    if ((context as any).network?.state) {
      const network = (context as any).network;
      const existingFiles = (network.state.kv.get('files') as Record<string, string>) || {};
      const updatedFiles = { ...existingFiles };
      
      // Store file contents keyed by path
      files.forEach((f: any) => {
        updatedFiles[f.path] = f.content;
      });
      
      network.state.kv.set('files', updatedFiles);
    }

    return `Successfully wrote ${files.length} file(s).`;
  },
});

export const readFilesTool = createTool({
  name: 'readFiles',
  description: 'Read the content of one or more files from the sandbox.',
  parameters: z.object({
    paths: z.array(z.string().describe("The relative path of the file to read, e.g., 'src/app/page.tsx'")),
  }),
  handler: async ({ paths }, context) => {
    const sandboxId = (context as any).sandboxId as string | undefined;
    if (!sandboxId) throw new Error('Sandbox ID is required.');
    
    const sandbox = await getSandbox(sandboxId);

    // Read all files in parallel
    const fileContents = await Promise.all(
      paths.map(async (path) => {
        try {
          const content = await sandbox.files.read(path);
          return { path, content, success: true };
        } catch (error) {
          return { path, content: `Error reading file: ${error}`, success: false };
        }
      })
    );

    return JSON.stringify(fileContents, null, 2);
  },
});

export const completionTool = createTool({
  name: 'markComplete',
  description: 'Call this tool when you have completed the task. Provide a brief summary of what you built.',
  parameters: z.object({
    summary: z.string().describe("A brief, one-sentence summary of what was built, starting with 'TASK_SUMMARY: '"),
  }),
  handler: async ({ summary }, context) => {
    // Store the summary in the network state
    if ((context as any).network?.state) {
      const network = (context as any).network;
      network.state.kv.set('summary', summary);
    }

    return 'Task marked as complete. Summary recorded.';
  },
});
