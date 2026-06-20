import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/contact'], 
    },
    sitemap: 'https://smartdrugfinder.com/sitemap.xml',
  };
}
