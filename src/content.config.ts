import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const coachesPublic = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/coaches_public' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    photo_url: z.string().nullable(),
    bio: z.string(),
    specializations: z.array(z.string()),
    programmes: z.array(z.string()),
    verification_status: z.enum([
      'SUBMITTED',
      'REGISTERED',
      'PENDING_VERIFICATION',
      'VERIFIED',
      'SUSPENDED',
      'ARCHIVED',
    ]),
    is_published: z.boolean(),
    title: z.string().optional(),
  }),
});

export const collections = { coaches_public: coachesPublic };
