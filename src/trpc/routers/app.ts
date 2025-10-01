// src/trpc/routers/app.ts
import { createTRPCRouter } from '@/trpc/init';
import { projectsRouter } from './projects';
import { messagesRouter } from './messages';

// This is the primary router for your server.
// All routers added in /api/routers should be manually added here.
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  messages: messagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
