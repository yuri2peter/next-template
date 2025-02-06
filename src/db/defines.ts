import path from 'path';
import { RUNTIME_DATA_PATH } from '@/lib/path';

export const DB_PATH = path.resolve(RUNTIME_DATA_PATH, 'db.json');
export const DB_PORT = 4000;
export const DB_ORIGIN = `http://localhost:${DB_PORT}`;
