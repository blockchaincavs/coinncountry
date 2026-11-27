// Pure text and date helpers. "now" is always passed in, never read from the clock here.
import type { Story } from './types';

const WORDS_PER_MINUTE = 230;

/** Reading time in minutes, from the story text (at least 1). */
export function readMinutes(story: Story): number {
  const words = story.chapters
    .flatMap((c) =>
      c.blocks.map((b) => (b.type === 'thenNow' ? `${b.then.text} ${b.now.text}` : b.text)),
    )
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "Nov 27, 2026" from "2026-11-27". Calendar dates, so no time zone shifts. Other text is returned as is. */
export function shortDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** "Friday, November 27, 2026" for the masthead, in US Eastern time. */
export function longDate(now: Date, timeZone = 'America/New_York'): string {
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  });
}

/** A full URL from a site path like "/media/x.jpg" (needed for SEO tags). */
export function absoluteUrl(pathOrUrl: string, site: string | URL): string {
  return new URL(pathOrUrl, site).toString();
}

/** Splits a paragraph into its first letter (for the drop cap) and the rest. */
export function dropCap(text: string): { first: string; rest: string } {
  const [first = ''] = Array.from(text);
  return { first, rest: text.slice(first.length) };
}

/** YouTube watch link for a video ID, or undefined. */
export function youtubeWatchUrl(id: string | undefined): string | undefined {
  return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : undefined;
}

/** Privacy-friendly embed link for a video ID. */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
}
