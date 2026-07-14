import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db('portfolio_db');
      const collection = db.collection('contact_messages');
      const messages = await collection.find({}).sort({ createdAt: -1 }).toArray();
      
      return NextResponse.json({ messages });
    } else {
      console.warn('MongoDB not configured. Returning empty messages list.');
      return NextResponse.json({ messages: [] });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
