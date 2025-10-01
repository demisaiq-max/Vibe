// src/components/views/ProjectView.tsx
'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { MessagesContainer } from './MessagesContainer';
import { MessageForm } from './MessageForm';

interface ProjectViewProps {
  projectId: string;
}

export function ProjectView({ projectId }: ProjectViewProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      {/* Panel 1: Chat and Messages */}
      <ResizablePanel defaultSize={35} minSize={25}>
        <div className="flex h-full flex-col p-4">
          <MessagesContainer projectId={projectId} />
          <div className="mt-4">
            <MessageForm projectId={projectId} />
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Panel 2: Live Preview and Code Viewer */}
      <ResizablePanel defaultSize={65} minSize={40}>
        <div className="flex h-full items-center justify-center bg-muted/40">
          <p className="text-muted-foreground">Live Preview will go here.</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

