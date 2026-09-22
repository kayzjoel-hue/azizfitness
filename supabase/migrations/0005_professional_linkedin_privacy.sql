alter table public.coaches_professional
  add column if not exists linkedin_url text,
  add column if not exists linkedin_is_public boolean not null default false,
  add column if not exists linkedin_consent_at timestamptz;

comment on column public.coaches_professional.linkedin_url is 'Private professional link; never projected publicly without explicit consent.';
comment on column public.coaches_professional.linkedin_is_public is 'Explicit opt-in for a future public professional link projection.';
comment on column public.coaches_professional.linkedin_consent_at is 'Timestamp of explicit consent for public LinkedIn projection.';
