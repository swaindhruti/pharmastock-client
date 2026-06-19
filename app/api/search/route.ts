import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection('Pharmastock');

    // 1. Primary Search: Autocomplete with Fuzzy Logic on Name
    let results = await collection.aggregate([
      {
        $search: {
          index: 'drug-search-index',
          autocomplete: {
            query: query,
            path: 'name',
            fuzzy: {
              maxEdits: 1,       // Allows 1 typo character mutation
              prefixLength: 1    // Prevents matching if the first letter is completely wrong
            }
          }
        }
      },
      { $limit: 8 },
      {
        $project: {
          _id: 1,
          name: 1,
          therapeuticClass: '$Therapeutic Class',
          substitutes: 1,
          sideEffects: 1,
          uses: 1,
          score: { $meta: 'searchScore' }
        }
      }
    ]).toArray();

    // 2. Fallback Logic: If no direct results, try substitutes or regex match
    let isFallback = false;
    if (results.length === 0) {
      isFallback = true;
      
      // Try standard Atlas Search on substitutes first
      results = await collection.aggregate([
        {
          $search: {
            index: 'drug-search-index',
            text: {
              query: query,
              path: 'substitutes',
              fuzzy: { maxEdits: 2 }
            }
          }
        },
        { $limit: 5 },
        {
          $project: {
            _id: 1,
            name: 1,
            therapeuticClass: '$Therapeutic Class',
            substitutes: 1,
            sideEffects: 1,
            uses: 1,
            score: { $meta: 'searchScore' }
          }
        }
      ]).toArray();

      // If STILL empty (meaning the Atlas Index might be misconfigured or building), fallback to basic Regex
      if (results.length === 0) {
        console.warn(`Atlas Search index returned 0 results. Falling back to basic regex for: ${query}`);
        results = await collection.aggregate([
          {
            $match: {
              name: { $regex: query, $options: 'i' }
            }
          },
          { $limit: 8 },
          {
            $project: {
              _id: 1,
              name: 1,
              therapeuticClass: '$Therapeutic Class',
              substitutes: 1,
              sideEffects: 1,
              uses: 1
            }
          }
        ]).toArray();
      }
    }

    // Set Edge caching headers so popular searches don't hit the DB continuously
    return new NextResponse(JSON.stringify({ results, isFallback }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
