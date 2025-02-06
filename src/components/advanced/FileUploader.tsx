import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import ImageFb from './ImageFb';
import { useDebouncedValue } from '@mantine/hooks';
import { remoteDownload, selectFileFromBrowser, uploadFile } from '@/lib/file';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import FileIcon from '../ui/FileIcon';
import mime from 'mime';

export default function ImageUploader({
  defaultSrc = '',
  onChange,
  type = 'auto',
}: {
  defaultSrc?: string;
  onChange: (
    info: { url: string; filename: string } & ReturnType<typeof getSrcInfo>
  ) => void;
  type?: 'auto' | 'image' | 'file';
}) {
  const [src, setSrc] = useState(defaultSrc);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const uploadFileToServer = async (file: File) => {
    const { url, filename } = await uploadFile({ file });
    setSrc(url);
    onChange({ url, filename, ...getSrcInfo(url) });
  };
  const { isRemote, ext, isImage } = getSrcInfo(src);
  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-2 border-input border rounded-md',
        dragging && 'border-primary animate-pulse'
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDrop={async (e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const firstFile = Array.from(files).find((item) =>
          type === 'image' ? item.type.startsWith('image') : true
        );
        if (firstFile) {
          e.preventDefault();
          await uploadFileToServer(firstFile);
        }
      }}
    >
      <div className="flex flex-row gap-2 items-stretch h-[84px]">
        <Textarea
          plain
          className="outline-none resize-none grow bg-transparent"
          disabled={processing}
          value={src}
          rows={3}
          onChange={(e) => setSrc(e.target.value)}
          placeholder={
            type === 'image'
              ? '1. Input image URL here\n2. Paste a image here\n3. Drag and drop a image here'
              : '1. Input file URL here\n2. Paste a file here\n3. Drag and drop a file here'
          }
          onPaste={async (e) => {
            const items = e.clipboardData.items;
            const fileItem = Array.from(items).find((item) => {
              if (type === 'image') {
                return item.type.startsWith('image');
              }
              return item.getAsFile();
            });
            if (fileItem) {
              e.preventDefault();
              await uploadFileToServer(fileItem.getAsFile()!);
            }
          }}
        />
        {type === 'auto' ? (
          isImage ? (
            <ImagePreview src={src} />
          ) : (
            <FilePreview src={src} ext={ext} />
          )
        ) : type === 'image' ? (
          <ImagePreview src={src} />
        ) : (
          <FilePreview src={src} ext={ext} />
        )}
      </div>
      <div className="flex justify-start gap-2 items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            try {
              setProcessing(true);
              const file = await selectFileFromBrowser(
                false,
                type === 'image' ? 'image/*' : '*'
              );
              await uploadFileToServer(file);
            } catch (error) {
              console.warn(error);
            } finally {
              setProcessing(false);
            }
          }}
        >
          Select files...
        </Button>
        {isRemote && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={processing}
                onClick={async () => {
                  try {
                    setProcessing(true);
                    const { url, filename } = await remoteDownload(src);
                    setSrc(url);
                    onChange({ url, filename, ...getSrcInfo(url) });
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setProcessing(false);
                  }
                }}
              >
                Remote Upload
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {type === 'image'
                ? 'Upload remote image to server'
                : 'Upload remote file to server'}
            </TooltipContent>
          </Tooltip>
        )}
        {processing && (
          <p className="text-sm text-muted-foreground animate-pulse">
            Processing...
          </p>
        )}
      </div>
    </div>
  );
}

function ImagePreview({ src }: { src: string }) {
  const [srcDebounced] = useDebouncedValue(src, 500);
  if (!srcDebounced) return null;
  return (
    <ImageFb
      src={srcDebounced}
      className="h-full aspect-square object-contain bg-muted m-0"
    />
  );
}

function FilePreview({ src, ext }: { src: string; ext: string }) {
  const [srcDebounced] = useDebouncedValue(src, 500);
  if (!srcDebounced) return null;
  return <FileIcon ext={ext} className="h-1/2 aspect-square" />;
}

function getSrcInfo(src: string) {
  const isRemote = src.startsWith('http');
  const ext = src.split('.').pop() || '';
  const isImage = (mime.getType(ext) || '').startsWith('image');
  return { isRemote, ext, isImage };
}
