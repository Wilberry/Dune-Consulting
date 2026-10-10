# Dune Consulting — mentorship foundation audit and release gate

Audit date: 2026-10-10. Source: `Wilberry/Dune-Consulting`, GitHub `main` at
`74c7e20cb847c72f52421aa6fde21934eeee765a`.

## Verified repository baseline

- `main` contains merged PR #3 (admin/Supabase foundation), PR #4
  (business workflows/newsletter/Turnstile), and PR #5 (admin/UI polish).
- PR #2 was closed unmerged. New feature work starts on
  `feat/mentee-enrolment-foundation` rather than on an older agent branch.
- Existing migration inventory before this branch:
  - `20260807150000_supabase_foundation.sql`
  - `20260810130000_newsletter_campaign_delivery.sql`
  - `20261007120000_faq_content_management.sql`
  - `20261007130000_testimonials_content_management.sql`
- The original mentorship insert omitted `selectedPackage`, and the
  original table omitted any package column. Admin mentorship did not display it.
- No authenticated mentee route, enrolment table, or secure claim flow existed
  in `main`.
- The GitHub connection cannot report a developer's _local_ staged, untracked
  or ignored files. Check local `git status --short --branch` before
  integrating. This audit did not alter any local working tree or stash.
- GitHub Quality workflow runs available at audit time report failure, without
  accessible execution steps/logs for the latest sampled run. The cause,
  including any account/billing restriction, is not independently verified.
- Live Supabase, Vercel environment settings/build logs, DNS/Resend, Turnstile
  credentials and live-site HTTP checks were not accessible for independent
  inspection. They remain **unverified**, despite earlier PR descriptions.

## Workflow status matrix

| Workflow         | Repository evidence                                                           | Remaining verification                                                               |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Contact          | API, validated handler, persistence-before-notification, admin enquiry routes | Live DB, recipient delivery, failure/retry states, admin review                      |
| Quotes           | API, validated handler, reference generator, admin quote routes               | DB reference concurrency, delivery, admin state changes                              |
| Mentorship       | Public form/API, review UI; package persistence fixed in this branch          | Staging migration, complete application-to-dashboard acceptance test                 |
| Insights         | Staff editor, public published-only reads, private cover proxy                | Slugs, sanitization, storage RLS, image download, SEO                                |
| Newsletter       | Signup, admin campaigns, Resend provider/webhook, unsubscribe model           | DNS/provider verification, segment sync, suppression, webhook; **no bulk live send** |
| Turnstile        | Server-side Siteverify and missing-key/error handling                         | Production key configuration, fail-closed behavior and test key in staging           |
| FAQ/testimonials | October 7 migration files and admin management                                | Confirm remote migrations and review production editorial content                    |
| Website          | Next.js 16, responsive pages, tests and audit scripts                         | Actual production smoke, accessibility, asset and content approval                   |

Code presence alone is not proof that an external integration or remote schema works.

## Added feature-branch migrations

1. `20261010150000_mentorship_package_persistence.sql`: nullable package,
   whitelist constraint. Historical rows are not backfilled.
2. `20261010160000_mentee_enrolment_and_claims.sql`: one enrolment per
   application and per Auth user, private hashed claims, strict RLS,
   server-verified single-use claim, limited profile-name update.

Neither migration is considered applied in development or production by this
audit. In particular, **deploy migration 1 before code that inserts or reads
`selected_package`**. Deploy migration 2 before exposing invitation/dashboard
features. Review both together with the deployed code and run the database tests
below first.

## Security model and product behavior

- Staff must accept an application with a stored package before generating an
  invitation. The staff action checks `requireAdminUser()`.
- Codes contain 32 random bytes, expire in 48 hours, and only SHA-256 digests
  are persisted in the private claims table. Generating another code revokes
  the earlier one. No bulk email or automated invitation send is introduced.
- Staff must verify the recipient and transmit the code through a private
  channel; no token may be entered in a URL, log, or analytics field.
