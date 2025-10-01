// src/components/views/ProjectView.tsx
'use client';

import { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { MessagesContainer } from './MessagesContainer';
import { MessageForm } from './MessageForm';
import type { Fragment } from '@/generated/prisma';
import { FragmentPreviewer } from './FragmentPreviewer';

interface ProjectViewProps {
  projectId: string;
}

export function ProjectView({ projectId }: ProjectViewProps) {
  // State to hold the currently selected fragment from the message list
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      <ResizablePanel defaultSize={35} minSize={25}>
        <div className="flex h-full flex-col p-4">
          <MessagesContainer
            projectId={projectId}
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
          />
          <div className="mt-4">
            <MessageForm projectId={projectId} />
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={65} minSize={40}>
        {/* Conditionally render the previewer only when a fragment is active */}
        {activeFragment ? (
          <FragmentPreviewer fragment={activeFragment} />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/40">
            <p className="text-muted-foreground">Select a generation to see the preview.</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
