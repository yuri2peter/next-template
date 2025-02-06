import path from 'path';

// const IS_DEV_SERVER = process.env.NODE_ENV === 'development';
export const CWD = process.cwd();
export const STATIC_DATA_PATH = path.resolve(CWD, 'data/static');
export const RUNTIME_DATA_PATH = path.resolve(CWD, 'data/runtime');
export const UPLOADS_PATH = path.resolve(RUNTIME_DATA_PATH, 'uploads');

// When output in standalone mode, the public path need to be exported so that the builder will copy the public folder to the output folder
export const PUBLIC_PATH = path.resolve(CWD, 'public');
