'use client';

import React, { useRef } from 'react';
import {
  DynamicMarkdownEditor,
  Editor,
} from '@/components/advanced/MarkdownEditor';
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
    <main className="flex flex-row gap-4 w-full h-[calc(100vh-128px)] pr-12 overflow-auto ">
      <div className="overflow-auto h-full grow">
        <DynamicMarkdownEditor
          defaultValue={defaultValue}
          readonly={state.readonly}
          onEditorReady={(editor) => {
            editorRef.current = editor;
          }}
          onChangeDebounceDelay={500}
          onChange={(markdown) => {
            setState((draft) => {
              draft.markdown = markdown;
            });
          }}
        />
      </div>
      <div className="overflow-auto h-full max-w-[30%] prose shrink">
        <pre>{state.markdown}</pre>
      </div>
    </main>
  );
}
