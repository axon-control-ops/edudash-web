import type { MetadataRoute } from 'next';

// /robots.txt previously 404'd: there was no robots source at all, so crawlers
// got no directives and no pointer to the sitemap.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_WEB_URL ||
  'https://edudashpro.org.za'
).replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Internals and one-off application URLs carry no search value.
        disallow: ['/api/', '/_next/', '/auth/', '/data-deletion'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
