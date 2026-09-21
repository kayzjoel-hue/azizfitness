export type ProgrammeCategory = 'Adult' | 'Youth' | 'Inclusive / Adaptive';
export const publicEnquirySlugs = [
  'membership',
  'pt',
  'classes',
  'nutrition',
  'kids',
  'basketball-development',
  'inclusive',
  'coach',
  'collaborator',
] as const;

export interface Programme {
  slug: string;
  name: string;
  category: ProgrammeCategory;
  audience: string;
  description: string;
  coachSlugs: string[];
  availability: 'Planned' | 'Available';
}

export interface Collaborator {
  name: string;
  type: string;
  status: 'Community reference — pending confirmation';
  description: string;
}

export const programmes: Programme[] = [
  {
    slug: 'basketball-development',
    name: 'Basketball Development',
    category: 'Youth',
    audience: 'Kids, youth, and athletes',
    description: 'A planned basketball pathway for fundamentals, athletic development, teamwork, and sport-specific confidence.',
    coachSlugs: ['ernest-mutsinze'],
    availability: 'Planned',
  },
  {
    slug: 'personal-training',
    name: 'Personal Training',
    category: 'Adult',
    audience: 'Adults and athletes',
    description: 'One-to-one coaching and progress tracking built around a member’s goals, schedule, and lifestyle.',
    coachSlugs: [],
    availability: 'Available',
  },
  {
    slug: 'inclusive-fitness',
    name: 'Inclusive Fitness',
    category: 'Inclusive / Adaptive',
    audience: 'People seeking supported training',
    description: 'A future programme area for accessible training and individual support. Specialist provision is only published after validation.',
    coachSlugs: [],
    availability: 'Planned',
  },
];

export const collaborators: Collaborator[] = [
  {
    name: 'Ballers Dubai',
    type: 'Community collaborator',
    status: 'Community reference — pending confirmation',
    description: 'Referenced by the existing AziziFitness contact surface; formal collaboration details require owner confirmation.',
  },
  {
    name: '@getthekidsfit.uga',
    type: 'Community programme reference',
    status: 'Community reference — pending confirmation',
    description: 'Referenced by the existing AziziFitness contact surface; public partnership claims require owner confirmation.',
  },
];

export const programmeBySlug = (slug: string) => programmes.find((programme) => programme.slug === slug);
