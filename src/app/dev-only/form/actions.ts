'use server';

import { sleep } from '@/lib/time';
import { DataSchema } from './schema';

export async function formTest(body: unknown) {
  // sim delay
  await sleep(1000);
  // sim error
  if (Math.random() > 0.7) {
    throw new Error('Simulated error');
  }
  const data = DataSchema.parse(body);
  return { ...data, timestamp: new Date().toISOString() };
}
