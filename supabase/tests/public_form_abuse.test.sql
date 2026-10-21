-- Disposable/local pgTAP only. This entire test rolls back.
begin;

create extension if not exists pgtap with schema extensions;
select extensions.no_plan();

select extensions.ok(
  not has_table_privilege('anon', 'public.public_form_abuse_buckets', 'SELECT'),
  'anonymous visitors cannot inspect hashed abuse counters'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.public_form_abuse_buckets', 'SELECT'),
  'signed-in users cannot inspect hashed abuse counters'
);
select extensions.ok(
  has_table_privilege('service_role', 'public.public_form_abuse_buckets', 'INSERT'),
  'only the trusted backend can update abuse counters'
);
select extensions.ok(
  not has_function_privilege('anon', 'public.reserve_public_form_attempt(text,text,text)', 'EXECUTE'),
  'no anonymous RPC access'
);
select extensions.ok(
  not has_function_privilege('authenticated', 'public.reserve_public_form_attempt(text,text,text)', 'EXECUTE'),
  'no signed-in RPC access'
);
select extensions.ok(
  has_function_privilege('service_role', 'public.reserve_public_form_attempt(text,text,text)', 'EXECUTE'),
  'the trusted backend can reserve quota'
);
select extensions.ok(
  not public.reserve_public_form_attempt('unexpected', repeat('a',64), repeat('b',64)),
  'unknown action is denied'
);
select extensions.ok(
  not public.reserve_public_form_attempt('mentorship','raw-ip','email'),
  'malformed subjects are denied'
);

-- A shared IP allows eight mentorship attempts per 15-minute UTC bucket,
-- with distinct test email hashes to avoid the email quota masking the IP cap.
select extensions.is(
  (
    select count(*) from generate_series(1,8) as t(i)
    where public.reserve_public_form_attempt(
      'mentorship', repeat('a',64), lpad(i::text,64,'0')
    )
  ),
  8::bigint,
  'eight mentorship attempts across different emails are admitted'
);
select extensions.ok(
  not public.reserve_public_form_attempt('mentorship', repeat('a',64), repeat('c',64)),
  'the ninth mentorship attempt from that IP is rejected'
);
select extensions.is(
  (select request_count from public.public_form_abuse_buckets
   where scope='mentorship:ip' and subject_hash=repeat('a',64)),
  8,
  'denied attempts do not increment the IP counter'
);

-- A different IP cannot evade the per-email daily cap.
select extensions.is(
  (
    select count(*) from generate_series(1,5) as t(i)
    where public.reserve_public_form_attempt(
      'mentorship', lpad((100 + i)::text,64,'0'), repeat('e',64)
    )
  ),
  5::bigint,
  'five mentorship submissions for one email are admitted from different IPs'
);
select extensions.ok(
  not public.reserve_public_form_attempt('mentorship', repeat('d',64), repeat('e',64)),
  'a sixth mentorship request for the same email is rejected'
);
select extensions.ok(
  (select count(*) = 0 from public.public_form_abuse_buckets
   where scope='mentorship:ip' and subject_hash=repeat('d',64)),
  'a rejected email does not consume an unrelated IP quota'
);

-- Every form action has isolated quotas.
select extensions.ok(
  public.reserve_public_form_attempt('contact', repeat('a',64), repeat('e',64)),
  'contact is independently rate limited'
);
select extensions.ok(
  public.reserve_public_form_attempt('quote', repeat('a',64), repeat('e',64)),
  'quotes have independent quotas'
);
select extensions.ok(
  public.reserve_public_form_attempt('newsletter', repeat('a',64), repeat('e',64)),
  'newsletter is independently rate limited'
);

select * from extensions.finish();
rollback;
