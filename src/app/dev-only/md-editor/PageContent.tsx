'use client';

import React, { useRef } from 'react';
import DynamicMarkdownEditor2, {
  // DynamicMarkdownEditor,
  EditorActions,
} from '@/components/advanced/MarkdownEditor';
import { useImmer } from 'use-immer';

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
      <div className="overflow-auto h-full grow min-w-[600px] mx-auto">
        <DynamicMarkdownEditor2
          defaultValue={defaultValue}
          readonly={state.readonly}
          onEditorReady={({ actions }) => {
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
    </main>
  );
}
