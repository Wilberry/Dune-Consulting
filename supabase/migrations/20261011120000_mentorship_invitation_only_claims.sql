-- Harden enrolment claims without changing existing mentorship/enrolment tables.
-- Apply only after the October 9 foundation and claim migrations have been
-- inspected and tested on a disposable Supabase database.
-- Existing linked users/enrolments are preserved.

create table public.mentorship_claim_invitations (
  application_id uuid primary key
    references public.mentorship_applications(id) on delete restrict,
  token_hash text not null unique,
  expires_at timestamptz not null,
  claimed_at timestamptz,
  claimed_by uuid references auth.users(id) on delete restrict,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint mentorship_claim_invitations_hash_valid
    check (token_hash ~ '^[a-f0-9]{64}$'),
  constraint mentorship_claim_invitations_claim_pair
    check ((claimed_at is null) = (claimed_by is null))
);

create index mentorship_claim_invitations_expiry_idx
  on public.mentorship_claim_invitations(expires_at);

alter table public.mentorship_claim_invitations enable row level security;
revoke all on table public.mentorship_claim_invitations
  from public, anon, authenticated;
-- The staff-only server action uses the privileged backend client.
-- Grant it explicitly instead of depending on Supabase default privileges.
grant select, insert, update on public.mentorship_claim_invitations to service_role;

-- Reject previously issued codes if an accepted application is withdrawn.
-- A later re-acceptance requires staff to generate a fresh invitation.
create or replace function public.expire_mentorship_invite_on_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status = 'accepted' and new.status <> 'accepted' then
    update public.mentorship_claim_invitations
    set expires_at = least(expires_at, now())
    where application_id = new.id and claimed_at is null;
  end if;
  return new;
end;
$$;

revoke all on function public.expire_mentorship_invite_on_status_change()
  from public, anon, authenticated, service_role;

create trigger mentorship_invitation_expire_on_unapproval
after update of status on public.mentorship_applications
for each row execute function public.expire_mentorship_invite_on_status_change();

-- Old email-only claim mechanism must no longer be callable, including
-- by clients still using the previously deployed RPC name.
revoke all on function public.claim_my_mentorship_application()
  from public, anon, authenticated, service_role;

