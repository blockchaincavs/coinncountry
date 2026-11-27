import {
  absoluteUrl,
  dropCap,
  longDate,
  readMinutes,
  shortDate,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from '../../src/core/format';
import { story } from '../fixtures';

describe('readMinutes', () => {
  it('is at least 1 minute for short text', () => {
    expect(readMinutes(story())).toBe(1);
  });
  it('counts paragraphs, quotes and Then vs now boxes', () => {
    const words = (n: number) => Array(n).fill('word').join(' ');
    const s = story({
      chapters: [
        {
          id: 'c',
          title: 'C',
          blocks: [
            { type: 'p', text: words(230) },
            { type: 'quote', text: words(230) },
            {
              type: 'thenNow',
              then: { label: 'T', text: words(115) },
              now: { label: 'N', text: words(115) },
            },
          ],
        },
      ],
    });
    expect(readMinutes(s)).toBe(3);
  });
});

describe('dates', () => {
  it('formats a calendar date without time zone shifts', () => {
    expect(shortDate('2026-11-27')).toBe('Nov 27, 2026');
    expect(shortDate('2026-01-01')).toBe('Jan 1, 2026');
  });
  it('returns text that is not a YYYY-MM-DD date unchanged', () => {
    expect(shortDate('')).toBe('');
    expect(shortDate('Nov 27')).toBe('Nov 27');
  });
  it('writes the masthead date in US Eastern time', () => {
    // 03:00 UTC on Nov 28 is still Nov 27 in New York.
    expect(longDate(new Date('2026-11-28T03:00:00Z'))).toBe('Friday, November 27, 2026');
    expect(longDate(new Date('2026-11-28T03:00:00Z'), 'Asia/Tokyo')).toBe(
      'Saturday, November 28, 2026',
    );
  });
});

describe('absoluteUrl', () => {
  it('joins a path to the site address', () => {
    expect(absoluteUrl('/media/a.jpg', 'https://coinncountry.com')).toBe(
      'https://coinncountry.com/media/a.jpg',
    );
    expect(absoluteUrl('https://x.com/a', 'https://coinncountry.com')).toBe('https://x.com/a');
  });
});

describe('dropCap', () => {
  it('splits off the first letter', () => {
    expect(dropCap('Not the stores')).toEqual({ first: 'N', rest: 'ot the stores' });
  });
  it('keeps a multi-byte first character whole and handles empty text', () => {
    expect(dropCap('“Quote')).toEqual({ first: '“', rest: 'Quote' });
    expect(dropCap('')).toEqual({ first: '', rest: '' });
  });
});

describe('YouTube links', () => {
  it('builds watch and embed links, encoding the ID', () => {
    expect(youtubeWatchUrl('abc123')).toBe('https://www.youtube.com/watch?v=abc123');
    expect(youtubeWatchUrl(undefined)).toBeUndefined();
    expect(youtubeWatchUrl('')).toBeUndefined();
    expect(youtubeEmbedUrl('a b')).toBe(
      'https://www.youtube-nocookie.com/embed/a%20b?autoplay=1&rel=0',
    );
  });
});
