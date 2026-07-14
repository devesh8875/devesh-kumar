import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

function setCorsHeaders(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*'); // Allow frontend to submit
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 200 });
  return setCorsHeaders(res);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      const res = NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
      return setCorsHeaders(res);
    }

    const messageDocument = {
      ...data,
      createdAt: new Date(),
      status: 'unread'
    };

    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db('portfolio_db');
      const collection = db.collection('contact_messages');
      await collection.insertOne(messageDocument);
      
      const res = NextResponse.json({ success: true, message: 'Message sent successfully!' });
      return setCorsHeaders(res);
    } else {
      // For local dev without MongoDB
      console.warn('MongoDB not configured. Mocking save for message:', messageDocument);
      const res = NextResponse.json({ success: true, message: 'Message sent successfully! (Mocked)' });
      return setCorsHeaders(res);
    }
  } catch (error) {
    console.error('Error saving contact message:', error);
    const res = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return setCorsHeaders(res);
  }
}
