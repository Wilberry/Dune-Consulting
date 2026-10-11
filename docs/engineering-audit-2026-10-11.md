# Dune Consulting — security and end-to-end engineering audit

**Date:** 11 October 2026  
**Source baseline:** `main` at `3d6a3b2413aadbbbd06bc683fe2a03a72e719179`  
**Remediation branch:** `fix/mentorship-security-audit-20261011`  
**Status:** DRAFT — not approved for merge or production deployment.

## Scope and evidence limitations

This audit inspects the connected GitHub repository, the current default
branch, previous PRs, migration SQL, server/client logic and existing tests.
The newly added commits were written directly to an isolated GitHub branch.
The GitHub connection cannot inspect a developer's local uncommitted or
ignored files. A full local checkout with dependencies and an authenticated
test Supabase project was unavailable to this reviewer. **No lint, TypeScript,
build, Playwright, pgTAP or live Auth tests have been executed on this
remediation branch.** Do not convert added test files into a claim that their
tests passed.

The public website could not be fetched through the available web tool.
No live Supabase project, Vercel environment, DNS, provider account or backup
has been independently verified in this review. No migrations, emails,
campaigns, DNS updates, deployments or production data changes were executed.

The existing `docs/supabase-recovery-runbook.md` records an earlier
read-only inspection and explicitly states that no usable production
recovery point has been verified. Reconfirm backup status with the owner
before any production database change.

## Critical branch divergence

The default branch moved forward on 11 October 2026 with commit
`3d6a3b2`, implementing an independent mentee dashboard and five
October 9 migrations. Existing draft PR #6 proposes a separate dashboard
and two October 10 migrations on an older base. **Do not merge PR #6 into
main as-is or apply both sets of SQL migrations.** This remediation starts
from the latest main and adds only a compatible new migration.

## Findings and implemented changes

| Severity | Finding | Change |
| --- | --- | --- |
| High | Any confirmed Auth email matching an accepted application could invoke the existing email-only claim RPC without a distinct claim credential | New one-use admin invitation claim, token hash, expiry, replay checks and revocation of the email-only RPC |
| High | A Resend contact webhook could restore `subscribed` despite a local unsubscribe | Provider state may opt someone out, never opt them back in; preserve local consent |
| High | Public email-only newsletter signup could reactivate an unsubscribed address without proven ownership | Suppress unverified reactivation; future double opt-in needed |
| Medium | Public forms silently bypass Turnstile when both keys are absent, even in Vercel production | Fail closed in Vercel production or when `REQUIRE_TURNSTILE=true` |
| Medium | Public mentorship form allows missing package despite new dashboard requiring it | Require Foundation, Momentum or Elevation for new submissions; preserve historical NULL records |
| Medium | Auth callback permits arbitrary slash-prefixed redirect paths | Allow only `/dashboard` and `/admin/update-password` |
| Medium | Dashboard data-fetch failures could appear as no enrolment | Differentiate database errors, add recoverable error boundary |
| Medium | Staff sign-in logged the Supabase auth response | Remove auth-response logging |
| Functional | Mentee sign-in lacked a registration path | Add Supabase Auth signup with email verification callback |
| Functional | Mentee profile name was read-only | Add enrolled-user-only RPC and name-only form |
| UX | Dashboard could show claim success from an arbitrary query string | Remove query-supplied success claim |
| UX | A previously linked but later declined applicant was shown as unlinked | Read linked application status under owner-scoped RLS; withhold active programme features |
| UX | An email-only newsletter signup could claim success for a suppressed contact | Return an eligibility-neutral confirmation without disclosing subscription state |
| Navigation | Mentee portal was difficult to discover from the mentorship landing page | Add a small sign-in link within existing branding |
| UX | Public website chrome appeared in the mentee portal | Render private dashboard/login shell independently |

### Invitation lifecycle

1. Admin reviews an application in the existing admin screen and accepts it.
2. Admin generates a random 32-byte single-use invitation (48 hours).
3. Only its SHA-256 digest is stored in
   `public.mentorship_claim_invitations`; codes are displayed once.
4. Staff share the code privately with the approved applicant, not through
   a public URL, provider log or automatic email.
5. Applicant registers/signs in using existing Supabase Auth and verifies
   the email on the original application.
6. Server validates code shape and sends only the digest to a limited
   authenticated RPC. The database checks approval, email confirmation,
   application email, code validity/expiry and Auth UUID, then atomically
   links the application, creates the enrolment and consumes the invitation.
7. The same user may retry their consumed invitation idempotently; another
   user cannot replay it. Uniqueness constraints prevent conflicting links.

Existing linked records are retained. Historical packages are **not**
inferred from email. The feature deliberately does not send invitations
automatically or implement payments/assignments/certificates.

### Database and permissions

New migration:
`supabase/migrations/20261011120000_mentorship_invitation_only_claims.sql`

It assumes the five `20261009...` main-branch migrations already exist in
the intended database. It does **not** recreate or overwrite their application
or enrolment tables, avoiding the collision with draft PR #6.

The new invitation table has RLS enabled with no browser policies and no
anon/authenticated table grants. The claim RPC uses `SECURITY DEFINER`,
an empty `search_path`, an explicit authenticated-only EXECUTE grant,
row locks, validation and uniqueness constraints. The old email-only
RPC loses EXECUTE for authenticated clients. A limited profile-name RPC
cannot update role, package, approval or ownership.

