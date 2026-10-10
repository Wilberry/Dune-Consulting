# Mentee Local Verification Report

Verification date: 2026-10-10

## 1. Git Baseline

- Repository: `https://github.com/Wilberry/Dune-Consulting`
- Starting checkout: `main` at `74c7e20cb847c72f52421aa6fde21934eeee765a`.
- PR branch: `feat/mentee-enrolment-foundation`, starting head `a0b04cdac1bfe22d1c133f8c8256d701d5876fb4`; main remained `74c7e20cb847c72f52421aa6fde21934eeee765a` when rechecked.
- The remote feature ref was 14 commits ahead with no divergence. No local feature branch existed.
- Original `main` checkout contained five modified and twelve untracked files at start. It was not switched, and those edits were preserved.
- Checks ran in detached worktree `/tmp/dune-pr6-verify-a0b04cd`. This report and scoped fixes are being added to the PR branch; no production change was made.
- Original PR diff: 22 files, 1,146 insertions, 28 deletions; `git diff --check` passed.

## 2. Environment

- Node.js `v22.23.2`; npm `10.9.2`.
- `npm ci` passed; lockfile unchanged. Transitive dependency deprecation warnings were emitted.
- Next.js `16.2.12`, React `19.2.8`, TypeScript `5.9.3`.
- No local Supabase URL/publishable key or server secret, Turnstile keys, or email-provider settings were present. Values were not printed or copied.
- A disposable unlinked local Supabase Docker stack applied all six migrations. Synthetic SQL fixtures were rolled back; the local stack was stopped. No remote database was queried or changed.

## 3. Automated Tests

| Check                   | Result  | Details                                                                                                                                                                                                                                                                                                                                           |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Formatting              | FAIL    | PR-touched files pass focused Prettier checks. Repository-wide check still flags six unchanged FAQ/testimonial files.                                                                                                                                                                                                                             |
| ESLint                  | PASS    | Zero errors; eight warnings for existing image usage and unused imports.                                                                                                                                                                                                                                                                          |
| TypeScript              | PASS    | Original PR head had three package-prefill errors. The enum-safe fix passes `npm run typecheck`.                                                                                                                                                                                                                                                  |
| Unit tests              | PASS    | `npm run test`: 54 passed, 0 failed.                                                                                                                                                                                                                                                                                                              |
| Production build        | PASS    | `npm run build` completed after the TypeScript fix. FAQ/testimonial reads fell back because Supabase credentials were absent.                                                                                                                                                                                                                     |
| Playwright              | FAIL    | Full E2E: 7 passed, 13 failed, 2 skipped, primarily timeouts. The existing mentorship test omits the newly required package; adding Foundation in an isolated test retry still did not reach its expected status. No E2E test change is included because that retry remained failing.                                                             |
| Accessibility           | FAIL    | 2 passed, 20 failed, mostly navigation/context timeouts. Completed cases showed no serious/critical axe violations; the suite did not pass.                                                                                                                                                                                                       |
| Content audit           | FAIL    | 10 launch blockers and 2 warnings for missing company/provider/Turnstile configuration, legal approvals, and assets.                                                                                                                                                                                                                              |
| Asset audit             | FAIL    | 32 blockers and 1 warning, primarily missing/undersized approved public assets.                                                                                                                                                                                                                                                                   |
| Migration verification  | PASS    | Full fresh migration chain and replay after RPC-grant correction applied without SQL errors in the isolated local database.                                                                                                                                                                                                                       |
| RLS authorization tests | PASS    | Inline local SQL assertions passed for RPC ACLs, package whitelist, verified-email/accepted/matching-email claim checks, replay/idempotency, expiry, ownership reads, blocked mentee mutation, editor isolation, and admin management. All test rows rolled back. pgTAP tests could not run because no pgTAP extension/test files were available. |
| Mentee lifecycle        | BLOCKED | Database claim logic was exercised. Full Auth, verification-email, UI claim, and responsive dashboard flows need configured local/staging Supabase Auth; browser tests timed out.                                                                                                                                                                 |

## 4. Security Findings

### Medium: Anonymous execution on security-definer RPCs (fixed)

- Location: `supabase/migrations/20261010160000_mentee_enrolment_and_claims.sql`, claim and profile RPC grants.
- `REVOKE ... FROM PUBLIC` alone left the effective Supabase default `anon` grant in place for both RPCs on a fresh local database.
- Anonymous calls were rejected by null-auth checks, but the unnecessary invocation surface violated least privilege.
- Fix: revoke from both `PUBLIC` and `anon`, then grant execution only to `authenticated`.
- Evidence: after migration replay, anon execution was false, authenticated execution true, and both functions had empty `search_path`; local authorization matrix passed.

### Medium: Package prefill type error (fixed)

- Location: `components/forms/mentorship-application-form.tsx`, `getInitialPackage()`.
- New required package enum conflicted with the helper's inferred `string`/empty-string result, causing three TypeScript errors.
- Fix: return an allowlisted package literal or `undefined` and type the return from the schema-derived union.
- Evidence: original PR typecheck failed; corrected typecheck passed.

### Low: Existing mentorship browser scenario is stale/unresolved

- Location: `tests/e2e/core.spec.ts`, mentorship submission test.
- The test does not select a package after the field became required. A diagnostic retry selecting Foundation still failed to reach the expected status, so the test source change was not included.
- Impact: public application browser submission is not verified. Do not treat E2E as passing.

### Other reviewed controls

- Only admins issue codes; accepted status and a recorded package are checked first. Codes use 32 cryptographically random bytes; only a SHA-256 digest is stored; expiry is 48 hours; replacement upsert invalidates the prior code.
- Claiming checks confirmed Auth email, application-email match, accepted status, claim row lock, replay ownership, and uniqueness. No public status lookup or automatic email is added.
- Dashboard reads are RLS-scoped and show actual stored package/cohort/status. Pending/rejected email lookups and fabricated sessions/resources are absent; accepted-only benefits are withheld when status changes.
- Service-role clients are server-only. Redirect callback rejects scheme-relative, backslash, and control-character targets.

## 5. Fixes Performed

- Formatted the PR-touched files flagged by Prettier; focused checks pass. Six unrelated FAQ/testimonial files remain unformatted.
- Corrected package-prefill typing in `components/forms/mentorship-application-form.tsx`.
- Revoked anonymous execution on the two security-definer RPCs in `supabase/migrations/20261010160000_mentee_enrolment_and_claims.sql`.
- No E2E source correction is included because the isolated retry remained failing.

## 6. Remaining Blockers

- Browser and accessibility suites fail on timeouts; the mentorship application browser flow remains unverified.
- No local Supabase Auth, Turnstile, or email-provider configuration exists; full authenticated lifecycle and provider verification are blocked.
- No authorized staging project was configured, so staging migration history, Auth, and RLS are unverified.
- Content, legal, and public asset approvals remain launch blockers. No provider calls, bulk email, production migration, or production configuration changes were made.
- The original local `main` changes were preserved and are not part of this PR commit.

## 7. Release Readiness

**BLOCKED**

The verified TypeScript and RPC-grant defects are corrected in this PR update, and local migration/RLS checks pass. Browser/accessibility verification and configured staging Auth/database checks remain incomplete, so the implementation is not yet ready for staging acceptance or production release.
