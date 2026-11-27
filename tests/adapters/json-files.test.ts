import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { jsonFileSource, readStoryFiles } from '../../src/adapters/json-files';
import { site, story } from '../fixtures';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), 'cnc-'));
  await mkdir(path.join(root, 'content', 'stories'), { recursive: true });
  await writeFile(path.join(root, 'content', 'site.json'), JSON.stringify(site));
  await writeFile(path.join(root, 'content', 'stories', 'a-story.json'), JSON.stringify(story()));
  await writeFile(path.join(root, 'content', 'stories', '_template.json'), '{}');
  await writeFile(path.join(root, 'content', 'stories', 'notes.txt'), 'ignore me');
});

afterEach(() => rm(root, { recursive: true, force: true }));

describe('jsonFileSource', () => {
  it('reads site settings and story files, skipping "_" files and non-JSON', async () => {
    const src = jsonFileSource(root);
    expect((await src.getSite()).name).toBe('CoinNCountry');
    expect((await src.listStories()).map((s) => s.slug)).toEqual(['a-story']);
  });

  it('picks up a new file on the next read (no cache)', async () => {
    const src = jsonFileSource(root);
    await writeFile(
      path.join(root, 'content', 'stories', 'b.json'),
      JSON.stringify(story({ slug: 'b' })),
    );
    expect(await src.listStories()).toHaveLength(2);
  });

  it('names the broken file in the error', async () => {
    await writeFile(path.join(root, 'content', 'stories', 'bad.json'), '{ nope');
    await expect(jsonFileSource(root).listStories()).rejects.toThrow(/content\/stories\/bad\.json/);
  });
});

describe('readStoryFiles', () => {
  it('returns parse errors instead of throwing', async () => {
    await writeFile(path.join(root, 'content', 'stories', 'bad.json'), '{ nope');
    const files = await readStoryFiles(root);
    const bad = files.find((f) => f.fileName === 'bad.json');
    expect(bad?.data).toBeInstanceOf(Error);
    expect(files.find((f) => f.fileName === 'a-story.json')?.data).toMatchObject({
      slug: 'a-story',
    });
  });
});