Review all owner, grant and RLS assumptions on a disposable local Supabase
database before staging. Test concurrent claims in separate connections.
The added pgTAP test source is a proposed executable test, **not proof** that
the new SQL has passed.

## Wider workflow review

| Area | Repository state | Remaining end-to-end evidence |
| --- | --- | --- |
| Contact | Validated API, persistence-before-notification, admin review | Submit with isolated DB + mocked Resend; real staff inbox smoke only when approved |
| Quotes | Validated form, unique reference generator, admin statuses | Persistence/concurrent reference tests, error states and actual inbox |
| Mentorship | Public form, package mapping, review, secure claim branch | Full review → invite → signup → verify → redeem → dashboard staging test |
| Insights | Published-only access, admin editor, stored covers | Actual image storage policies, slugs, missing articles and metadata |
| Newsletter | Subscriber DB, campaigns, Resend Broadcast/provider webhook | Verify opt-out suppression, delayed/replayed webhook events and provider reconciliation; do not send campaigns |
| Turnstile | Server-side Siteverify with error handling | Verify actual production site/secret keys, action/host validation; 503 if absent in production |
| FAQ/testimonials | Admin code + October 7 migration files | Confirm live migrations and authorized editorial assets/copy |
| Public site | Responsive pages, tests and asset/content auditors | Broken links, keyboard/mobile flows, design snapshots, approved legal/content/assets |
| Deployment | Node 22, Next.js 16, npm scripts, GitHub Quality workflow | Build logs, Vercel environment mapping, preview checks, safe rollback |

No automatic double opt-in/resubscribe mechanism is present; returning
subscribers whose addresses were previously unsubscribed must use a separately
verified consent process. The new public acknowledgement is deliberately
neutral and does not disclose whether an address was suppressed.

The repo's memory-based rate limiter does **not** provide globally shared,
persistent throttling across serverless instances. Distributed rate limiting,
account-lockout controls, verified newsletter re-opt-in and published session
data are additional scoped work, not implemented here.

## Verification gate (current evidence)

| Check | Result |
| --- | --- |
| Source repository branch/PR/migration inspection | Reviewed |
| Isolated remediation commits | Created |
| Added unit and SQL security tests | Written, **not run** |
| `npm ci`, Prettier, ESLint, TypeScript | **Not run** |
| `npm run test`, production build | **Not run** |
| Playwright desktop/mobile, accessibility | **Not run** |
| Local Supabase migrations and pgtap | **Not run** |
| Real Supabase Auth, RLS, invite and concurrency tests | **Not run** |
| Live Supabase migration history, Vercel logs, DNS/email checks | **Not verified** |
| Production database/deployment changes | **Not performed** |

The latest available GitHub Quality workflow on main was marked failed.
Whether the failure is account/platform setup or application code cannot be
inferred without job logs. Do not use it as either a passing or diagnostic
test result.

## Verification instructions for VS Code / isolated staging

1. Protect the original local work: `git status --short --branch` and
   `git fetch origin`. Work in a separate clean checkout or worktree.
2. Switch to `fix/mentorship-security-audit-20261011` only when safe.
   Check the branch diff against the **current** main.
3. Use Node 22 and run separately:
   `npm ci`,
   `npm run format:check`,
   `npm run lint`,
   `npm run typecheck`,
   `npm run test`,
   `npm run build`,
   `npm run e2e`,
   `npm run accessibility`,
   `npm run content:audit`,
   `npm run assets:audit`.
   Capture exit codes, outputs and exact files. Do not ignore inherited
   failures, but distinguish them from feature regressions.
4. Confirm a **disposable**, unlinked local Supabase stack. Apply all main
   migrations in order and then the new `20261011120000` migration. Run
   `supabase test db` (or psql on the test file in a transaction) and
   inspect each grant/role/RLS outcome.
5. Test an accepted Foundation, Momentum and Elevation applicant; a wrong
   account, expired code, revoked code, concurrent claim, unverified email,
   rejected/pending applicant, editor attempt, admin issuance, profile name
   change and cross-mentee read/write denial.
6. In staging, configure the official Supabase Auth redirect allow-list
   for `/auth/callback?next=/dashboard`. Confirm sign-up email verification,
   sign-in, logout, dashboard and phone/tablet/desktop accessibility.
7. Exercise contact/quote/newsletter/Insights test flows with mock
   providers and synthetic data. Assert that a webhook with
   `unsubscribed=false` never reverses prior local consent.
8. Test production-like Turnstile missing keys in isolation: expect public
   form APIs to return 503, not silently skip bot checks. Confirm real
   approved keys before any production promotion.

### Production approval gate

No production migration until the owner/DB operator confirms the correct
project reference, remotely applied migration list, coherent staging history,
a usable database backup and restoration procedure, and explicit authorization.
After staging approval: apply SQL first, verify RLS and grants, then deploy
compatible application code; do a controlled smoke test with synthetic or
authorized test recipients only.

Do not merge draft PR #6 unchanged. Do not push to main, run bulk campaigns,
change DNS, bypass Turnstile or create production Auth test accounts as part
of this audit.

**Release verdict:** **CHANGES PREPARED / STAGING VERIFICATION REQUIRED**.
No claim of end-to-end completion or production safety is made.
