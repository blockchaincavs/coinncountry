// sitemap.xml: the list of pages for Google, built live from the stories.
import type { APIRoute } from 'astro';
import { loadSiteData } from '../site-data';
import { sitemapXml } from '../core/seo';

export const GET: APIRoute = async ({ site, url }) => {
  const { stories, topics } = await loadSiteData();
  return new Response(sitemapXml(stories, topics, site ?? url), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
