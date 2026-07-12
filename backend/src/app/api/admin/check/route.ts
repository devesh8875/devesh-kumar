import { NextRequest, NextResponse } from 'next/server';

function setCorsHeaders(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 200 });
  return setCorsHeaders(res);
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  
  if (!session || session.value !== 'authenticated') {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    return setCorsHeaders(res);
  }
  
  const res = NextResponse.json({ authenticated: true });
  return setCorsHeaders(res);
}
