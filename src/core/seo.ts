// Pure builders for search-engine data: structured data (schema.org JSON-LD), sitemap and robots.txt.
import { absoluteUrl } from './format';
import type { SiteSettings, Story, Topic } from './types';

type Base = string | URL;
type JsonLd = Record<string, unknown>;

export function organization(site: SiteSettings, base: Base): JsonLd {
  return {
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization', base),
    name: site.name,
    url: absoluteUrl('/', base),
    logo: absoluteUrl(site.logo, base),
    sameAs: [site.youtube.url, site.x.url],
  };
}

export function homeJsonLd(site: SiteSettings, base: Base): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(site, base),
      {
        '@type': 'WebSite',
        '@id': absoluteUrl('/#website', base),
        name: site.name,
        url: absoluteUrl('/', base),
        description: site.description,
        publisher: { '@id': absoluteUrl('/#organization', base) },
      },
    ],
  };
}

export function storyJsonLd(story: Story, site: SiteSettings, base: Base): JsonLd {
  const url = absoluteUrl(`/stories/${story.slug}`, base);
  const org = { '@id': absoluteUrl('/#organization', base) };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(site, base),
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        mainEntityOfPage: url,
        headline: story.title,
        description: story.description,
        image: [absoluteUrl(story.cover.src, base)],
        datePublished: story.publishedAt,
        dateModified: story.updatedAt ?? story.publishedAt,
        author: org,
        publisher: org,
        articleSection: story.topic.name,
        citation: story.sources.map((s) => s.url),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/', base) },
          {
            '@type': 'ListItem',
            position: 2,
            name: story.topic.name,
            item: absoluteUrl(`/topics/${story.topic.slug}`, base),
          },
          { '@type': 'ListItem', position: 3, name: story.title, item: url },
        ],
      },
    ],
  };
}

/** JSON-LD text that is safe inside a <script> tag ("<" can't close the tag). */
export function jsonLdText(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** sitemap.xml listing the main pages, every topic and every story. */
export function sitemapXml(stories: Story[], topics: Topic[], base: Base): string {
  const newest = stories[0]?.updatedAt ?? stories[0]?.publishedAt;
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: '/', lastmod: newest },
    { loc: '/stories', lastmod: newest },
    { loc: '/about' },
    ...topics.map((t) => ({ loc: `/topics/${t.slug}` })),
    ...stories.map((s) => ({ loc: `/stories/${s.slug}`, lastmod: s.updatedAt ?? s.publishedAt })),
  ];
  const rows = urls.map(
    (u) =>
      `  <url><loc>${escapeXml(absoluteUrl(u.loc, base))}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`;
}

/** robots.txt: every crawler welcome, including AI search and training bots (decided Nov 27, 2026). */
export function robotsTxt(base: Base): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml', base)}\n`;
}
