import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function setCorsHeaders(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 200 });
  return setCorsHeaders(res);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const correctEmail = 'designerdevesh8875@gmail.com';
    const correctPassword = process.env.ADMIN_PASSWORD || 'devesh123';

    if (email === correctEmail && password === correctPassword) {
      const res = NextResponse.json({ success: true });
      res.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Lax is required for sharing credentials cross-port on localhost
        maxAge: 15 * 60, // 15 minutes session expiry
        path: '/',
      });
      return setCorsHeaders(res);
    }

    const res = NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
    return setCorsHeaders(res);
  } catch (error) {
    console.error('Login error:', error);
    const res = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return setCorsHeaders(res);
  }
}
