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

import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Try to get data from MongoDB first
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db('portfolio_db');
        const collection = db.collection<{ _id: string; data: any }>('portfolio_data');
        
        // Find the single document storing the portfolio data
        const mongoData = await collection.findOne({ _id: 'main' });
        
        if (mongoData && mongoData.data) {
          const res = NextResponse.json(mongoData.data);
          return setCorsHeaders(res);
        }
      } catch (mongoError) {
        console.warn('MongoDB connection/query failed, falling back to local file', mongoError);
      }
    }

    // Fallback to initial local JSON if MongoDB is empty or disconnected
    const filePath = path.join(process.cwd(), 'src/data/portfolio-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const res = NextResponse.json(data);
    return setCorsHeaders(res);
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    // If fallback fails entirely
    const res = NextResponse.json({ error: 'Failed to read portfolio data' }, { status: 500 });
    return setCorsHeaders(res);
  }
}
