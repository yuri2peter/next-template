'use client';

import Head from 'next/head';
import React, { useRef } from 'react';
import MarkdownEditor, { Editor } from '@/components/advanced/MarkdownEditor';
import { useImmer } from 'use-immer';

export default function PageContent({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const editorRef = useRef<Editor | null>(null);
  const [state, setState] = useImmer({
    readonly: false,
    markdown: defaultValue,
  });
  return (
    <>
      <Head>
        <title>Markdown Editor</title>
      </Head>
      <main className="flex flex-row gap-4 w-full h-[640px]">
        <div className="overflow-auto h-full">
          <MarkdownEditor
            defaultValue={defaultValue}
            ref={editorRef}
            readonly={state.readonly}
            onChangeDebounceDelay={500}
            onChange={(markdown) => {
              setState((draft) => {
                draft.markdown = markdown;
              });
            }}
          />
        </div>
        <div className="overflow-auto h-full max-w-[30%] prose">
          <pre>{state.markdown}</pre>
        </div>
      </main>
    </>
  );
}
