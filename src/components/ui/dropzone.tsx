import React from 'react';
import { Button } from '@/components/ui/button';
import { selectFileFromBrowser, uploadFile } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Loader2, Upload } from 'lucide-react';
import { useImmer } from 'use-immer';

export default function Dropzone({
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
  onUploaded?: ({
    filename,
    url,
    isImage,
  }: {
    filename: string;
    url: string;
    isImage: boolean;
  }) => void;
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
      uploadFile({
        file,
        onProgressChange: (progress) => {
          setState((draft) => {
            draft.progress = progress;
          });
        },
      });
      const abortController = new AbortController();
      setState((draft) => {
        draft.uploading = true;
        draft.filename = file.name;
        draft.filesize = file.size;
        draft.abortController = abortController;
      });
      const { filename, url } = await uploadFile({
        file,
        abortController,
        onProgressChange: (progress) => {
          setState((draft) => {
            draft.progress = progress;
          });
        },
      });
      onUploaded({ filename, url, isImage: file.type.startsWith('image') });
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
          {(state.progress * 100).toFixed(2)}% Click to cancel
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
