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

## Editing content

- Navigation and service menu: `data/navigation.ts`
- Company contact, domain and social details: `data/company.ts`
- Approved supporting routes and their metadata: `data/routes.ts`
- Service cards: `data/services.ts`
- Impact figures: `data/statistics.ts`
- Project cards: `data/portfolio.ts`
- About, service, mentorship and insights content: `data/page-content.ts`
- Approved testimonials: `data/testimonials.ts`
- Homepage section copy: `components/sections/`
- Contact details: utility bar, footer, contact page and organisation schema in `app/page.tsx`
- Brand colours and global styles: `app/globals.css`
- Typed image inventory and approval status: `data/images.ts`

Business content not yet approved is deliberately identified as placeholder content. Replace all `.example` email/domain values and the placeholder telephone number before launch.

## Images required

Supply authorised, web-optimised JPG images using these exact paths. Until supplied, accessible aspect-ratio placeholders preserve the final layout.

- `public/images/hero-event-safety.jpg`
- `public/images/hse-training-session.jpg`
- `public/images/hse-mentorship.jpg`
- `public/images/projects/project-01.jpg`
- `public/images/projects/project-02.jpg`
- `public/images/projects/project-03.jpg`
- `public/images/projects/project-04.jpg`
- `public/images/projects/project-05.jpg`
- `public/images/projects/project-06.jpg`

Supporting pages also use clearly labelled placeholders under:

- `public/images/about/`
- `public/images/services/`
- `public/images/mentorship/`
- `public/images/portfolio/`
- `public/images/insights/`
- project gallery files matching `public/images/projects/{project-slug}-{1..3}.jpg`

Approved client logos are also required for Jameson, TechCabal, Africa Finance Corporation, Martell, Zedcrest and Aproko Nation. The current logo strip contains labelled text placeholders and does not reproduce protected artwork.

## Client details required before launch

- Approved website domain and canonical URL
- Telephone number and enquiry email address
- Approved LinkedIn and Instagram profile URLs
- Form delivery endpoint or inbox
- Confirmed project locations and project page copy
- Approved client testimonials
- Privacy policy and terms copy
- Long-form content for supporting pages

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

## Fonts, security and assets

The site uses a robust system-font stack to prevent Google Fonts network failures during production builds. The CSS preserves the intended sans-serif hierarchy and can be upgraded later with intentionally supplied, properly licensed local font files.

Security headers are configured in `next.config.ts`: CSP, MIME sniffing protection, frame protection, referrer and permissions policies, plus HSTS in production. Development CSP permits `unsafe-eval` for Next.js tooling; production does not. Recheck the CSP when adding analytics, external images, forms or other third-party browser resources.

`data/images.ts` is the source of truth for required paths, alt text, intended pages, dimensions, aspect ratios and approval status. Before replacing a placeholder:

1. Confirm usage rights and client approval.
2. Crop and optimise to the recommended dimensions/aspect ratio.
3. Save to the exact manifest pathname.
4. Change its status from `placeholder` to `approved`.
5. Check mobile and desktop crops, alt text, file size and layout stability.

The generated favicon, Apple icon and social image use original temporary geometric artwork. Replace them if Dune supplies an approved official mark.

## Vercel deployment

1. Import `Wilberry/Dune-Consulting` into Vercel and select the intended production branch after PR approval.
2. Confirm Vercel detects **Next.js** and uses `npm ci` with Node.js 20 or newer.
3. Add every `.env.example` variable in Project Settings. Scope secrets to Preview/Production as appropriate; never paste them into source files.
4. Deploy a preview and run the full local quality suite before promoting it.
5. Verify `/sitemap.xml`, `/robots.txt`, canonical URLs, Open Graph images, icons, headers, valid routes and the branded 404.
6. Connect Resend, submit an enquiry, confirm inbox delivery and verify no automatic reply is sent.
7. Replace placeholder images, logos, project information and legal copy with approved assets/content.
8. Add the approved production domain to `NEXT_PUBLIC_SITE_URL`, Vercel Domains and Resend. Redeploy so metadata is regenerated.
9. Inspect mobile navigation, keyboard focus, forms, accordions and responsive layouts on the preview.
10. Configure DNS only after stakeholder approval, then recheck HTTPS, HSTS, canonical URLs, sitemap URLs and email delivery on production.

## Launch blockers checklist

- [ ] Resolve the GitHub Actions account billing lock and obtain a green Quality workflow.
- [ ] Set the approved production domain and canonical URL.
- [ ] Confirm the public telephone number and enquiry email.
- [ ] Confirm LinkedIn and Instagram profile URLs.
- [ ] Configure and test Resend sender, recipient and API key.
- [ ] Replace every `placeholder` entry in `data/images.ts` with authorised imagery.
- [ ] Supply approved client logo files and permission to display them.
- [ ] Confirm project locations, service scope, challenges, solutions and outcomes.
- [ ] Approve leadership names, biographies, roles and portraits.
- [ ] Approve programme dates, format, fees, eligibility and cohort details.
- [ ] Approve article publication dates and enable article routes only when publishable.
- [ ] Connect newsletter/search functionality or retain their clearly disabled state.
- [ ] Supply approved testimonials; do not publish fabricated feedback.
- [ ] Obtain legal approval for Privacy Policy and Terms content.
- [ ] Replace the temporary geometric mark if an official Dune logo is supplied.
- [ ] Decide whether in-memory rate limiting is sufficient or configure a distributed store.
- [ ] Run the complete pre-launch suite and manual accessibility/email checks on Vercel Preview.

Pull requests and pushes to `main` run formatting verification, linting, TypeScript checks, focused tests and the production build through `.github/workflows/quality.yml`. These commands can all be run locally while GitHub Actions is unavailable.
