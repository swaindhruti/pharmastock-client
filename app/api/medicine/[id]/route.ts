import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: idParam } = resolvedParams;
    const id = idParam.split('-')[0];

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid medicine ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection('Pharmastock');

    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
