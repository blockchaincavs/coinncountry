// The one place pages get their data from. Picks the content source and applies the core rules.
import { jsonFileSource } from './adapters/json-files';
import type { ContentSource } from './adapters/content-source';
import { homeTimeline, publishedStories, topicsOf } from './core/stories';

// Swap this line for an Appwrite source later.
const source: ContentSource = jsonFileSource(process.cwd());

/** Everything a page needs: settings, published stories (newest first) and topics. */
export async function loadSiteData(src: ContentSource = source) {
  const [site, all] = await Promise.all([src.getSite(), src.listStories()]);
  const stories = publishedStories(all);
  return { site, stories, topics: topicsOf(stories), timeline: homeTimeline(stories) };
}
