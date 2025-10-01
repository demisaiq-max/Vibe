'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '@/trpc/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectList() {
  // Consume the pre-fetched data
  const { data: projects } = useSuspenseQuery({
    queryKey: ['projects', 'getAll'],
    queryFn: () => api.projects.getAll.query(),
  });

  if (projects.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold">Your Previous Vibes</h2>
        <p className="mt-2 text-muted-foreground">You haven't built anything yet. Let's change that!</p>
      </div>
    );
  }

  return (
    <section className="mt-16 w-full">
      <h2 className="text-2xl font-semibold">Your Previous Vibes</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="h-full transition-transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                  Last updated {new Date(project.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

// A matching loading skeleton for a better UX during suspense
export function ProjectListLoading() {
  return (
    <section className="mt-16 w-full">
      <h2 className="text-2xl font-semibold">Your Previous Vibes</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

