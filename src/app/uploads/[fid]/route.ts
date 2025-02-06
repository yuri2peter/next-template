import path from 'path';
import fs from 'fs/promises';
import mime from 'mime';
import { NextResponse, NextRequest } from 'next/server';
import { UPLOADS_PATH } from '@/lib/path';

export async function GET(req: NextRequest) {
  // handle static uploads
  const respath = req.nextUrl.pathname;
  if (respath.startsWith('/uploads/')) {
    const fileName = decodeURIComponent(respath.split('/').pop() || '');
    const filePath = path.resolve(UPLOADS_PATH, fileName);
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return new NextResponse('File not found', { status: 404 });
    }
    const fileHandle = await fs.open(filePath, 'r');
    const fileStream = fileHandle.createReadStream();
    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
    });
    return new NextResponse(webStream, {
      status: 200,
      headers: new Headers({
        'content-type': mime.getType(fileName) || 'application/octet-stream',
        'content-length': stats.size + '',
        'cache-control': 'public, max-age=31536000, immutable',
      }),
    });
  }
}
