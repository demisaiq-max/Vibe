'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ProjectForm() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const createProject = api.projects.create.useMutation({
    onSuccess: (data: { id: string }) => {
      // On successful creation, redirect to the new project's page
      router.push(`/projects/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    createProject.mutate({ prompt });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A Netflix style homepage with a hero banner and carousels for movie categories..."
        rows={3}
        className="text-base"
        disabled={createProject.isPending}
      />
      <Button type="submit" size="lg" disabled={createProject.isPending}>
        {createProject.isPending ? 'Building...' : 'Build It'}
      </Button>
    </form>
  );
}

