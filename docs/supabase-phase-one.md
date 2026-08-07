# Supabase Phase One Setup

This phase establishes Supabase as the secure backend foundation for Dune Consulting. Public contact delivery remains unchanged until Phase Two.

## 1. Create/connect the Supabase project

Create a Supabase project for Dune Consulting and copy the project URL, anon/publishable key, and service-role key from the Supabase dashboard.

Local secrets belong in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Keep the service-role key server-only. Never prefix it with `NEXT_PUBLIC_`.

The existing Resend variables remain unchanged.

## 2. Install dependencies

```bash
npm install
```

The project uses `@supabase/supabase-js` and `@supabase/ssr`. The SSR package is used for cookie-based Next.js App Router authentication.

## 3. Apply the database migration

If the Supabase CLI is already linked to the project:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Alternatively, paste `supabase/migrations/20260807150000_admin_foundation.sql` into the Supabase SQL Editor and run it once against the intended project.

The migration creates:

- `profiles`
- `articles`
- `contact_enquiries`
- `quote_requests`
- `mentorship_applications`
- `newsletter_subscribers`
- the `insights` storage bucket
- updated-at triggers
- automatic Auth profile creation
- role helper functions
- Row Level Security policies
- the concurrency-safe `DUNE-Q-000001` quote reference sequence

## 4. Create the first administrator

There is intentionally no public registration page.

In Supabase Dashboard:

1. Open Authentication → Users.
2. Choose **Add user**.
3. Create the approved Dune staff account with email/password.
4. The database trigger creates a matching `profiles` row with `role = null`.
5. Promote only the approved account using the SQL Editor:

```sql
update public.profiles
set role = 'admin',
    full_name = 'Dune Administrator'
where email = 'approved-admin@example.com';
```

Verify the result:

```sql
select id, email, full_name, role
from public.profiles
where email = 'approved-admin@example.com';
```

Only use `editor` for staff who should manage Insights without access to private enquiries, quotes, mentorship applications or subscriber lists.

## 5. Auth behaviour

- `/admin/login` is the only unprotected admin route.
- `/admin` and all management routes require an authenticated Supabase session.
- Sensitive pages also perform server-side role checks.
- A valid Auth user without `profiles.role = admin|editor` is signed out/denied.
- Next.js 16 `proxy.ts` refreshes Supabase SSR sessions and performs an early unauthenticated redirect. It is not the sole authorization boundary.

## 6. Storage

The migration creates an `insights` bucket. Only `admin` and `editor` roles can insert/update/delete files through Storage policies. Public read access is enabled for Insight media so published assets can be served directly later. Do not store private customer documents in this bucket.

## 7. Generate database TypeScript types

After linking the Supabase project, generated types can replace or augment local application types:

```bash
npx supabase gen types typescript --linked > lib/supabase/database.types.ts
```

Regenerate after schema changes.

## 8. Production environment

Add the same Supabase environment variables to the production hosting provider. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

For Supabase Auth URL configuration, add the production site URL and any required local/preview redirect URLs in Authentication → URL Configuration.

## 9. Phase Two boundary

Phase One deliberately does not:

- store the current public contact form in Supabase
- replace the current Resend contact delivery flow
- build the dedicated quote form
- build the mentorship application form
- build full Insights CRUD/editor/media upload UI
- connect newsletter delivery providers
- add Cloudflare Turnstile

Phase Two should change contact submission ordering to: validate → store in Supabase → attempt notification email → return a durable submission result.
