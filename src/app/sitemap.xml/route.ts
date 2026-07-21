import { getAllPostSlugs } from '@/lib/blog';

export const dynamic = 'force-static';

export async function GET() {
  const slugs = getAllPostSlugs();
  const siteUrl = 'https://happy-coder-yhy.github.io';

  const staticPages = [
    '',
    '/blog',
    '/projects',
    '/research',
    '/en',
    '/en/blog',
    '/en/projects',
    '/en/research'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' || page === '/en' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
  ${slugs
    .flatMap((slug) => [
      `
  <url>
    <loc>${siteUrl}/blog/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
      `
  <url>
    <loc>${siteUrl}/en/blog/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ])
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600'
    }
  });
}
