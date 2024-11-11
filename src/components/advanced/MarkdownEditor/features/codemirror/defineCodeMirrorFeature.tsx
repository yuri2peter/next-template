import {
  codeBlockComponent,
  codeBlockConfig,
} from '@milkdown/kit/component/code-block';
import { basicSetup, EditorView } from 'codemirror';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { Editor } from '@milkdown/kit/core';
import { chevronDownIcon, clearIcon, searchIcon } from '../../icons';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { inlineCopilot } from 'codemirror-copilot';

const enableCopilot = false; // TODO get configs from user

export function defineCodeMirrorFeature(editor: Editor) {
  editor
    .config(async (ctx) => {
      ctx.update(codeBlockConfig.key, (defaultConfig) => ({
        ...defaultConfig,
        extensions: [
          keymap.of(defaultKeymap.concat(indentWithTab)),
          basicSetup,
          // colorfulNight,
          vscodeDark,
          EditorView.lineWrapping,
          enableCopilot ? copilot() : [],
        ],
        languages,
        clearSearchIcon: () => clearIcon,
        expandIcon: () => chevronDownIcon,
        searchIcon: () => searchIcon,
      }));
    })
    .use(codeBlockComponent);
}

function copilot() {
  return inlineCopilot(async (prefix, suffix) => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `You are a programmer that replaces <FILL_ME> part with the right code.
Only output the code that replaces <FILL_ME> part.
Do not add any explanation or markdown.

<CODE>${prefix}<FILL_ME>${suffix}</CODE>
`,
        history: [],
        stream: false,
      }),
    });
    const { result } = await res.json();
    return result;
  });
}
