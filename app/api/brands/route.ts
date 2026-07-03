import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection('Pharmastock');

    // Retrieve unique manufacturer values
    const brands = await collection.distinct('manufacturer');
    
    // Filter out any null, empty or undefined brand values
    const filteredBrands = Array.from(
      new Set(
        brands
          .map((b) => (typeof b === 'string' ? b.trim() : ''))
          .filter((b) => b !== '')
      )
    );

    // Sort alphabetically case-insensitively
    filteredBrands.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );

    return new NextResponse(JSON.stringify(filteredBrands), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
