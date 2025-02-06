import { NextRequest, NextResponse } from 'next/server';
import startDbServer from '@/db/server';
import isLocalhost from 'is-localhost-ip';

export async function GET(request: NextRequest) {
  const headers = request.headers;
  const ip =
    headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown';
  const isLocal = await isLocalhost(ip);
  if (!isLocal) {
    return NextResponse.json({ message: 'Access denied' }, { status: 403 });
  }
  console.log('Init request received.');
  await startDbServer();
  return new NextResponse('Server initialized.');
}
