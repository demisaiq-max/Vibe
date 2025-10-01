// src/components/views/FileExplorer.tsx
'use client';

import { useState, useMemo } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { CodeViewer } from './CodeViewer';
import { File } from 'lucide-react';
import type { Fragment } from '@/generated/prisma';

interface FileExplorerProps {
  fragment: Fragment;
}

export function FileExplorer({ fragment }: FileExplorerProps) {
  // The 'files' from Prisma is a JSON object: { "path/to/file.tsx": "content..." }
  const files = useMemo(() => fragment.files as Record<string, string>, [fragment.files]);
  const filePaths = useMemo(() => Object.keys(files).sort(), [files]);

  // State to track the currently selected file path
  const [selectedFile, setSelectedFile] = useState<string | null>(filePaths[0] || null);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border">
      {/* Panel 1: File Tree */}
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b p-3">
            <span className="text-sm font-semibold">Files</span>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="flex flex-col gap-1">
              {filePaths.map((path) => (
                <button
                  key={path}
                  onClick={() => setSelectedFile(path)}
                  className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors ${
                    selectedFile === path
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <File className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{path}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Panel 2: Code Viewer */}
      <ResizablePanel defaultSize={75} minSize={30}>
        {selectedFile && files[selectedFile] ? (
          <div className="flex h-full flex-col">
            <div className="border-b bg-muted/40 px-4 py-2">
              <span className="text-sm font-mono text-muted-foreground">{selectedFile}</span>
            </div>
            <CodeViewer
              code={files[selectedFile]}
              language={selectedFile}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select a file to view its code.</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

