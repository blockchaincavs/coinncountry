// Where stories and site settings come from. Pages only use this interface.
// Today: JSON files (json-files.ts). Later: Appwrite DocumentsDB, as a second implementation
// of the same interface. Swapping is a one-line change in site-data.ts.
import type { SiteSettings, Story } from '../core/types';

export interface ContentSource {
  /** Every story, including drafts. Sorting and filtering happen in src/core/stories.ts. */
  listStories(): Promise<Story[]>;
  getSite(): Promise<SiteSettings>;
}
