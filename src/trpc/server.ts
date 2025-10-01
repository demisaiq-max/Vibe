// src/trpc/server.ts
import {
  createTRPCProxyClient,
  loggerLink,
  httpBatchLink,
} from '@trpc/client';
import { headers } from 'next/headers';
import superjson from 'superjson';
import type { AppRouter } from './routers/app';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        const heads = new Map(headers());
        heads.set('x-trpc-source', 'rsc');
        return Object.fromEntries(heads);
      },
    }),
  ],
});

