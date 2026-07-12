import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      const res = NextResponse.json({ error: 'No file provided' }, { status: 400 });
      return setCorsHeaders(res);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const filename = `upload-${Date.now()}${ext}`;
    
    // Save to frontend/public/uploads so the frontend can serve it natively
    const uploadDir = path.join(process.cwd(), '../frontend/public/uploads');
    
    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const res = NextResponse.json({ url: `/uploads/${filename}` });
    return setCorsHeaders(res);
  } catch (error) {
    console.error('Error uploading file:', error);
    const res = NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    return setCorsHeaders(res);
  }
}
