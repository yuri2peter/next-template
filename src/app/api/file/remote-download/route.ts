import { NextRequest, NextResponse } from 'next/server';
import { remoteDownload } from './lib';
import { authCheck } from '../../authCheck';

// download file from remote src
export async function POST(req: NextRequest) {
  const authRes = await authCheck(req);
  if (authRes) {
    return authRes;
  }
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: 'No url' }, { status: 400 });
  }
  try {
    const data = await remoteDownload(url);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
