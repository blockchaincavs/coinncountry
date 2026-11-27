// Checks every story JSON file for missing or broken fields.
// Run it with:  npm run check-stories
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';

const dir = path.join(process.cwd(), 'content', 'stories');
const required = ['slug', 'title', 'description', 'dek', 'summary', 'topic', 'publishedAt', 'cover', 'chapters', 'sources'];
const blockTypes = new Set(['p', 'quote', 'thenNow']);
let problems = 0;
const slugs = new Set();

function problem(file, msg) {
  problems++;
  console.log(`  ✗ ${file}: ${msg}`);
}

const files = (await readdir(dir)).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
for (const file of files) {
  let s;
  try {
    s = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
  } catch (err) {
    problem(file, `not valid JSON (${err.message}). Look for a missing comma or quote.`);
    continue;
  }
  for (const key of required) if (s[key] === undefined || s[key] === '') problem(file, `missing "${key}"`);
  if (s.slug && file !== `${s.slug}.json`) problem(file, `file name should be "${s.slug}.json" to match the slug`);
  if (s.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.slug)) problem(file, 'slug may only use lowercase letters, numbers and dashes');
  if (slugs.has(s.slug)) problem(file, `slug "${s.slug}" is used twice`);
  slugs.add(s.slug);
  for (const key of ['publishedAt', 'updatedAt', 'factCheckedAt']) {
    if (s[key] && !/^\d{4}-\d{2}-\d{2}$/.test(s[key])) problem(file, `"${key}" should look like 2026-11-27`);
  }
  if (s.seoTitle && s.seoTitle.length > 60) problem(file, `seoTitle is ${s.seoTitle.length} characters; keep it at 60 or fewer`);
  if (s.description && s.description.length > 160) problem(file, `description is ${s.description.length} characters; keep it at 160 or fewer`);
  if (s.topic && (!s.topic.name || !s.topic.slug)) problem(file, 'topic needs both "name" and "slug"');
  const images = [s.cover?.src, ...(s.shorts || []).map((x) => x.cover), ...(s.timeline || []).map((t) => t.image)].filter(Boolean);
  for (const img of images) {
    if (img.startsWith('/')) {
      try { await access(path.join(process.cwd(), 'public', img)); } catch { problem(file, `image not found: public${img}`); }
    }
  }
  if (!s.cover?.alt) problem(file, 'cover needs "alt" text describing the image');
  (s.chapters || []).forEach((c, i) => {
    if (!c.id || !c.title) problem(file, `chapter ${i + 1} needs an "id" and a "title"`);
    (c.blocks || []).forEach((b, j) => {
      if (!blockTypes.has(b.type)) problem(file, `chapter ${i + 1}, block ${j + 1}: unknown type "${b.type}"`);
    });
  });
  if (!s.sources?.length) problem(file, 'add at least one source');
  (s.sources || []).forEach((src, i) => {
    if (!/^https?:\/\//.test(src.url || '')) problem(file, `source ${i + 1} needs a full "url" starting with https://`);
  });
}

console.log(problems ? `\n${problems} problem(s) found in ${files.length} stories.` : `All ${files.length} stories look good.`);
process.exit(problems ? 1 : 0);
