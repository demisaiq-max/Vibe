// src/components/views/MessagesContainer.tsx
'use client';

import { api } from '@/trpc/client';
import { useEffect } from 'react';
import type { Fragment } from '@/generated/prisma';

interface MessagesContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export function MessagesContainer({ projectId, activeFragment, setActiveFragment }: MessagesContainerProps) {
  const { data: messages } = api.messages.getForProject.useQuery({ projectId });

  // Effect to automatically select the latest fragment on initial load
  useEffect(() => {
    if (!messages) return;
    
    const lastAssistantMessage = [...messages].reverse().find(
      (msg) => msg.role === 'assistant' && msg.fragment
    );
    if (lastAssistantMessage && lastAssistantMessage.fragment) {
      setActiveFragment(lastAssistantMessage.fragment);
    }
    // We only want this to run once when messages are first loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  if (!messages) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-4">
      {messages.map((message) => {
        const isFragmentMessage = message.role === 'assistant' && message.fragment;
        const isActive = isFragmentMessage && activeFragment?.id === message.fragment?.id;

        return (
          <div
            key={message.id}
            onClick={() => isFragmentMessage && message.fragment && setActiveFragment(message.fragment)}
            className={`rounded-lg p-3 transition-all ${
              isFragmentMessage ? 'cursor-pointer hover:shadow-md' : ''
            } ${isActive ? 'ring-2 ring-primary' : ''} ${
              message.role === 'user'
                ? 'bg-secondary self-end max-w-[80%]'
                : 'bg-muted self-start max-w-[80%]'
            }`}
          >
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            {message.role === 'assistant' && message.type === 'error' && (
              <p className="mt-2 text-xs text-destructive">Error occurred</p>
            )}
            {isFragmentMessage && (
              <p className="mt-2 text-xs text-muted-foreground">
                Click to view preview
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
