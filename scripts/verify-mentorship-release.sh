#!/usr/bin/env bash
# Dune Consulting — isolated, Docker-free mentorship release verification.
# This verifies code and mocked browser flows, NOT live Supabase
# writes, email delivery, or authenticated end-to-end acceptance.
set -Eeuo pipefail
umask 077

REPO="$(git rev-parse --show-toplevel)"
cd "$REPO"

if [ -n "$(git status --porcelain)" ]; then
  echo "BLOCKED: working tree is dirty; verify in a clean checkout/worktree." >&2
  exit 2
fi

if ! node --version | grep -Eq '^v22[.]'; then
  echo "BLOCKED: Node.js 22.x is required; match package.json and Vercel." >&2
  exit 2
fi

echo "=== DUNE MENTORSHIP RELEASE — LOCAL, NON-DESTRUCTIVE VERIFICATION ==="
echo "Git SHA: $(git rev-parse HEAD)"
echo "Node: $(node --version)"
echo "No production database writes or deployments are part of this script."
echo "Migration 20261019100000 is intentionally not applied by this script."

npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build

# Browser tests intentionally mock API submission; do not mistake these for
# real database/SMTP end-to-end proof.
npx playwright test tests/e2e/core.spec.ts \
  --project=chromium-desktop \
  --project=chromium-mobile \
  --grep 'mentorship application can be submitted' \
  --workers=2

npx playwright test tests/e2e/accessibility.spec.ts \
  --project=chromium-desktop \
  --project=chromium-mobile \
  --workers=2

echo "PASS: offline code and targeted browser checks completed."
echo "PENDING: real Postgres limiter RPC, Supabase submission, role checks,"
echo "invitation issue/claim, Auth redirects, and public Vercel access."
