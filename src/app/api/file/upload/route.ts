import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs-extra';
import busboy from 'busboy';
import { shortId } from '@/lib/string';
import { ALLOW_UPLOAD } from '@/lib/server';
import { ReadableStream } from 'stream/web';
import { Readable } from 'stream';
import { UPLOADS_PATH } from '@/lib/path';

// upload file( only one file at a time )
export async function POST(req: NextRequest) {
  if (!ALLOW_UPLOAD) {
    return NextResponse.json(
      {
        error: 'Not allowed based on server configuration',
      },
      { status: 403 }
    );
  }
  if (!req.body) {
    return NextResponse.json(
      {
        error: 'No body',
      },
      { status: 400 }
    );
  }
  const bb = busboy({
    headers: Object.fromEntries(req.headers),
    defCharset: 'utf8',
  });

  const result: {
    filename: string;
    url: string;
  } = {
    filename: '',
    url: '',
  };

  bb.on('file', (name, file, info) => {
    // somehow the filename is encoded in latin1
    const filename = Buffer.from(info.filename, 'latin1').toString('utf8');
    const extname = path.extname(filename);
    const basename = path.basename(filename, extname);
    const newFilename = `${basename}-${shortId()}${extname}`;
    const filePath = path.join(UPLOADS_PATH, newFilename);
    if (!result.filename) {
      fs.ensureFileSync(filePath);
      result.filename = newFilename;
      result.url = `/uploads/${newFilename}`;
      file.pipe(fs.createWriteStream(filePath));
    }
  });

  Readable.fromWeb(req.body as ReadableStream).pipe(bb); // .fromWeb() method

  return new Promise<NextResponse>((resolve) => {
    bb.on('close', () => {
      if (!result.filename) {
        resolve(
          NextResponse.json(
            {
              error: 'No file uploaded',
            },
            { status: 400 }
          )
        );
      } else {
        resolve(NextResponse.json(result));
      }
    });
  });
}
