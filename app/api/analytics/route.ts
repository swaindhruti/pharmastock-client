import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profession, gender, purpose } = body;

    // Grab IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    let ip = '127.0.0.1';
    
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp.trim();
    }

    // Default geo
    let geo = {
      country: 'Unknown',
      countryCode: 'Unknown',
      region: 'Unknown',
      regionName: 'Unknown',
      city: 'Unknown',
      lat: 0,
      lon: 0,
    };

    // If running locally, fetch the public IP so testing works
    if (ip === '127.0.0.1' || ip === '::1') {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          ip = ipData.ip;
        }
      } catch (err) {
        console.error('Failed to resolve local IP for testing');
      }
    }

    try {
      // Fetch geo data server-side to avoid CORS/Mixed-Content issues
      const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
          geo = {
            country: geoData.country,
            countryCode: geoData.countryCode,
            region: geoData.region,
            regionName: geoData.regionName,
            city: geoData.city,
            lat: geoData.lat,
            lon: geoData.lon,
          };
        }
      }
    } catch (err) {
      console.error('Geo IP fetch error:', err);
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection('platform-usage-analytics');

    await collection.insertOne({
      ip,
      profession,
      gender,
      purpose,
      ...geo,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
