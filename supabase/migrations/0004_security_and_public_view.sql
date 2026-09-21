alter table public.coaches_public enable row level security;
alter table public.coaches_professional enable row level security;
alter table public.coach_accounts enable row level security;
alter table public.programme_manager_assignments enable row level security;
alter table public.coaches_private_contact enable row level security;
alter table public.coaches_management enable row level security;
alter table public.audit_log enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists coaches_public_read_published on public.coaches_public;
create policy coaches_public_read_published on public.coaches_public
  for select to anon, authenticated
  using (is_published = true and verification_status not in ('SUSPENDED', 'ARCHIVED'));

drop policy if exists coach_accounts_self_admin on public.coach_accounts;
create policy coach_accounts_self_admin on public.coach_accounts
  for select to authenticated
  using (user_id = auth.uid() or (auth.jwt() ->> 'role') = 'admin');

drop policy if exists private_contact_owner_admin on public.coaches_private_contact;
create policy private_contact_owner_admin on public.coaches_private_contact
  for all to authenticated
  using (
    (auth.jwt() ->> 'role') = 'admin'
    or exists (
      select 1 from public.coach_accounts account
      where account.coach_id = coaches_private_contact.coach_id
        and account.user_id = auth.uid()
        and account.is_active = true
    )
  )
  with check (
    (auth.jwt() ->> 'role') = 'admin'
    or exists (
      select 1 from public.coach_accounts account
      where account.coach_id = coaches_private_contact.coach_id
        and account.user_id = auth.uid()
        and account.is_active = true
    )
  );

drop policy if exists professional_owner_admin on public.coaches_professional;
create policy professional_owner_admin on public.coaches_professional
  for all to authenticated
  using (
    (auth.jwt() ->> 'role') = 'admin'
    or exists (
      select 1 from public.coach_accounts account
      where account.coach_id = coaches_professional.coach_id
        and account.user_id = auth.uid()
        and account.is_active = true
    )
  )
  with check (
    (auth.jwt() ->> 'role') = 'admin'
    or exists (
      select 1 from public.coach_accounts account
      where account.coach_id = coaches_professional.coach_id
        and account.user_id = auth.uid()
        and account.is_active = true
    )
  );

drop policy if exists management_admin_only on public.coaches_management;
create policy management_admin_only on public.coaches_management
  for all to authenticated
  using ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists audit_admin_only on public.audit_log;
create policy audit_admin_only on public.audit_log
  for select to authenticated using ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists enquiries_service_insert on public.enquiries;
create policy enquiries_service_insert on public.enquiries
  for insert to service_role with check (true);

drop policy if exists enquiries_staff_read on public.enquiries;
create policy enquiries_staff_read on public.enquiries
  for select to authenticated
  using (
    (auth.jwt() ->> 'role') = 'admin'
    or exists (
      select 1 from public.programme_manager_assignments assignment
      where assignment.programme_slug = enquiries.programme_slug
        and assignment.user_id = auth.uid()
        and assignment.is_active = true
    )
    or exists (
      select 1 from public.coach_accounts account
      where account.coach_id = enquiries.assigned_coach_id
        and account.user_id = auth.uid()
        and account.is_active = true
    )
  );

create or replace view public.coaches_professional_public as
select id, slug, name, photo_url, bio, specializations, programmes, verification_status
from public.coaches_public
where is_published = true
  and verification_status not in ('SUSPENDED', 'ARCHIVED');

revoke all on public.coaches_professional from anon, authenticated;
revoke all on public.coach_accounts from anon, authenticated;
revoke all on public.programme_manager_assignments from anon, authenticated;
revoke all on public.coaches_private_contact from anon, authenticated;
revoke all on public.coaches_management from anon, authenticated;
revoke all on public.audit_log from anon, authenticated;
revoke all on public.enquiries from anon, authenticated;
grant select on public.coaches_professional_public to anon, authenticated;
grant select, insert, update, delete on public.coach_accounts to authenticated;
grant select, insert, update, delete on public.programme_manager_assignments to authenticated;
grant select, insert, update, delete on public.coaches_private_contact to authenticated;
grant select, insert, update, delete on public.coaches_professional to authenticated;
grant select, insert, update, delete on public.coaches_management to authenticated;
grant select on public.audit_log to authenticated;
grant insert, select, update on public.enquiries to service_role;
