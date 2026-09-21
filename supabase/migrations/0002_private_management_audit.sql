create table if not exists public.coaches_private_contact (
  coach_id uuid primary key references public.coaches_public(id) on delete cascade,
  phone_ciphertext text,
  email_ciphertext text,
  whatsapp_ciphertext text,
  updated_at timestamptz not null default now()
);

create table if not exists public.coaches_management (
  coach_id uuid primary key references public.coaches_public(id) on delete cascade,
  safeguarding_status text not null default 'PENDING',
  id_verification text not null default 'PENDING',
  internal_notes text,
  contract_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  target_type text not null,
  target_id uuid,
  action text not null,
  reason text,
  request_id text,
  created_at timestamptz not null default now()
);

comment on column public.coaches_private_contact.phone_ciphertext is 'Application-managed ciphertext boundary; encryption/key management is not implemented by this schema.';
comment on column public.coaches_private_contact.email_ciphertext is 'Application-managed ciphertext boundary; encryption/key management is not implemented by this schema.';
comment on column public.coaches_private_contact.whatsapp_ciphertext is 'Application-managed ciphertext boundary; encryption/key management is not implemented by this schema.';
