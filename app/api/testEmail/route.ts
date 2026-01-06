export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/app/lib/sendGrid/sendEmail';

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log('route',email)
  await sendTestEmail(email);
  return NextResponse.json({ success: true });
}
