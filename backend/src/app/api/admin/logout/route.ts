import { NextResponse } from 'next/server';

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

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  // Clear the admin_session cookie immediately by setting expires to 1970
  res.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  
  return setCorsHeaders(res);
}
