import fs from 'fs-extra';
import path from 'path';
import { STATIC_DATA_PATH } from '@/lib/path';

export function getMarkdownExample() {
  return fs.readFile(
    path.resolve(STATIC_DATA_PATH, 'markdown-example.md'),
    'utf8'
  );
}
