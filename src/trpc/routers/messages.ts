// src/trpc/routers/messages.ts
import { createTRPCRouter, publicProcedure } from '@/trpc/init';
import { z } from 'zod';
import { db } from '@/lib/db';
import { injest } from '@/injest/client';

export const messagesRouter = createTRPCRouter({
  create: publicProcedure // Will be protected later
    .input(z.object({
      projectId: z.string(),
      prompt: z.string().min(1, 'Prompt cannot be empty.'),
    }))
    .mutation(async ({ input }) => {
      const newMessage = await db.message.create({
        data: {
          projectId: input.projectId,
          content: input.prompt,
          role: 'user',
          type: 'result',
        },
      });

      // Trigger the background job
      await injest.send({
        name: 'code-agent/run',
        data: {
          projectId: input.projectId,
          value: input.prompt,
        },
      });

      return newMessage;
    }),
});

