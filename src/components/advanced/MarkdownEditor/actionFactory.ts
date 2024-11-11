import { Editor } from '@milkdown/kit/core';
import { replaceAll, getMarkdown, insert } from '@milkdown/kit/utils';

export function createEditorActions(editor: Editor) {
  return {
    replaceAll: (markdown: string) => editor.action(replaceAll(markdown)),
    getMarkdown: () => editor.action(getMarkdown()),
    insert: (markdown: string) => editor.action(insert(markdown)),
  };
}

export type EditorActions = ReturnType<typeof createEditorActions>;
