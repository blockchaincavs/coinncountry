// Reads stories from content/stories/*.json and settings from content/site.json.
// Files are read on every call (no cache), so an edited or new file shows on the next refresh.
// Files starting with "_" (like _template.json) are skipped.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { SiteSettings, Story } from '../core/types';
import type { ContentSource } from './content-source';
import type { StoryFile } from '../core/validate';

async function readJson<T>(file: string, root: string): Promise<T> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch (err) {
    throw new Error(`Could not read ${path.relative(root, file)}: ${(err as Error).message}`);
  }
}

export function jsonFileSource(root: string): ContentSource {
  const storiesDir = path.join(root, 'content', 'stories');
  return {
    async listStories() {
      const files = (await readdir(storiesDir)).filter(
        (f) => f.endsWith('.json') && !f.startsWith('_'),
      );
      return Promise.all(files.map((f) => readJson<Story>(path.join(storiesDir, f), root)));
    },
    getSite() {
      return readJson<SiteSettings>(path.join(root, 'content', 'site.json'), root);
    },
  };
}

/** Raw story files for the checker: bad JSON comes back as an Error instead of throwing. */
export async function readStoryFiles(root: string): Promise<StoryFile[]> {
  const dir = path.join(root, 'content', 'stories');
  const names = (await readdir(dir)).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
  return Promise.all(
    names.map(async (fileName) => {
      const text = await readFile(path.join(dir, fileName), 'utf8');
      try {
        return { fileName, data: JSON.parse(text) as unknown };
      } catch (err) {
        return { fileName, data: err as Error };
      }
    }),
  );
}