create or replace function public.claim_mentorship_with_code(p_token_hash text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  caller_email text;
  invitation record;
begin
  if caller_id is null or p_token_hash is null
    or p_token_hash !~ '^[a-f0-9]{64}$' then
    return 'invalid';
  end if;

  select lower(btrim(account.email))
    into caller_email
  from auth.users as account
  where account.id = caller_id
    and account.email_confirmed_at is not null;

  if caller_email is null or caller_email = '' then
    return 'invalid';
  end if;

  select
    invite.application_id,
    invite.expires_at,
    invite.claimed_at,
    invite.claimed_by,
    application.email,
    application.status,
    application.selected_package,
    application.linked_user_id
  into invitation
  from public.mentorship_claim_invitations as invite
  join public.mentorship_applications as application
    on application.id = invite.application_id
  where invite.token_hash = p_token_hash
  for update of invite, application;

  if not found then
    return 'invalid';
  end if;

  if lower(btrim(invitation.email)) is distinct from caller_email
    or invitation.status <> 'accepted'
    or invitation.selected_package is null then
    return 'invalid';
  end if;

  -- A retry by the same linked user is harmless; a second user cannot replay.
  if invitation.claimed_at is not null then
    if invitation.claimed_by = caller_id
      and invitation.linked_user_id = caller_id
      and exists (
        select 1 from public.mentorship_enrolments as enrolment
        where enrolment.application_id = invitation.application_id
          and enrolment.user_id = caller_id
      ) then
      return 'already_claimed';
    end if;
    return 'invalid';
  end if;

  if invitation.expires_at <= now()
    or invitation.linked_user_id is not null then
    return 'invalid';
  end if;

  if exists (
    select 1 from public.mentorship_applications as candidate
    where candidate.linked_user_id = caller_id
  ) or exists (
    select 1 from public.mentorship_enrolments as enrolment
    where enrolment.user_id = caller_id
  ) then
    return 'invalid';
  end if;

  update public.mentorship_applications
    set linked_user_id = caller_id,
        linked_at = now()
  where id = invitation.application_id
    and linked_user_id is null
    and status = 'accepted';

  if not found then
    return 'invalid';
  end if;

  insert into public.mentorship_enrolments (
    application_id, user_id, package, status
  ) values (
    invitation.application_id, caller_id,
    invitation.selected_package, 'active'
  );

  update public.mentorship_claim_invitations
    set claimed_by = caller_id,
        claimed_at = now()
  where application_id = invitation.application_id;

  return 'claimed';
exception
  when unique_violation then
    return 'invalid';
end;
$$;

alter function public.claim_mentorship_with_code(text) owner to postgres;
revoke all on function public.claim_mentorship_with_code(text)
  from public, anon, authenticated, service_role;
grant execute on function public.claim_mentorship_with_code(text)
  to authenticated;

-- Issue or replace an invitation atomically under the locked application row.
-- The caller must be a real authenticated admin; browser tables remain private.
create or replace function public.issue_mentorship_invitation(
  p_application_id uuid,
  p_token_hash text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $
declare
  eligible_id uuid;
begin
  if auth.uid() is null or not public.is_admin()
    or p_application_id is null
    or p_token_hash is null
    or p_token_hash !~ '^[a-f0-9]{64}
-- account ownership and email are never writable through this function.
create or replace function public.update_mentee_display_name(new_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null
    or new_name is null
    or char_length(btrim(new_name)) not between 2 and 120
    or not exists (
      select 1
      from public.mentorship_enrolments as enrolment
      join public.mentorship_applications as application
        on application.id = enrolment.application_id
      where enrolment.user_id = auth.uid()
        and application.linked_user_id = auth.uid()
        and application.status = 'accepted'
    ) then
    raise exception 'Invalid profile update';
  end if;

  update public.profiles
  set full_name = btrim(new_name)
  where id = auth.uid();
end;
$$;

alter function public.update_mentee_display_name(text) owner to postgres;
revoke all on function public.update_mentee_display_name(text)
  from public, anon, authenticated, service_role;
grant execute on function public.update_mentee_display_name(text)
  to authenticated;
 then
    return false;
  end if;

  select application.id
  into eligible_id
  from public.mentorship_applications as application
  where application.id = p_application_id
    and application.status = 'accepted'
    and application.selected_package is not null
    and application.linked_user_id is null
  for update;

  if not found then
    return false;
  end if;

  if exists (
    select 1 from public.mentorship_enrolments as enrolment
    where enrolment.application_id = eligible_id
  ) then
    return false;
  end if;

  insert into public.mentorship_claim_invitations (
    application_id, token_hash, expires_at, created_by,
    claimed_by, claimed_at, created_at
  ) values (
    eligible_id, p_token_hash, clock_timestamp() + interval '48 hours',
    auth.uid(), null, null, clock_timestamp()
  )
  on conflict (application_id) do update
    set token_hash = excluded.token_hash,
        expires_at = excluded.expires_at,
        created_by = excluded.created_by,
        claimed_by = null,
        claimed_at = null,
        created_at = excluded.created_at;

  return true;
end;
$;

alter function public.issue_mentorship_invitation(uuid, text) owner to postgres;
revoke all on function public.issue_mentorship_invitation(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.issue_mentorship_invitation(uuid, text)
  to authenticated;

-- Mentees may edit only their own displayed name. Roles, approval, package,
-- account ownership and email are never writable through this function.
create or replace function public.update_mentee_display_name(new_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null
    or new_name is null
    or char_length(btrim(new_name)) not between 2 and 120
    or not exists (
      select 1
      from public.mentorship_enrolments as enrolment
      join public.mentorship_applications as application
        on application.id = enrolment.application_id
      where enrolment.user_id = auth.uid()
        and application.linked_user_id = auth.uid()
        and application.status = 'accepted'
    ) then
    raise exception 'Invalid profile update';
  end if;

  update public.profiles
  set full_name = btrim(new_name)
  where id = auth.uid();
end;
$$;

alter function public.update_mentee_display_name(text) owner to postgres;
revoke all on function public.update_mentee_display_name(text)
  from public, anon, authenticated, service_role;
grant execute on function public.update_mentee_display_name(text)
  to authenticated;
