import {
  adBreaks,
  homeTimeline,
  pickLead,
  publishedStories,
  readNext,
  shortsRow,
  STORIES_PER_AD,
  topicsOf,
  withAds,
} from '../../src/core/stories';
import { story } from '../fixtures';

describe('publishedStories', () => {
  it('drops drafts and sorts newest first', () => {
    const out = publishedStories([
      story({ slug: 'old', publishedAt: '2026-01-01' }),
      story({ slug: 'draft', status: 'draft', publishedAt: '2027-01-01' }),
      story({ slug: 'new', publishedAt: '2026-12-01' }),
    ]);
    expect(out.map((s) => s.slug)).toEqual(['new', 'old']);
  });

  it('puts a featured story first on the same day, then sorts by title', () => {
    const out = publishedStories([
      story({ slug: 'b', title: 'B' }),
      story({ slug: 'f', title: 'Z', featured: true }),
      story({ slug: 'a', title: 'A' }),
    ]);
    expect(out.map((s) => s.slug)).toEqual(['f', 'a', 'b']);
  });

  it('handles an empty list', () => {
    expect(publishedStories([])).toEqual([]);
  });
});

describe('pickLead', () => {
  it('prefers a featured story', () => {
    const f = story({ slug: 'f', featured: true });
    expect(pickLead([story(), f])).toBe(f);
  });
  it('falls back to the first story, or undefined when empty', () => {
    const first = story({ slug: 'first' });
    expect(pickLead([first, story()])).toBe(first);
    expect(pickLead([])).toBeUndefined();
  });
});

describe('topicsOf', () => {
  it('lists each topic once, in first-seen order, with counts', () => {
    const t = topicsOf([
      story({ topic: { name: 'AI', slug: 'ai' } }),
      story({ topic: { name: 'Money', slug: 'money' } }),
      story({ topic: { name: 'AI', slug: 'ai' } }),
    ]);
    expect(t).toEqual([
      { name: 'AI', slug: 'ai', count: 2 },
      { name: 'Money', slug: 'money', count: 1 },
    ]);
  });
});

describe('homeTimeline', () => {
  it('keeps only "home" years from all stories, oldest first', () => {
    const a = story({
      slug: 'a',
      timeline: [
        { year: 1926, label: 'x', home: true },
        { year: 1927, label: 'y' },
      ],
    });
    const b = story({ slug: 'b', timeline: [{ year: 1770, label: 'z', home: true }] });
    const c = story({ slug: 'c' }); // no timeline at all
    const out = homeTimeline([a, b, c]);
    expect(out.map((t) => [t.year, t.story.slug])).toEqual([
      [1770, 'b'],
      [1926, 'a'],
    ]);
  });
});

describe('shortsRow', () => {
  const s = (n: string) => ({ title: n, cover: `/${n}.jpg` });
  it('takes one Short from each story in turn, up to the max', () => {
    const a = story({ slug: 'a', shorts: [s('a1'), s('a2'), s('a3')] });
    const b = story({ slug: 'b', shorts: [s('b1')] });
    const c = story({ slug: 'c' });
    expect(shortsRow([a, b, c], 4).map((x) => x.short.title)).toEqual(['a1', 'b1', 'a2', 'a3']);
    expect(shortsRow([a, b], 2).map((x) => x.short.title)).toEqual(['a1', 'b1']);
  });
  it('returns nothing when no story has Shorts', () => {
    expect(shortsRow([story()])).toEqual([]);
    expect(shortsRow([])).toEqual([]);
  });
});

describe('readNext', () => {
  it('skips the current story and limits the count', () => {
    const [a, b, c, d] = ['a', 'b', 'c', 'd'].map((slug) => story({ slug }));
    expect(readNext([a!, b!, c!, d!], b!).map((s) => s.slug)).toEqual(['a', 'c']);
  });
});

describe('adBreaks', () => {
  it('places ads after chapters 1 and 3, never after the last chapter', () => {
    expect([...adBreaks(6)]).toEqual([0, 2]);
    expect([...adBreaks(3)]).toEqual([0]);
    expect([...adBreaks(1)]).toEqual([]);
  });
});

describe('withAds', () => {
  const shape = (n: number, every?: number) =>
    withAds(Array.from({ length: n }, (_, i) => i + 1), every)
      .map((x) => (x.kind === 'ad' ? `ad${x.n}` : String(x.item)))
      .join(',');

  it('puts an ad after every 3rd story by default', () => {
    expect(STORIES_PER_AD).toBe(3);
    expect(shape(8)).toBe('1,2,3,ad1,4,5,6,ad2,7,8');
  });
  it('never ends the list with an ad', () => {
    expect(shape(6)).toBe('1,2,3,ad1,4,5,6');
    expect(shape(3)).toBe('1,2,3');
  });
  it('adds no ad to short or empty lists', () => {
    expect(shape(2)).toBe('1,2');
    expect(shape(0)).toBe('');
  });
  it('accepts another spacing and treats bad values as 1', () => {
    expect(shape(9, 4)).toBe('1,2,3,4,ad1,5,6,7,8,ad2,9');
    expect(shape(3, 0)).toBe('1,ad1,2,ad2,3');
  });
});
