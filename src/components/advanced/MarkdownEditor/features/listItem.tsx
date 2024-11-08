import { Editor } from '@milkdown/kit/core';
import {
  listItemBlockComponent,
  listItemBlockConfig,
} from '@milkdown/kit/component/list-item-block';
import { html } from 'atomico';
import clsx from 'clsx';
import {
  bulletIcon,
  checkBoxCheckedIcon,
  checkBoxUncheckedIcon,
} from '../icons';

export function defineListItemFeature(editor: Editor) {
  editor
    .config((ctx) => {
      ctx.set(listItemBlockConfig.key, {
        renderLabel: ({ label, listType, checked, readonly }) => {
          if (checked == null) {
            if (listType === 'bullet')
              return html`<span class="label">${bulletIcon}</span>`;

            return html`<span class="label">${label}</span>`;
          }

          if (checked)
            return html`<span
              class=${clsx('label checkbox', readonly && 'readonly')}
              >${checkBoxCheckedIcon}</span
            >`;

          return html`<span
            class=${clsx('label checkbox', readonly && 'readonly')}
            >${checkBoxUncheckedIcon}</span
          >`;
        },
      });
    })
    .use(listItemBlockComponent);
}
