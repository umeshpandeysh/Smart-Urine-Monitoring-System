import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smart-urine-monitoring-system.vercel.app';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/technology',
    '/how-it-works',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/login',
    '/patient-portal',
    '/admin-center',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
