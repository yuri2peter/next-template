import fs from 'fs-extra';
import path from 'path';
import { UPLOADS_PATH } from '../path';

export async function saveDataToPublic(
  data: string | NodeJS.ArrayBufferView,
  filename: string
) {
  const savePath = path.join(UPLOADS_PATH, filename);
  const url = `/uploads/${filename}`;
  await fs.ensureDir(UPLOADS_PATH);
  await fs.writeFile(savePath, data);
  return url;
}
