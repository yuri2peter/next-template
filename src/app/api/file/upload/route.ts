import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs-extra';
import { shortId } from '@/lib/string';
import { IS_DEV_SERVER } from '@/lib/server';

export async function POST(req: NextRequest) {
  if (!IS_DEV_SERVER) {
    return NextResponse.json({
      error: 'Not allowed in production mode',
    });
  }
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name;
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);
  const newFilename = `${basename}-${shortId()}${extname}`;
  const filePath = path.join(process.cwd(), 'public/uploads', newFilename);
  fs.ensureFileSync(filePath);
  await fs.writeFile(filePath, fileBuffer);
  return NextResponse.json({
    filename: newFilename,
    url: `/uploads/${newFilename}`,
  });
}
