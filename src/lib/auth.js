import { SignJWT, jwtVerify } from 'jose';

// works in middleware (edge) and in API routes
export const COOKIE = 'utopia_admin';
export const SESSION_DAYS = 7;

function key() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is missing in .env.local');
  return new TextEncoder().encode(secret);
}

export async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(key());
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload;
  } catch {
    return null;
  }
}
