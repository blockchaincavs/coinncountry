// Pure checks for story files. The caller passes in how to test whether an image exists.

export interface StoryFile {
  fileName: string;
  /** Parsed JSON, or an Error if the file wasn't valid JSON. */
  data: unknown;
}

const REQUIRED = [
  'slug',
  'title',
  'description',
  'dek',
  'summary',
  'topic',
  'publishedAt',
  'cover',
  'chapters',
  'sources',
] as const;
const BLOCK_TYPES = new Set(['p', 'quote', 'thenNow']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Problems in one story file, as plain sentences. Empty means it's fine. */
export function storyProblems(file: StoryFile, imageExists: (path: string) => boolean): string[] {
  if (file.data instanceof Error) {
    return [`not valid JSON (${file.data.message}). Look for a missing comma or quote.`];
  }
  if (!isRec(file.data)) return ['should be one JSON object { ... }'];
  const s = file.data;
  const p: string[] = [];

  for (const key of REQUIRED) if (s[key] === undefined || s[key] === '') p.push(`missing "${key}"`);

  const slug = str(s.slug);
  if (slug && !SLUG.test(slug)) p.push('slug may only use lowercase letters, numbers and dashes');
  if (slug && file.fileName !== `${slug}.json`)
    p.push(`file name should be "${slug}.json" to match the slug`);
  if (s.status !== undefined && s.status !== 'published' && s.status !== 'draft') {
    p.push('status should be "published" or "draft"');
  }

  for (const key of ['publishedAt', 'updatedAt', 'factCheckedAt']) {
    if (s[key] && !DATE.test(str(s[key]))) p.push(`"${key}" should look like 2026-11-27`);
  }
  const seoTitle = str(s.seoTitle);
  if (seoTitle.length > 60)
    p.push(`seoTitle is ${seoTitle.length} characters; keep it at 60 or fewer`);
  const description = str(s.description);
  if (description.length > 160)
    p.push(`description is ${description.length} characters; keep it at 160 or fewer`);
  if (s.topic !== undefined && (!isRec(s.topic) || !str(s.topic.name) || !str(s.topic.slug))) {
    p.push('topic needs both "name" and "slug"');
  }

  const cover = isRec(s.cover) ? s.cover : {};
  if (s.cover !== undefined && !str(cover.alt))
    p.push('cover needs "alt" text describing the image');
  const images = [
    str(cover.src),
    ...arr(s.shorts).map((x) => (isRec(x) ? str(x.cover) : '')),
    ...arr(s.timeline).map((t) => (isRec(t) ? str(t.image) : '')),
  ].filter((i) => i.startsWith('/'));
  for (const img of images) if (!imageExists(img)) p.push(`image not found: public${img}`);

  arr(s.chapters).forEach((c, i) => {
    const ch = isRec(c) ? c : {};
    if (!str(ch.id) || !str(ch.title)) p.push(`chapter ${i + 1} needs an "id" and a "title"`);
    arr(ch.blocks).forEach((b, j) => {
      const type = isRec(b) ? str(b.type) : '';
      if (!BLOCK_TYPES.has(type))
        p.push(`chapter ${i + 1}, block ${j + 1}: unknown type "${type}"`);
    });
  });

  if (s.sources !== undefined && arr(s.sources).length === 0) p.push('add at least one source');
  arr(s.sources).forEach((src, i) => {
    if (!/^https?:\/\//.test(isRec(src) ? str(src.url) : '')) {
      p.push(`source ${i + 1} needs a full "url" starting with https://`);
    }
  });
  return p;
}

/** Problems across all files, by file name (only files with problems are listed). */
export function allProblems(
  files: StoryFile[],
  imageExists: (path: string) => boolean,
): Map<string, string[]> {
  const out = new Map<string, string[]>();
  const slugOwner = new Map<string, string>();
  for (const f of files) {
    const problems = storyProblems(f, imageExists);
    const slug = isRec(f.data) ? str(f.data.slug) : '';
    if (slug) {
      const owner = slugOwner.get(slug);
      if (owner) problems.push(`slug "${slug}" is already used by ${owner}`);
      else slugOwner.set(slug, f.fileName);
    }
    if (problems.length) out.set(f.fileName, problems);
  }
  return out;
}
