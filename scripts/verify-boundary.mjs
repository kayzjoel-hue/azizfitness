import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const forbiddenKeys = /\b(phone|email|whatsapp|linkedin(?:_url)?|id_verification|safeguarding|internal_notes?|contract_url)\b/i;
const outputRoots = ['dist/client', '.vercel/output/static'];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function filesUnder(root) {
  if (!(await exists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else files.push(path);
  }
  return files;
}

const staticFiles = (await Promise.all(outputRoots.map(filesUnder))).flat();
assert.ok(staticFiles.length > 0, 'No built static output found. Run the production build first.');

for (const path of staticFiles) {
  const contents = await readFile(path, 'utf8').catch(() => '');
  if (contents && forbiddenKeys.test(contents)) {
    throw new Error(`Private field name found in public output: ${path}`);
  }
}

const publicCoach = JSON.parse(await readFile('src/content/coaches_public/ernest-mutsinze.json', 'utf8'));
assert.equal(publicCoach.is_published, true);
assert.notEqual(publicCoach.verification_status, 'SUSPENDED');
assert.notEqual(publicCoach.verification_status, 'ARCHIVED');
assert.equal(staticFiles.some((path) => path.includes('coaches') && path.includes(publicCoach.slug)), true);

console.log(`Public boundary checks passed across ${staticFiles.length} built files.`);
