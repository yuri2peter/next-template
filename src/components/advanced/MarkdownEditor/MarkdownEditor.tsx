/* eslint-disable react/display-name */
'use client';

import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from '@milkdown/kit/core';
import { nord } from '@milkdown/theme-nord';
import './styles/style.css';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { history } from '@milkdown/kit/plugin/history';
import { gfm } from '@milkdown/kit/preset/gfm';
// import { clipboard } from '@milkdown/kit/plugin/clipboard';
import { cursor, dropCursorConfig } from '@milkdown/kit/plugin/cursor';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import {
  indent,
  indentConfig,
  IndentConfigOptions,
} from '@milkdown/plugin-indent';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react';
import { trailing } from '@milkdown/kit/plugin/trailing';
import { placeholderConfig, placeholderPlugin } from './features/placeholder';
import { defineCodeMirrorFeature } from './features/codemirror/defineCodeMirrorFeature';
import { defineLinkTooltipFeature } from './features/linkTooltip';
import { defineListItemFeature } from './features/listItem';
import { defineTableFeature } from './features/table';
import { defineBlockHandleFeature } from './features/handle';
import { defineMenuFeature, menuAPI } from './features/menu';
import { defineToolbarFeature } from './features/toolbar';
import { defineUploadFeature } from './features/upload';
import { useRef } from 'react';
import { debounce } from 'radash';

export type EditorProps = {
  defaultValue?: string;
  readonly?: boolean;
  onChange?: (markdown: string) => void;
  onChangeDebounceDelay?: number;
  onEditorReady?: (editor: Editor) => void;
};

const MilkdownEditor = ({
  defaultValue = '',
  onChange,
  readonly,
  onChangeDebounceDelay = 500,
  onEditorReady,
}: EditorProps) => {
  const refProps = useRef<EditorProps & { editor: Editor | null }>({
    editor: null,
    defaultValue,
    onChange,
    onChangeDebounceDelay,
    readonly,
  });
  Object.assign(refProps, {
    onChange,
    onEditorReady,
  });
  useEditor((root) => {
    const editor = Editor.make();
    refProps.current.editor = editor;
    editor
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, refProps.current.defaultValue ?? '');
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          editable: () => !refProps.current.readonly,
        }));
        const handleChangeDebounced = debounce(
          { delay: refProps.current.onChangeDebounceDelay ?? 500 },
          (text: string) => {
            refProps.current.onChange?.(text);
          }
        );
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            handleChangeDebounced(markdown);
          }
        });
        ctx.set(indentConfig.key, {
          type: 'space',
          size: 4,
        } as IndentConfigOptions);
        ctx.update(dropCursorConfig.key, () => ({
          class: 'crepe-drop-cursor',
          width: 4,
          color: false as const,
        }));
      })
      .use(commonmark)
      .use(history)
      .use(indent)
      .use(cursor)
      .use(listener)
      .use(trailing)
      // .use(clipboard) // This plugin may cause some problems when uploading images and pasting content from editor
      .use(gfm)
      .use(placeholderPlugin)
      .use(placeholderConfig)
      .use(menuAPI);
    defineCodeMirrorFeature(editor);
    defineLinkTooltipFeature(editor);
    defineListItemFeature(editor);
    defineTableFeature(editor);
    defineBlockHandleFeature(editor);
    defineMenuFeature(editor);
    defineToolbarFeature(editor);
    defineUploadFeature(editor);
    refProps.current.onEditorReady?.(editor);
    return editor;
  });
  return <Milkdown />;
};

const MainEditor = (props: EditorProps) => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor {...props} />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
};

export default MainEditor;
export type { Editor };
