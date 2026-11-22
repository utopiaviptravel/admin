import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { COOKIE, SESSION_DAYS, signSession } from '@/lib/auth';
import Admin from '@/models/Admin';

export async function POST(req) {
  const { email = '', password = '' } = await req.json().catch(() => ({}));
  if (!email.trim() || !password) {
    return NextResponse.json({ error: 'შეიყვანე ელფოსტა და პაროლი' }, { status: 400 });
  }

  await connectDB();
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
  const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.json({ error: 'ელფოსტა ან პაროლი არასწორია' }, { status: 401 });
  }

  const token = await signSession({ sub: String(admin._id), email: admin.email, name: admin.name });
  const res = NextResponse.json({ ok: true, name: admin.name });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
  return res;
}
