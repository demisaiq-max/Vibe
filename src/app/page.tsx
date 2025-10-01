// src/app/page.tsx
import { Suspense } from 'react';
import { api as serverApi } from '@/trpc/server';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { ProjectForm } from '@/components/home/ProjectForm';
import { ProjectList, ProjectListLoading } from '@/components/home/ProjectList';

// This is a React Server Component
export default async function HomePage() {
  const queryClient = new QueryClient();

  // Pre-fetch the list of projects on the server
  await queryClient.prefetchQuery({
    queryKey: ['projects', 'getAll'],
    queryFn: () => serverApi.projects.getAll.query(),
  });

  return (
    <main className="container mx-auto flex max-w-5xl flex-1 flex-col items-center px-4 py-16">
      <h1 className="text-center text-4xl font-bold tracking-tight md:text-6xl">
        Build Your Next Startup <br /> With a Single Sentence
      </h1>
      <p className="mt-4 max-w-xl text-center text-lg text-muted-foreground">
        This is Vibe, an AI-powered app builder that makes it possible. Enter a simple prompt and watch it come to life.
      </p>

      <div className="my-12 w-full max-w-3xl">
        <ProjectForm />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProjectListLoading />}>
          <ProjectList />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
