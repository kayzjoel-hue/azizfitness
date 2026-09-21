create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  programme_slug text not null,
  coach_slug text,
  location text,
  client_name text not null,
  client_email text not null,
  client_phone text,
  message text not null,
  consent_version text not null,
  idempotency_key text unique,
  status text not null default 'NEW' check (status in ('NEW', 'ASSIGNED', 'ACCEPTED', 'DECLINED', 'CLOSED')),
  assigned_coach_id uuid references public.coaches_public(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
