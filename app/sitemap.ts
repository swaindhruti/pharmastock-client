import { MetadataRoute } from 'next';
import clientPromise from '@/lib/mongodb';

export const revalidate = 86400; // Revalidate sitemap every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://smartdrugfinder.com';

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'pharmastock');
    
    // Fetch up to 40,000 top medicines for the sitemap from Pharmastock collection
    const medicines = await db.collection('Pharmastock')
      .find({}, { projection: { _id: 1, name: 1, updatedAt: 1 } })
      .limit(40000)
      .toArray();

    const medicineUrls: MetadataRoute.Sitemap = medicines.map((med) => {
      const slug = `${med._id}-${med.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      return {
        url: `${baseUrl}/medicine/${slug}`,
        lastModified: med.updatedAt ? new Date(med.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      ...medicineUrls,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return base URL if DB fails
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 }
    ];
  }
}
