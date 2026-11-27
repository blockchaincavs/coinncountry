import type { SiteSettings, Story } from '../src/core/types';

export const site: SiteSettings = {
  name: 'CoinNCountry',
  tagline: 'Tagline',
  description: 'Site description',
  logo: '/media/logo.png',
  youtube: { url: 'https://www.youtube.com/@CoinNCountry', handle: '@CoinNCountry' },
  x: { url: 'https://x.com/CoinNCountry', handle: '@CoinNCountry' },
  showAdPlaceholders: true,
};

export function story(over: Partial<Story> = {}): Story {
  return {
    slug: 'a-story',
    status: 'published',
    title: 'A story',
    description: 'Description',
    dek: 'Dek',
    summary: 'Summary text',
    topic: { name: 'Money', slug: 'money' },
    publishedAt: '2026-11-27',
    cover: { src: '/media/a/cover.jpg', alt: 'Alt' },
    chapters: [{ id: 'one', title: 'One', blocks: [{ type: 'p', text: 'Hello world' }] }],
    sources: [{ title: 'Src', publisher: 'Pub', url: 'https://example.com' }],
    ...over,
  };
}
