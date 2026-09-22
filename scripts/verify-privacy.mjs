import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const publicCoach = JSON.parse(await readFile('src/content/coaches_public/ernest-mutsinze.json', 'utf8'));
const publicKeys = Object.keys(publicCoach).sort();
assert.deepEqual(publicKeys, [
  'bio',
  'id',
  'is_published',
  'name',
  'photo_url',
  'programmes',
  'slug',
  'specializations',
  'title',
  'verification_status',
]);
assert.equal(publicCoach.id, 'coach_ernest_001');
assert.equal(publicCoach.is_published, true);
assert.notEqual(publicCoach.verification_status, 'SUSPENDED');
assert.notEqual(publicCoach.verification_status, 'ARCHIVED');

const coachPage = await readFile('src/pages/coaches/[slug].astro', 'utf8');
assert.equal(coachPage.includes('phone'), false);
assert.equal(coachPage.includes('email'), false);
assert.equal(coachPage.includes('whatsapp'), false);

const enquiryApi = await readFile('src/pages/api/enquiry.ts', 'utf8');
assert.equal(enquiryApi.includes('export const POST'), true);
assert.equal(enquiryApi.includes('export const ALL'), true);
assert.equal(enquiryApi.includes('coachSlug'), true);
assert.equal(enquiryApi.includes('consent'), true);

console.log('Privacy boundary checks passed.');
