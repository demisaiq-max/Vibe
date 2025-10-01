// src/trpc/routers/projects.ts
import { createTRPCRouter, publicProcedure } from '@/trpc/init';
import { z } from 'zod';
import { db } from '@/lib/db';
import { injest } from '@/injest/client';
import { generateSlug } from 'random-word-slugs';

export const projectsRouter = createTRPCRouter({
  create: publicProcedure // We will make this a protected procedure later
    .input(z.object({
      prompt: z.string().min(1, 'Prompt cannot be empty.'),
    }))
    .mutation(async ({ input }) => {
      const newProject = await db.project.create({
        data: {
          name: generateSlug(2, { format: 'kebab' }),
          // userId will be added after authentication is implemented
          userId: 'placeholder-user-id', 
          messages: {
            create: {
              content: input.prompt,
              role: 'user',
              type: 'result',
            },
          },
        },
      });

      // Trigger the background job
      await injest.send({
        name: 'code-agent/run',
        data: {
          projectId: newProject.id,
          value: input.prompt,
        },
      });

      return newProject;
    }),
  
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return db.project.findUnique({
        where: { id: input.id },
      });
    }),
});

