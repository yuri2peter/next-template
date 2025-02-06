import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function authCheck(_request: NextRequest) {
  // TODO: implement auth check
  const verified = true;
  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
