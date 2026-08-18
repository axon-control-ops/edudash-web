import type { MetadataRoute } from 'next';

// Falls back to the live domain. The previous fallback pointed at
// edudashpro.com, which does not resolve, so every URL published to search
// engines named a dead host. NEXT_PUBLIC_WEB_URL is checked too because
// src/lib/metadata/jobPosting.ts already uses that name.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_WEB_URL ||
  'https://edudashpro.org.za'
).replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/registration`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/aftercare`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/popia`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
