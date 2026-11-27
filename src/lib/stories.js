// The data layer: the ONLY file that knows where stories come from.
//
// Today stories are JSON files in content/stories/ (one file per story).
// Later this file will read them from Appwrite DocumentsDB instead. Pages and
// components only call the functions below, so swapping the source means
// changing this one file and nothing else.
//
// Files are read on every request (no caching), so a new or edited JSON file
// shows up on the next page refresh.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const STORIES_DIR = path.join(process.cwd(), 'content', 'stories');
const SITE_FILE = path.join(process.cwd(), 'content', 'site.json');

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    throw new Error(`Could not read ${path.relative(process.cwd(), file)}: ${err.message}`);
  }
}

/** Brand settings: name, tagline, YouTube and X links. */
export async function getSite() {
  return readJson(SITE_FILE);
}

/** All published stories, newest first (a "featured" story goes first among same-day stories). Files starting with "_" are skipped (drafts, templates). */
export async function getAllStories() {
  const files = (await readdir(STORIES_DIR)).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
  const stories = await Promise.all(files.map((f) => readJson(path.join(STORIES_DIR, f))));
  return stories
    .filter((s) => s.status !== 'draft')
    .sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      a.title.localeCompare(b.title));
}

/** One story by its slug, or undefined. */
export async function getStory(slug) {
  return (await getAllStories()).find((s) => s.slug === slug);
}

/** Topics that have at least one story, in first-seen order. */
export async function getTopics() {
  const seen = new Map();
  for (const s of await getAllStories()) {
    if (!seen.has(s.topic.slug)) seen.set(s.topic.slug, { ...s.topic, count: 0 });
    seen.get(s.topic.slug).count++;
  }
  return [...seen.values()];
}

/** Every dated moment from every story, oldest first, for the homepage timeline. */
export async function getTimeline() {
  const stories = await getAllStories();
  return stories
    .flatMap((s) => (s.timeline || []).filter((t) => t.home).map((t) => ({ ...t, story: s })))
    .sort((a, b) => a.year - b.year);
}
