import dynamic from 'next/dynamic';
import type { EditorProps } from './MarkdownEditor';
import { Skeleton } from '@/components/ui/skeleton';

export type { Editor } from './MarkdownEditor';
export type { EditorActions } from './actionFactory';
export type { EditorProps };
export const DynamicMarkdownEditor = dynamic(() => import('./MarkdownEditor'), {
  ssr: false,
  loading() {
    return <SkeletonCard />;
  },
});

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 grow">
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
