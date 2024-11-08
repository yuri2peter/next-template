// https://thememirror.net/create
import { createTheme } from 'thememirror';
import { tags as t } from '@lezer/highlight';

export const colorfulNight = createTheme({
  variant: 'dark',
  settings: {
    background: '#000000',
    foreground: '#e0e0e0',
    caret: '#ffffff',
    selection: '#272525',
    lineHighlight: '#8a91991a',
    gutterBackground: '#000000',
    gutterForeground: '#909192',
  },
  styles: [
    {
      tag: t.comment,
      color: '#039727',
    },
    {
      tag: t.variableName,
      color: '#6cb0f4',
    },
    {
      tag: [t.string, t.special(t.brace)],
      color: '#e2a3ff',
    },
    {
      tag: t.number,
      color: '#ffa061',
    },
    {
      tag: t.bool,
      color: '#ff8aa1',
    },
    {
      tag: t.null,
      color: '#9efffd',
    },
    {
      tag: t.keyword,
      color: '#eeb995',
    },
    {
      tag: t.operator,
      color: '#a29bfd',
    },
    {
      tag: t.className,
      color: '#42f0db',
    },
    {
      tag: t.definition(t.typeName),
      color: '#9ce0f2',
    },
    {
      tag: t.typeName,
      color: '#68e6e8',
    },
    {
      tag: t.angleBracket,
      color: '#f5c27a',
    },
    {
      tag: t.tagName,
      color: '#f7d869',
    },
    {
      tag: t.attributeName,
      color: '#dfbe49',
    },
  ],
});
