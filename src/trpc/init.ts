// src/trpc/init.ts
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { auth } from '@clerk/nextjs/server';

// Context creation with Clerk authentication
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    ...opts,
    auth,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be signed in to access this resource.',
    });
  }
  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});

