import dynamic from 'next/dynamic';
import type { EditorProps } from './MarkdownEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export type { Editor } from './MarkdownEditor';
export type { EditorProps };
const MarkdownEditorComponent = dynamic(() => import('./MarkdownEditor'), {
  ssr: false,
  loading() {
    return <SkeletonCard />;
  },
});

export default function MarkdownEditorDynamic(props: EditorProps) {
  return (
    <Suspense fallback={11111}>
      <MarkdownEditorComponent {...props} />
    </Suspense>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 grow min-w-[400px]">
      <div className="space-y-4 mx-[60px]">
        <Skeleton className="h-[125px] rounded-xl" />
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
