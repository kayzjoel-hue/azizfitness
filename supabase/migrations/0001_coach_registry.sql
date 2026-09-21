create extension if not exists pgcrypto;

create table if not exists public.coaches_public (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  photo_url text,
  bio text not null,
  specializations text[] not null default '{}',
  programmes text[] not null default '{}',
  verification_status text not null check (verification_status in ('SUBMITTED', 'REGISTERED', 'PENDING_VERIFICATION', 'VERIFIED', 'SUSPENDED', 'ARCHIVED')),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coaches_professional (
  coach_id uuid primary key references public.coaches_public(id) on delete cascade,
  experience text,
  coaching_history text,
  certifications text[] not null default '{}',
  references_summary text,
  updated_at timestamptz not null default now()
);

create table if not exists public.coach_accounts (
  coach_id uuid primary key references public.coaches_public(id) on delete cascade,
  user_id uuid unique not null references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.programme_manager_assignments (
  programme_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  primary key (programme_slug, user_id)
);

comment on table public.coaches_professional is 'Protected professional evidence. Public release requires an explicit projection change.';
comment on table public.coach_accounts is 'Explicit auth user to coach mapping; auth.uid() is not assumed to equal coaches_public.id.';
