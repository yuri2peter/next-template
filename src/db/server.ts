import fs from 'fs-extra';
import jsonServer from 'json-server';
import { DB_PATH, DB_PORT } from './defines';
import path from 'path';
import { RUNTIME_DATA_PATH } from '@/lib/path';
import dayjs from 'dayjs';
import { debounce } from 'radashi';
import { detect } from 'detect-port';
import { z } from 'zod';

export default async function startDbServer() {
  if (!(await portCheck())) {
    return;
  }
  await dbFileFix();
  await startJsonServer();
}

async function portCheck() {
  const port = await detect(DB_PORT);
  if (port !== DB_PORT) {
    console.warn(`Port ${DB_PORT} is already in use, Db server will not start`);
    return false;
  }
  return true;
}

async function dbFileFix() {
  await fs.ensureFile(DB_PATH);
  const data = await fs.readJSON(DB_PATH).catch(() => {});
  const DataSchema = z.object({});
  const { success, data: fixedData } = DataSchema.safeParse(data);
  if (success) {
    await fs.writeJSON(DB_PATH, fixedData);
  } else {
    await fs.writeJSON(DB_PATH, DataSchema.parse({}));
  }
}

async function startJsonServer() {
  const server = jsonServer.create();
  const router = jsonServer.router(DB_PATH);
  const middlewares = jsonServer.defaults();
  const backupMiddleware: (typeof middlewares)[number] = (req, _res, next) => {
    next();
    if (req.method !== 'GET') {
      backupDbDebounced();
    }
  };

  server.use([...middlewares, backupMiddleware]);
  server.use(router);
  server.listen(DB_PORT, () => {
    console.log('JSON Server is running on port ' + DB_PORT);
  });
}

const backupDb = async () => {
  try {
    const filePath = path.resolve(
      RUNTIME_DATA_PATH,
      'db-backups',
      'db-' + dayjs().format('YYYY-MM-DD-HH') + '.json'
    );
    await fs.ensureFile(filePath);
    await fs.copyFile(DB_PATH, filePath);
  } catch (error) {
    console.error(error);
  }
};
const backupDbDebounced = debounce({ delay: 1000 }, backupDb);
