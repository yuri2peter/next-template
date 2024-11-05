'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { selectFileFromBrowser } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Loader2, Upload } from 'lucide-react';
import { useImmer } from 'use-immer';
import axios from 'axios';

export default function PageContent() {
  const [state, setState] = useImmer({
    filename: '',
    url: '',
  });
  return (
    <main className="prose flex flex-col">
      <h2>Upload</h2>
      <p>You can upload files here.</p>
      <Dropzone
        onShouldUpload={() => true}
        onUploaded={(data) => {
          setState((draft) => {
            draft.filename = data.filename;
            draft.url = data.url;
          });
        }}
      />
      {state.url && (
        <p>
          <a href={state.url} target="_blank" rel="noreferrer">
            {state.filename}
          </a>
        </p>
      )}
    </main>
  );
}

function Dropzone({
  accept = '*',
  className,
  onShouldUpload = () => true,
  onUploaded = (info) => {
    console.log(info);
  },
}: {
  accept?: string;
  className?: string;
  onShouldUpload?: (file: File) => boolean;
  onUploaded?: ({ filename, url }: { filename: string; url: string }) => void;
}) {
  const [state, setState] = useImmer({
    uploading: false,
    dragging: false,
    filename: '',
    filesize: 0,
    progress: 0,
    abortController: new AbortController(),
  });
  const handleUpload = async (file: File) => {
    const acceptFile = onShouldUpload(file);
    if (!acceptFile) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const abortController = new AbortController();
      setState((draft) => {
        draft.uploading = true;
        draft.filename = file.name;
        draft.filesize = file.size;
        draft.abortController = abortController;
      });
      const {
        data: { filename, url },
      } = await axios.post('/api/file/upload', formData, {
        signal: abortController.signal,
        onUploadProgress: ({ loaded, total }) => {
          const progress = (loaded / (total || 1)) * 100;
          setState((draft) => {
            draft.progress = progress;
          });
        },
      });
      onUploaded({ filename, url });
    } catch (error) {
      console.error(error);
    } finally {
      setState((draft) => {
        draft.uploading = false;
      });
    }
  };

  const abortUpload = () => {
    state.abortController.abort('Aborted by user');
  };

  return (
    <Button
      variant={'outline'}
      className={cn(
        'border-dashed py-8',
        state.dragging && 'border-primary',
        className
      )}
      size={'lg'}
      onClick={() => {
        if (state.uploading) {
          abortUpload();
        } else {
          selectFileFromBrowser(false, accept).then(handleUpload);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setState((draft) => {
          draft.dragging = true;
        });
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setState((draft) => {
          draft.dragging = false;
        });
      }}
      onDrop={async (e) => {
        e.preventDefault();
        setState((draft) => {
          draft.dragging = false;
        });
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
          await handleUpload(file);
        }
      }}
    >
      {state.uploading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {state.progress.toFixed(2)}% Click to cancel
        </>
      ) : (
        <>
          <Upload className="w-4 h-4 mr-2" />
          Drag or click to upload
        </>
      )}
    </Button>
  );
}
