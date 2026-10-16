# Dune Consulting website

Production-ready corporate website foundation for Dune Consulting, a Lagos-based Health, Safety and Environment consultancy. Built with Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod and Lucide.

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Quality checks:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

For the browser and launch-readiness suites, install Playwright's Chromium build once and run:

```bash
npx playwright install chromium
npm run e2e
npm run accessibility
npm run e2e:visual
npm run lighthouse
npm run content:audit
npm run assets:audit
```

`npm run verify` runs the non-visual automated suite. `content:audit:strict` and `assets:audit:strict` intentionally fail while launch blockers remain. See [testing and preview guidance](docs/testing-and-preview.md), the [content handoff](docs/content-handoff.md), the [preview acceptance report](docs/preview-acceptance-report.md), the [client acceptance checklist](docs/client-acceptance-checklist.md) and the [release checklist](docs/release-checklist.md).

## Environment configuration

Copy `.env.example` to `.env.local`. Values prefixed with `NEXT_PUBLIC_` are embedded in browser assets and must never contain secrets. `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL` and `CONTACT_FROM_EMAIL` are server-only.

The application builds without environment variables by using visibly non-production `.example` and placeholder contact fallbacks. The contact endpoint validates submissions but returns `503` without sending when server email configuration is incomplete.

For Resend delivery:

1. Verify an approved sending domain in Resend.
2. Set `RESEND_API_KEY` to a server-side API key.
3. Set `CONTACT_FROM_EMAIL` to an address on that verified domain.
4. Set `CONTACT_RECIPIENT_EMAIL` to the approved enquiry inbox.
5. Submit a real test enquiry from a preview deployment and confirm sender, reply-to and message content.

Rate limiting is privacy-conscious and in-memory (five attempts per IP per 15 minutes). Serverless instances do not share memory, so a production-grade distributed limit should use an external store such as Upstash Redis.
