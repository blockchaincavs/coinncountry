// Builds schema.org structured data (JSON-LD) that Google reads.
import { absoluteUrl } from './format.js';

export function organization(site, base) {
  return {
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization', base),
    name: site.name,
    url: absoluteUrl('/', base),
    logo: absoluteUrl(site.logo, base),
    sameAs: [site.youtube.url, site.x.url],
  };
}

export function homeJsonLd(site, base) {
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

export function storyJsonLd(story, site, base) {
  const url = absoluteUrl(`/stories/${story.slug}`, base);
  const graph = [
    organization(site, base),
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      mainEntityOfPage: url,
      headline: story.title,
      description: story.description,
      image: [absoluteUrl(story.cover.src, base)],
      datePublished: story.publishedAt,
      dateModified: story.updatedAt || story.publishedAt,
      author: { '@id': absoluteUrl('/#organization', base) },
      publisher: { '@id': absoluteUrl('/#organization', base) },
      articleSection: story.topic.name,
      citation: story.sources.map((s) => s.url),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/', base) },
        { '@type': 'ListItem', position: 2, name: story.topic.name, item: absoluteUrl(`/topics/${story.topic.slug}`, base) },
        { '@type': 'ListItem', position: 3, name: story.title, item: url },
      ],
    },
  ];
  return { '@context': 'https://schema.org', '@graph': graph };
}
