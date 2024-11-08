import { Editor } from '@milkdown/kit/core';
import {
  configureLinkTooltip,
  linkTooltipConfig,
  linkTooltipPlugin,
} from '@milkdown/kit/component/link-tooltip';
import { confirmIcon, editIcon, removeIcon, copyIcon } from '../icons';

export function defineLinkTooltipFeature(editor: Editor) {
  editor
    .config(configureLinkTooltip)
    .config((ctx) => {
      ctx.update(linkTooltipConfig.key, (prev) => ({
        ...prev,
        linkIcon: () => copyIcon,
        editButton: () => editIcon,
        removeButton: () => removeIcon,
        confirmButton: () => confirmIcon,
        inputPlaceholder: 'Paste link...',
      }));
    })
    .use(linkTooltipPlugin);
}
