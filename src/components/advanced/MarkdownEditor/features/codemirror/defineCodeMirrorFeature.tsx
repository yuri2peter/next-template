import {
  codeBlockComponent,
  codeBlockConfig,
} from '@milkdown/kit/component/code-block';
import { basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { Editor } from '@milkdown/kit/core';
import { chevronDownIcon, clearIcon, searchIcon } from '../../icons';
import { colorfulNight } from './theme';

export function defineCodeMirrorFeature(editor: Editor) {
  editor
    .config(async (ctx) => {
      ctx.update(codeBlockConfig.key, (defaultConfig) => ({
        ...defaultConfig,
        extensions: [
          keymap.of(defaultKeymap.concat(indentWithTab)),
          basicSetup,
          colorfulNight,
        ],
        languages,
        clearSearchIcon: () => clearIcon,
        expandIcon: () => chevronDownIcon,
        searchIcon: () => searchIcon,
      }));
    })
    .use(codeBlockComponent);
}
