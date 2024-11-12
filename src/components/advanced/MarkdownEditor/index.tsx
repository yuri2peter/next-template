import dynamic from 'next/dynamic';
import type { EditorProps } from './MarkdownEditor';
import { createContext, useContext } from 'react';
import MarkdownPreview from '../MarkdownPreview';
import { Skeleton } from '@/components/ui/skeleton';
export type { Editor } from './MarkdownEditor';
export type { EditorActions } from './actionFactory';
export type { EditorProps };

const LoadingValueContext = createContext<string>('');

const MainEditor = dynamic(() => import('./MarkdownEditor'), {
  ssr: false,
  loading: () => <LoadingRenderer />,
});

function LoadingRenderer() {
  const loadingValue = useContext(LoadingValueContext);
  return (
    <div>
      <SkeletonCard />
      <MarkdownPreview className="hidden">{loadingValue}</MarkdownPreview>
    </div>
  );
}

export default function MarkdownEditor(props: EditorProps) {
  return (
    <LoadingValueContext.Provider value={props.defaultValue ?? ''}>
      <MainEditor {...props} />
    </LoadingValueContext.Provider>
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-3 w-full">
      <div className="space-y-4 mx-auto max-w-[624px] w-full">
        <Skeleton className="h-[125px] rounded-xl mt-4" />
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
