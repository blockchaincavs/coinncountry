// Pure rules for choosing and ordering stories. No file or network access here.
import type { ShortVideo, Story, TimelineEntry, TopicWithCount } from './types';

/** Published stories, newest first; a "featured" story goes first among same-day stories. */
export function publishedStories(all: Story[]): Story[] {
  return all
    .filter((s) => s.status !== 'draft')
    .sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) ||
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        a.title.localeCompare(b.title),
    );
}

/** Lead story for the homepage: the one marked "featured", or else the first (newest). */
export function pickLead(stories: Story[]): Story | undefined {
  return stories.find((s) => s.featured) ?? stories[0];
}

/** Topics that have at least one story, in the order they first appear. */
export function topicsOf(stories: Story[]): TopicWithCount[] {
  const seen = new Map<string, TopicWithCount>();
  for (const s of stories) {
    const t = seen.get(s.topic.slug) ?? { ...s.topic, count: 0 };
    t.count++;
    seen.set(s.topic.slug, t);
  }
  return [...seen.values()];
}

export interface HomeTimelineItem extends TimelineEntry {
  story: Story;
}

/** Every year marked "home" in any story, oldest first. */
export function homeTimeline(stories: Story[]): HomeTimelineItem[] {
  return stories
    .flatMap((s) => (s.timeline ?? []).filter((t) => t.home).map((t) => ({ ...t, story: s })))
    .sort((a, b) => a.year - b.year);
}

/** Up to `max` Shorts for the homepage, taking one from each story in turn. */
export function shortsRow(stories: Story[], max = 4): { short: ShortVideo; story: Story }[] {
  const out: { short: ShortVideo; story: Story }[] = [];
  const rounds = Math.max(0, ...stories.map((s) => s.shorts?.length ?? 0));
  for (let round = 0; round < rounds && out.length < max; round++) {
    for (const story of stories) {
      const short = story.shorts?.[round];
      if (short && out.length < max) out.push({ short, story });
    }
  }
  return out;
}

/** Other stories to suggest at the end of a story. */
export function readNext(stories: Story[], current: Story, max = 2): Story[] {
  return stories.filter((s) => s.slug !== current.slug).slice(0, max);
}

/** Chapter indexes (0-based) that get an in-article ad after them: after chapter 1 and 3, never after the last. */
export function adBreaks(chapterCount: number): Set<number> {
  return new Set([0, 2].filter((i) => i < chapterCount - 1));
}

/** How many story cards sit between two ads in a story list. Change this one number to change every list. */
export const STORIES_PER_AD = 3;

export type ListItem<T> = { kind: 'item'; item: T } | { kind: 'ad'; n: number };

/**
 * A list with an ad after every `every` items, so ads keep their spacing as stories are added.
 * Never puts an ad after the last item (the page's own end-of-list ad sits there). `n` counts ads from 1.
 */
export function withAds<T>(items: T[], every: number = STORIES_PER_AD): ListItem<T>[] {
  const out: ListItem<T>[] = [];
  const step = Math.max(1, Math.floor(every));
  items.forEach((item, i) => {
    out.push({ kind: 'item', item });
    if ((i + 1) % step === 0 && i < items.length - 1) out.push({ kind: 'ad', n: (i + 1) / step });
  });
  return out;
}
