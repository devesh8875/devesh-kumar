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

import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Try to get data from KV database first
    const kvData = await kv.get('portfolio-data');
    
    if (kvData) {
      const res = NextResponse.json(kvData);
      return setCorsHeaders(res);
    }

    // Fallback to initial local JSON if KV is empty
    const filePath = path.join(process.cwd(), 'src/data/portfolio-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const res = NextResponse.json(data);
    return setCorsHeaders(res);
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    // If KV fails entirely, fallback to local JSON
    try {
      const filePath = path.join(process.cwd(), 'src/data/portfolio-data.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      const res = NextResponse.json(data);
      return setCorsHeaders(res);
    } catch (fallbackError) {
      const res = NextResponse.json({ error: 'Failed to read portfolio data' }, { status: 500 });
      return setCorsHeaders(res);
    }
  }
}
