// src/trpc/routers/projects.ts
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { db } from '@/lib/db';
import { injest } from '@/injest/client';
import { generateSlug } from 'random-word-slugs';

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1, 'Prompt cannot be empty.'),
    }))
    .mutation(async ({ input, ctx }) => {
      const newProject = await db.project.create({
        data: {
          name: generateSlug(2, { format: 'kebab' }),
          userId: ctx.auth.userId, 
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
  
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await db.project.findUnique({
        where: { id: input.id },
      });
      
      // Ensure user can only access their own projects
      if (project && project.userId !== ctx.auth.userId) {
        throw new Error('Project not found');
      }
      
      return project;
    }),
  
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return db.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }),
});

