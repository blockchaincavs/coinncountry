// Checks every story file for missing or broken fields. Run: npm run check-stories
import { existsSync } from 'node:fs';
import path from 'node:path';
import { readStoryFiles } from '../src/adapters/json-files';
import { allProblems } from '../src/core/validate';

async function main() {
  const root = process.cwd();
  const files = await readStoryFiles(root);
  const problems = allProblems(files, (img) => existsSync(path.join(root, 'public', img)));
  let count = 0;
  for (const [file, list] of problems) {
    for (const p of list) {
      console.log(`  ✗ ${file}: ${p}`);
      count++;
    }
  }
  console.log(
    count
      ? `\n${count} problem(s) found in ${files.length} stories.`
      : `All ${files.length} stories look good.`,
  );
  process.exit(count ? 1 : 0);
}

main();
