import type { APIRoute } from 'astro';

const pages = [
  '/',
  '/services',
  '/pricing',
  '/about',
  '/small-business-web-design',
  '/web-design-somerset',
  '/websites-for-trades'
];

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ?? new URL('https://avocadosignal.co.uk');
  const urls = pages
    .map((path) => `  <url>\n    <loc>${new URL(path, baseUrl).href}</loc>\n  </url>`)
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
