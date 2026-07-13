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

import clientPromise from '@/lib/mongodb';

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

    // Try saving to MongoDB Atlas first (Production)
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db('portfolio_db');
        const collection = db.collection<{ _id: string; data: any; updatedAt?: Date }>('portfolio_data');
        
        // Upsert the main document
        await collection.updateOne(
          { _id: 'main' },
          { $set: { data: newData, updatedAt: new Date() } },
          { upsert: true }
        );
        
        const res = NextResponse.json({ success: true });
        return setCorsHeaders(res);
      } catch (mongoError) {
        console.warn('MongoDB save failed, falling back to local file system', mongoError);
      }
    }

    // Fallback for local development
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
