// Small helpers shared by pages and components.

const WORDS_PER_MINUTE = 230;

/** Reading time in minutes, worked out from the story text. */
export function readMinutes(story) {
  const text = (story.chapters || [])
    .flatMap((c) => c.blocks.map((b) => [b.text, b.then?.text, b.now?.text].filter(Boolean).join(' ')))
    .join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "Nov 27, 2026" from "2026-11-27". Dates are calendar days, so no time zone shifts. */
export function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

/** "Friday, November 27, 2026" for today, US Eastern time (for the masthead). */
export function todayLong() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York',
  });
}

/** Turns a site path like "/media/x.jpg" into a full URL (needed for SEO tags). */
export function absoluteUrl(pathOrUrl, site) {
  return new URL(pathOrUrl, site).toString();
}

/** Lead story for the homepage: the one marked "featured", or else the newest. */
export function pickLead(stories) {
  return stories.find((s) => s.featured) || stories[0];
}
