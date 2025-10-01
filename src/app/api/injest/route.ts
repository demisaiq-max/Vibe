// src/app/api/injest/route.ts
import { serve } from 'ingest/next';
import { injest } from '@/injest/client';
import { codeAgentFunction } from '@/injest/functions';

// Create an API that serves all of your functions
export const { GET, POST, PUT } = serve({
  client: injest,
  functions: [
    codeAgentFunction,
  ],
});

