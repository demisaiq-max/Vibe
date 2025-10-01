// src/app/projects/[projectId]/page.tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { api as serverApi } from '@/trpc/server';
import { ProjectView } from '@/components/views/ProjectView';

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

// This is a React Server Component (RSC)
export default async function ProjectPage(props: ProjectPageProps) {
  const params = await props.params;
  const { projectId } = params;
  const queryClient = new QueryClient();

  // Pre-fetch data on the server in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [['projects', 'getOne'], { input: { id: projectId }, type: 'query' }],
      queryFn: () => serverApi.projects.getOne({ id: projectId }),
    }),
    queryClient.prefetchQuery({
      queryKey: [['messages', 'getForProject'], { input: { projectId }, type: 'query' }],
      queryFn: () => serverApi.messages.getForProject({ projectId }),
    }),
  ]);

  return (
    // Pass the server-fetched data to the client component
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProjectPageLoading />}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
}

// A simple loading skeleton
function ProjectPageLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-muted-foreground">Loading project...</p>
    </div>
  );
}

