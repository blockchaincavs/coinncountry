import { homeJsonLd, jsonLdText, robotsTxt, sitemapXml, storyJsonLd } from '../../src/core/seo';
import { site, story } from '../fixtures';

const base = 'https://coinncountry.com';

describe('structured data', () => {
  it('describes the brand and website on the homepage', () => {
    const data = homeJsonLd(site, base) as { '@graph': Record<string, unknown>[] };
    expect(data['@graph'][0]).toMatchObject({
      '@type': 'Organization',
      logo: 'https://coinncountry.com/media/logo.png',
      sameAs: [site.youtube.url, site.x.url],
    });
    expect(data['@graph'][1]).toMatchObject({
      '@type': 'WebSite',
      url: 'https://coinncountry.com/',
    });
  });

  it('describes a story as an Article with breadcrumbs', () => {
    const s = story({ updatedAt: '2026-11-28' });
    const graph = (storyJsonLd(s, site, base) as { '@graph': Record<string, unknown>[] })['@graph'];
    expect(graph[1]).toMatchObject({
      '@type': 'Article',
      headline: 'A story',
      image: ['https://coinncountry.com/media/a/cover.jpg'],
      datePublished: '2026-11-27',
      dateModified: '2026-11-28',
      citation: ['https://example.com'],
    });
    expect(JSON.stringify(graph[2])).toContain('https://coinncountry.com/topics/money');
  });

  it('uses the publish date when there is no update date', () => {
    const graph = (storyJsonLd(story(), site, base) as { '@graph': Record<string, unknown>[] })[
      '@graph'
    ];
    expect(graph[1]).toMatchObject({ dateModified: '2026-11-27' });
  });

  it('escapes "<" so story text cannot close the script tag', () => {
    expect(jsonLdText({ a: '</script><b>' })).toBe('{"a":"\\u003c/script>\\u003cb>"}');
  });
});

describe('sitemapXml', () => {
  it('lists main pages, topics and stories with dates', () => {
    const xml = sitemapXml(
      [story({ slug: 'new', updatedAt: '2026-11-28' }), story({ slug: 'old' })],
      [{ name: 'Money', slug: 'money' }],
      base,
    );
    expect(xml).toContain('<loc>https://coinncountry.com/</loc><lastmod>2026-11-28</lastmod>');
    expect(xml).toContain('<loc>https://coinncountry.com/about</loc></url>');
    expect(xml).toContain('<loc>https://coinncountry.com/topics/money</loc>');
    expect(xml).toContain(
      '<loc>https://coinncountry.com/stories/old</loc><lastmod>2026-11-27</lastmod>',
    );
  });

  it('works with no stories and escapes special characters', () => {
    const xml = sitemapXml([], [{ name: 'A&B', slug: 'a&b' }], base);
    expect(xml).toContain('<loc>https://coinncountry.com/</loc></url>');
    expect(xml).toContain('a&amp;b');
  });

  it('uses the publish date of the newest story when it was never updated', () => {
    expect(sitemapXml([story()], [], base)).toContain(
      '<loc>https://coinncountry.com/</loc><lastmod>2026-11-27</lastmod>',
    );
  });
});

describe('robotsTxt', () => {
  it('allows every crawler and points to the sitemap', () => {
    expect(robotsTxt(base)).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://coinncountry.com/sitemap.xml\n',
    );
  });
});