- A signed-in claimant must have a _confirmed Supabase Auth email_ equal to the
  application's email; the database checks approval and uniqueness while
  locking the claim row. Matching email alone never authorizes a claim.
- A consumed code is idempotent only for the same Auth UUID. Foreign claims,
  pending/declined applications, expired codes and unverified emails are rejected.
- The dashboard reads its own enrolment and linked application under RLS,
  displays only actual package/cohort/status, and explicitly marks unpublished
  sessions/resources as unavailable.
- A new authenticated account with no claim displays "No linked enrolment."
  Its pending/rejected application cannot be looked up by email to avoid
  disclosure. If staff later change a linked application's status, access to
  accepted-only benefits is withheld.
- The existing `profiles.role` controls staff access. The mentee profile RPC
  only updates the authenticated user's `full_name`; it never edits role,
  package, application status or enrolment ownership.
- Do not introduce fees, payment processing, default cohort dates, fictional
  progress figures, recordings or Microsoft Teams links.

## Local/staging pre-deployment verification

1. Use Node 22 and an isolated, non-production checkout. Run
   `git status --short --branch`, `git log -1 --oneline`,
   `npm ci`, then `npm run verify`.
2. Use a confirmed **staging** Supabase project. Run
   `supabase projects list`, `supabase status` for local services,
   `supabase migration list --linked`, and compare the exact project ref to
   approved staging configuration. Do not print keys or DB passwords.
3. Compare remote history to every checked-in migration, including the October
   FAQ/testimonials migrations. Resolve drift before any push; review
   `supabase db diff --linked` and back up affected schema/data.
4. Apply both new migrations to an isolated development database first. Check
   all existing application counts and historical `selected_package IS NULL`
   rows survive; test the three approved package values and rejection of
   invalid values. Run a migration rollback rehearsal from a data backup.
5. Create two **test** confirmed Auth users and two mentorship applications in
   staging. Confirm an admin can approve, generate and revoke a code. Confirm
   the right user can claim once and reclaim idempotently, while the wrong user,
   email-unconfirmed user and expired code cannot.
6. Using the actual `authenticated` role/JWT in staging, verify users cannot
   select another user's enrolment, modify package, approval, profile role,
   enrolment owner or claim rows. Verify admin and editor permissions separately;
   editors must not issue claims. Test unauthenticated access.
7. Verify sign-up confirmation redirect allow-list points to
   `/auth/callback?next=/dashboard` at the approved domain, and that disabled
   signup or unavailable SMTP is handled operationally.
8. Exercise mobile/desktop dashboard states, profile updates, logout, error
   states, and existing public/admin regression flows. Mock Resend and Turnstile
   for test suites; use an approved controlled email recipient only if needed.
9. Audit preview logs for secret leakage; verify protected routes use no-store
   behavior and public pages retain current branding/layout.

## Production gate — explicitly NOT authorized by this branch

- Identify the actual production Supabase project ref using privileged operator
  access; confirm Vercel Production points to that exact project and not staging.
- Collect a read-only remote migration and schema/policy inventory before
  proposing a production migration. Investigate unknown remote migrations.
- Review backup and data effects, maintenance/rollback steps and migration SQL.
- Require green local checks and staging acceptance results. Investigate the
  GitHub Actions failure separately; do not treat inaccessible job logs as
  passing CI.
- Obtain explicit approval before production SQL changes, Vercel promotion,
  DNS edits or real outgoing invitations/campaigns.
- Once approved, apply schema first, verify it remotely, deploy compatible app
  code next, and perform a narrowly scoped smoke test without touching real
  customer records.

## Known scope boundaries

No complete LMS, payment gateway, assessments, attendance, certificates,
session publishing, mentor scheduling, actual progress telemetry or automatic
invitation emails have been added. These require separate approved business
requirements and acceptance tests. Public signup and confirmation depend on
Supabase Auth provider configuration.

This is an implementation draft awaiting testing, not a signed-off release.
