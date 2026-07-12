import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'authenticated') {
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return setCorsHeaders(res);
    }

    const newData = await request.json();

    if (!newData.profile || !newData.skills || !newData.experience || !newData.projects) {
      const res = NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
      return setCorsHeaders(res);
    }

    const filePath = path.join(process.cwd(), 'src/data/portfolio-data.json');
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8');

    const res = NextResponse.json({ success: true });
    return setCorsHeaders(res);
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    const res = NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    return setCorsHeaders(res);
  }
}
