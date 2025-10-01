// src/components/views/MessagesContainer.tsx
'use client';

import { api } from '@/trpc/client';

interface MessagesContainerProps {
  projectId: string;
}

export function MessagesContainer({ projectId }: MessagesContainerProps) {
  const { data: messages } = api.messages.getForProject.useQuery({ projectId });

  if (!messages) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`rounded-lg p-3 ${
            message.role === 'user'
              ? 'bg-secondary self-end max-w-[80%]'
              : 'bg-muted self-start max-w-[80%]'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          {message.role === 'assistant' && message.type === 'error' && (
            <p className="mt-2 text-xs text-destructive">Error occurred</p>
          )}
        </div>
      ))}
    </div>
  );
}

