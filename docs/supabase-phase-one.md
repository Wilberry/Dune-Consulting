# Supabase Phase One Setup

This document covers the manual steps required to activate the Dune Consulting Supabase foundation introduced in Phase One.

## What Phase One Adds

- Supabase SSR clients for Next.js App Router
- Supabase Auth session handling
- Protected `/admin` routes
- Admin/editor authorization through `profiles.role`
- Database tables for Insights, enquiries, quote requests, mentorship applications and newsletter subscribers
- Row Level Security policies
- Real dashboard counts and recent activity
- Private `insights` Storage bucket for future article media
- Safe admin profile-name editing

Phase One intentionally does not connect the existing public contact form to Supabase and does not implement Brevo, Turnstile, the full Insights editor, quote forms or mentorship forms.

## 1. Create the Supabase project

Create a Supabase project for Dune Consulting in the Supabase Dashboard.

Keep production and development projects separate if the site later needs a dedicated staging environment.

## 2. Local environment variables

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use the project URL and anon/publishable key for the public variables.

The service-role key is server-only. Never add `NEXT_PUBLIC_` to it and never expose it in browser code.

Existing Resend/contact variables should remain unchanged.

For production, add the same values to the hosting provider's environment configuration instead of committing secrets.

## 3. Install dependencies

Run:

```bash
npm install
```

This installs the Phase One dependencies and refreshes `package-lock.json`:

- `@supabase/supabase-js`
- `@supabase/ssr`

## 4. Apply the database migration

The initial migration is:

```text
supabase/migrations/20260807150000_supabase_foundation.sql
```

### Supabase CLI option

Install or invoke the Supabase CLI, authenticate, and link the local repository to the project:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Review the target project before confirming a database push.

### Dashboard SQL Editor option

For an initial manual setup, the migration can also be reviewed and run in the Supabase SQL Editor. Use the migration file as the single source of truth so later environments remain reproducible.

## 5. Tables created

The migration creates:

- `profiles`
- `articles`
- `contact_enquiries`
- `quote_requests`
- `mentorship_applications`
- `newsletter_subscribers`

It also creates the `quote_reference_seq` sequence used to generate concurrency-safe references such as `DUNE-Q-000001`.

## 6. Authorization model

A Supabase Auth user is not automatically an administrator.

When an Auth user is created, the database trigger creates a matching `profiles` row with `role = NULL`.

Approved role values are:

- `admin`
- `editor`

An `admin` can manage private customer/subscriber data and articles.

An `editor` can manage articles but cannot access contact enquiries, quote requests, mentorship applications or newsletter subscriber records.

## 7. Create the first administrator

First apply the migration.

Then in Supabase Dashboard:

1. Open **Authentication → Users**.
2. Create the staff user with the intended administrator email and password.
3. Confirm the user exists.
4. Open the SQL Editor.
5. Promote only that approved email:

```sql
update public.profiles
set
  role = 'admin',
  full_name = 'Dune Administrator'
where email = 'ADMIN_EMAIL_HERE';
```

Verify exactly one expected row was updated.

Do not add a public signup page.

The administrator can then visit:

```text
/admin/login
```

## 8. Create an editor later

Create another Auth user manually and then run:

```sql
update public.profiles
set role = 'editor'
where email = 'EDITOR_EMAIL_HERE';
```

Editors are intentionally denied access to private enquiry/subscriber tables.

## 9. Storage

The migration creates an `insights` Storage bucket with:

- private access in Phase One
- maximum file size: 5 MB
- JPEG, PNG, WebP and AVIF image types
- upload/update/delete access for approved admins/editors only

Public delivery of published article media is intentionally deferred until the Insights publishing phase, so draft media cannot accidentally become public simply because it was uploaded.

## 10. RLS summary

Anonymous users:

- may read only articles whose status is `published`
- cannot read profiles or private business submissions
- cannot create/update/delete articles directly

Editors:

- may read and manage articles
- may read their own profile
- may update their own display name only through the restricted RPC used by the admin settings page
- cannot read private customer/subscriber tables

Admins:

- may manage articles
- may manage private enquiry, quote, mentorship and newsletter records
- may manage profiles according to RLS policies

## 11. Admin routes

Phase One creates:

```text
/admin/login
/admin
/admin/insights
/admin/enquiries
/admin/quotes
/admin/mentorship
/admin/newsletter
/admin/settings
```

The private routes use server-side authorization in addition to session refresh handling.

## 12. Generate database types later

Once the project is linked, generated Supabase TypeScript definitions can be produced with:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > lib/supabase/database.types.ts
```

When these types are introduced, wire them into the browser/server clients so schema changes become compile-time visible.

## 13. Validation commands

After environment values and dependencies are installed, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The repository also contains broader E2E/accessibility/content checks where appropriate.

## 14. Phase Two

The next backend phase should connect the existing consultation/contact API to Supabase in this order:

```text
Validate request
→ Store enquiry in Supabase
→ Attempt notification email
→ Return success
```

A valid enquiry should remain stored even when email delivery temporarily fails.

Phase Two can then add the real enquiry management UI and dedicated quote workflow without changing the Phase One authorization model.
