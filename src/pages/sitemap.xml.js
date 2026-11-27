// sitemap.xml: the list of pages for Google. Built live from the stories.
import { getAllStories, getTopics } from '../lib/stories.js';

export async function GET({ site }) {
  const [stories, topics] = await Promise.all([getAllStories(), getTopics()]);
  const newest = stories[0]?.updatedAt || stories[0]?.publishedAt;
  const urls = [
    { loc: '/', lastmod: newest },
    { loc: '/stories', lastmod: newest },
    { loc: '/about' },
    ...topics.map((t) => ({ loc: `/topics/${t.slug}` })),
    ...stories.map((s) => ({ loc: `/stories/${s.slug}`, lastmod: s.updatedAt || s.publishedAt })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u.loc, site)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
