import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const brand = searchParams.get('brand');

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection('Pharmastock');

    // 1. Primary Search: Autocomplete with Fuzzy Logic on Name
    let results = [];
    try {
      const pipeline: any[] = [];
      if (brand) {
        pipeline.push({
          $search: {
            index: 'drug-search-index',
            compound: {
              must: [
                {
                  autocomplete: {
                    query: query,
                    path: 'name',
                    fuzzy: {
                      maxEdits: 1,
                      prefixLength: 1
                    }
                  }
                }
              ],
              filter: [
                {
                  text: {
                    query: brand,
                    path: 'manufacturer'
                  }
                }
              ]
            }
          }
        });
      } else {
        pipeline.push({
          $search: {
            index: 'drug-search-index',
            autocomplete: {
              query: query,
              path: 'name',
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1
              }
            }
          }
        });
      }

      pipeline.push(
        { $limit: 8 },
        {
          $project: {
            _id: 1,
            name: 1,
            therapeuticClass: '$Therapeutic Class',
            substitutes: 1,
            sideEffects: 1,
            uses: 1,
            composition: 1,
            manufacturer: 1,
            form: 1,
            score: { $meta: 'searchScore' }
          }
        }
      );
      results = await collection.aggregate(pipeline).toArray();
    } catch (searchError) {
      console.warn('Atlas Search primary compound query failed. Falling back to search + match filter:', searchError);
      const pipeline: any[] = [
        {
          $search: {
            index: 'drug-search-index',
            autocomplete: {
              query: query,
              path: 'name',
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1
              }
            }
          }
        },
        ...(brand ? [{ $match: { manufacturer: brand } }] : []),
        { $limit: 8 },
        {
          $project: {
            _id: 1,
            name: 1,
            therapeuticClass: '$Therapeutic Class',
            substitutes: 1,
            sideEffects: 1,
            uses: 1,
            composition: 1,
            manufacturer: 1,
            form: 1,
            score: { $meta: 'searchScore' }
          }
        }
      ];
      results = await collection.aggregate(pipeline).toArray();
    }

    // 2. Fallback Logic: If no direct results, try substitutes or regex match
    let isFallback = false;
    if (results.length === 0) {
      isFallback = true;
      
      // Try standard Atlas Search on substitutes first
      try {
        const pipeline: any[] = [];
        if (brand) {
          pipeline.push({
            $search: {
              index: 'drug-search-index',
              compound: {
                must: [
                  {
                    text: {
                      query: query,
                      path: 'substitutes',
                      fuzzy: { maxEdits: 2 }
                    }
                  }
                ],
                filter: [
                  {
                    text: {
                      query: brand,
                      path: 'manufacturer'
                    }
                  }
                ]
              }
            }
          });
        } else {
          pipeline.push({
            $search: {
              index: 'drug-search-index',
              text: {
                query: query,
                path: 'substitutes',
                fuzzy: { maxEdits: 2 }
              }
            }
          });
        }

        pipeline.push(
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              name: 1,
              therapeuticClass: '$Therapeutic Class',
              substitutes: 1,
              sideEffects: 1,
              uses: 1,
              composition: 1,
              manufacturer: 1,
              form: 1,
              score: { $meta: 'searchScore' }
            }
          }
        );
        results = await collection.aggregate(pipeline).toArray();
      } catch (fallbackSearchErr) {
        console.warn('Atlas Search fallback substitutes compound query failed. Falling back to search + match filter:', fallbackSearchErr);
        const pipeline = [
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
          ...(brand ? [{ $match: { manufacturer: brand } }] : []),
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              name: 1,
              therapeuticClass: '$Therapeutic Class',
              substitutes: 1,
              sideEffects: 1,
              uses: 1,
              composition: 1,
              manufacturer: 1,
              form: 1,
              score: { $meta: 'searchScore' }
            }
          }
        ];
        results = await collection.aggregate(pipeline).toArray();
      }

      // If STILL empty (meaning the Atlas Index might be misconfigured or building), fallback to basic Regex
      if (results.length === 0) {
        console.warn(`Atlas Search index returned 0 results. Falling back to basic regex for: ${query}`);
        const matchStage: any = {
          name: { $regex: query, $options: 'i' }
        };
        if (brand) {
          matchStage.manufacturer = brand;
        }
        results = await collection.aggregate([
          {
            $match: matchStage
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
              composition: 1,
              manufacturer: 1,
              form: 1
            }
          }
        ]).toArray();
      }
    }

    // Track search query for analytics (fire and forget)
    db.collection('search-analytics').insertOne({ 
      query: query.toLowerCase(), 
      isFallback, 
      timestamp: new Date() 
    }).catch(e => console.error('Failed to log search:', e));

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
