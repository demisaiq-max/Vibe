// src/components/views/FragmentPreviewer.tsx
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Fragment } from '@/generated/prisma';
import { useMemo } from 'react';
import { FileExplorer } from './FileExplorer';

interface FragmentPreviewerProps {
  fragment: Fragment;
}

export function FragmentPreviewer({ fragment }: FragmentPreviewerProps) {
  // useMemo ensures the iframe source only changes when the fragment id changes,
  // preventing unnecessary reloads.
  const iframeSrc = useMemo(() => fragment.sandboxUrl, [fragment.id]);

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs defaultValue="preview" className="flex flex-1 flex-col">
        {/* Tabs Header with Controls */}
        <div className="flex items-center border-b p-2">
          <TabsList>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              asChild // Allows the Button to act as a Link
            >
              <a href={fragment.sandboxUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
        </div>

        {/* Tab Content for Live Preview */}
        <TabsContent value="preview" className="flex-1 overflow-auto m-0">
          <iframe
            key={fragment.id} // Changing the key forces the iframe to re-render
            src={iframeSrc}
            className="h-full w-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        </TabsContent>

        {/* Tab Content for Code Viewer (Updated) */}
        <TabsContent value="code" className="flex-1 overflow-auto p-2 m-0">
          <FileExplorer fragment={fragment} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

