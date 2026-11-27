// Shapes of the site's data. A story is one JSON file today and one Appwrite document later.

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  youtube: { url: string; handle: string };
  x: { url: string; handle: string };
  showAdPlaceholders: boolean;
}

export interface Topic {
  name: string;
  slug: string;
}

export interface TopicWithCount extends Topic {
  count: number;
}

export interface Paragraph {
  type: 'p';
  text: string;
}
export interface PullQuote {
  type: 'quote';
  text: string;
}
export interface ThenNow {
  type: 'thenNow';
  then: { label: string; text: string };
  now: { label: string; text: string };
}
export type Block = Paragraph | PullQuote | ThenNow;

export interface Chapter {
  id: string;
  title: string;
  blocks: Block[];
}

export interface TimelineEntry {
  year: number;
  label: string;
  /** true puts this year on the homepage timeline. */
  home?: boolean;
  /** Optional picture for the homepage timeline (falls back to the story cover). */
  image?: string;
}

export interface ShortVideo {
  title: string;
  cover: string;
  youtubeId?: string;
}

export interface Source {
  title: string;
  publisher: string;
  url: string;
}

export interface Story {
  slug: string;
  status: 'published' | 'draft';
  featured?: boolean;
  title: string;
  seoTitle?: string;
  description: string;
  dek: string;
  summary: string;
  topic: Topic;
  /** Calendar dates as YYYY-MM-DD. */
  publishedAt: string;
  updatedAt?: string;
  factCheckedAt?: string;
  note?: string;
  cover: { src: string; alt: string; credit?: string };
  links?: { youtubeVideoId?: string; videoMinutes?: number; xPostUrl?: string };
  shorts?: ShortVideo[];
  keyFacts?: string[];
  timeline?: TimelineEntry[];
  chapters: Chapter[];
  yourTake?: string;
  sources: Source[];
}
