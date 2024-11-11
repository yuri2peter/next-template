'use client';

import React, { useRef } from 'react';
import {
  DynamicMarkdownEditor,
  EditorActions,
} from '@/components/advanced/MarkdownEditor';
import { useImmer } from 'use-immer';
import MarkdownCodemirror from '@/components/advanced/MarkdownCodemirror';

export default function PageContent({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const editorActionsRef = useRef<EditorActions | null>(null);
  const [state, setState] = useImmer({
    readonly: false,
    markdown: defaultValue,
  });
  return (
    <main className="flex flex-row gap-4 w-full h-[calc(100vh-128px)] pr-12 overflow-auto ">
      <div className="overflow-auto h-full grow min-w-[600px]">
        <DynamicMarkdownEditor
          defaultValue={defaultValue}
          readonly={state.readonly}
          onEditorReady={({ actions }) => {
            console.log({ actions });
            editorActionsRef.current = actions;
          }}
          onChangeDebounceDelay={500}
          onChange={(markdown) => {
            setState((draft) => {
              draft.markdown = markdown;
            });
          }}
        />
      </div>
      <MarkdownCodemirror
        value={state.markdown}
        onChangeDebounceDelay={500}
        onChange={(markdown) => {
          setState((draft) => {
            draft.markdown = markdown;
          });
          editorActionsRef.current?.replaceAll(markdown);
        }}
        className="overflow-auto h-full min-w-[140px] shrink"
      />
    </main>
  );
}
