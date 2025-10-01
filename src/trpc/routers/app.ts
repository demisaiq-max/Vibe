// src/trpc/routers/app.ts
import { createTRPCRouter } from '@/trpc/init';

// This is the primary router for your server.
// All routers added in /api/routers should be manually added here.
export const appRouter = createTRPCRouter({
  // We will add procedures here in later phases
});

// export type definition of API
export type AppRouter = typeof appRouter;

