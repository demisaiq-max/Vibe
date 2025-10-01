// src/components/views/MessageForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/client';

interface MessageFormProps {
  projectId: string;
}

export function MessageForm({ projectId }: MessageFormProps) {
  const [prompt, setPrompt] = useState('');
  const utils = api.useUtils();
  const createMessage = api.messages.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch messages after creating a new one
      utils.messages.getForProject.invalidate({ projectId });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    createMessage.mutate({ projectId, prompt });
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Make it red..."
        disabled={createMessage.isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={createMessage.isPending || !prompt.trim()}>
        {createMessage.isPending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}

