import { allProblems, storyProblems } from '../../src/core/validate';
import { story } from '../fixtures';

const yes = () => true;
const file = (data: unknown, fileName = 'a-story.json') => ({ fileName, data });

describe('storyProblems', () => {
  it('passes a complete story', () => {
    expect(storyProblems(file(story()), yes)).toEqual([]);
  });

  it('explains invalid JSON and non-object files', () => {
    expect(storyProblems(file(new Error('Unexpected token')), yes)[0]).toMatch(/not valid JSON/);
    expect(storyProblems(file([1, 2]), yes)).toEqual(['should be one JSON object { ... }']);
  });

  it('lists every missing required field', () => {
    const p = storyProblems(file({}), yes);
    expect(p).toContain('missing "slug"');
    expect(p).toContain('missing "sources"');
    expect(p).toHaveLength(10);
  });

  it('checks the slug format and that the file name matches', () => {
    expect(storyProblems(file(story({ slug: 'Bad Slug' }), 'Bad Slug.json'), yes)).toEqual([
      'slug may only use lowercase letters, numbers and dashes',
    ]);
    expect(storyProblems(file(story(), 'other.json'), yes)).toEqual([
      'file name should be "a-story.json" to match the slug',
    ]);
  });

  it('checks status, dates, lengths and topic', () => {
    const p = storyProblems(
      file({
        ...story(),
        status: 'live',
        updatedAt: 'Nov 27',
        seoTitle: 'x'.repeat(61),
        description: 'x'.repeat(161),
        topic: { name: 'Money' },
      }),
      yes,
    );
    expect(p).toEqual([
      'status should be "published" or "draft"',
      '"updatedAt" should look like 2026-11-27',
      'seoTitle is 61 characters; keep it at 60 or fewer',
      'description is 161 characters; keep it at 160 or fewer',
      'topic needs both "name" and "slug"',
    ]);
    expect(storyProblems(file({ ...story(), topic: 'Money' }), yes)).toEqual([
      'topic needs both "name" and "slug"',
    ]);
  });

  it('reports missing images and alt text', () => {
    const s = {
      ...story(),
      cover: { src: '/media/missing.jpg' },
      shorts: [{ title: 'S', cover: '/media/s.jpg' }, 'junk'],
      timeline: [{ year: 1, label: 'L', image: 'https://cdn.example.com/a.jpg' }, null],
    };
    const p = storyProblems(file(s), (img) => img === '/media/s.jpg');
    expect(p).toEqual([
      'cover needs "alt" text describing the image',
      'image not found: public/media/missing.jpg',
    ]);
    expect(storyProblems(file({ ...story(), cover: 'x' }), yes)).toEqual([
      'cover needs "alt" text describing the image',
    ]);
  });

  it('checks chapters and block types', () => {
    const p = storyProblems(
      file({ ...story(), chapters: [{ blocks: [{ type: 'p' }, { type: 'video' }, 7] }, 'junk'] }),
      yes,
    );
    expect(p).toEqual([
      'chapter 1 needs an "id" and a "title"',
      'chapter 1, block 2: unknown type "video"',
      'chapter 1, block 3: unknown type ""',
      'chapter 2 needs an "id" and a "title"',
    ]);
  });

  it('checks sources', () => {
    expect(storyProblems(file({ ...story(), sources: [] }), yes)).toEqual([
      'add at least one source',
    ]);
    expect(
      storyProblems(file({ ...story(), sources: [{ url: 'example.com' }, 'x'] }), yes),
    ).toEqual([
      'source 1 needs a full "url" starting with https://',
      'source 2 needs a full "url" starting with https://',
    ]);
    expect(storyProblems(file({ ...story(), sources: 'none' }), yes)).toEqual([
      'add at least one source',
    ]);
  });
});

describe('allProblems', () => {
  it('only lists files with problems and catches duplicate slugs', () => {
    const out = allProblems(
      [
        file(story()),
        file(story(), 'a-story.json'),
        file(new Error('bad'), 'broken.json'),
        file({ ...story(), slug: 'ok' }, 'ok.json'),
        file([], 'list.json'),
      ],
      yes,
    );
    expect([...out.keys()]).toEqual(['a-story.json', 'broken.json', 'list.json']);
    expect(out.get('a-story.json')).toEqual(['slug "a-story" is already used by a-story.json']);
  });
});
