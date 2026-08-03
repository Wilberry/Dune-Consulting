# Testing and Vercel preview rehearsal

## Browser and accessibility tests

Install Chromium once with `npx playwright install chromium`. Then run:

```bash
npm run e2e
npm run e2e:headed
npm run accessibility
npm run e2e:report
```

The main projects are Chromium desktop and a 390×844 Chromium mobile emulation. Core tests cover navigation, keyboard/pointer service menus, mobile focus management, contact states, routes, internal links, resources and console errors. Axe tests fail on serious or critical findings.

## Visual baselines

Visual snapshots cover the homepage, service, mentorship, portfolio and contact pages at 390×844, 768×1024 and 1440×1000. Reduced motion and disabled screenshot animations keep output stable.

```bash
npm run e2e:visual
npm run e2e:visual:update # only after intentional visual review
```

Review every changed PNG before committing an update. Small anti-aliasing differences within the configured tolerance are accepted; layout, content or component changes require human approval.

## Lighthouse

Build first, then run `npm run lighthouse`. Reports are written to `.lighthouse/` and are not committed. Targets are desktop 85/95/95/95 and mobile 75/95/95/95 for Performance, Accessibility, Best Practices and SEO. Lighthouse is a lab measurement and can vary slightly between machines; investigate sustained regressions rather than weakening a budget to accommodate one run.

## Vercel preview

- Import the repository with root directory `.` and the Next.js framework preset.
- Use Node.js 20+, install command `npm ci`, and build command `npm run build`.
- Configure public variables separately for Preview and Production. Keep `NEXT_PUBLIC_SITE_URL` set to the intended public production URL; Vercel's generated preview hostname must not become the canonical URL.
- Set `NEXT_PUBLIC_REVIEW_MODE=true` only in Preview when the client-review notice is wanted. It is disabled by default.
- Vercel's standard `VERCEL_ENV=preview` value automatically sets page metadata to `noindex, nofollow` and changes `/robots.txt` to disallow crawling. Production SEO remains unchanged.
- Keep `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL` and `CONTACT_FROM_EMAIL` server-only. Email remains honestly unavailable when they are absent.
- Preview email delivery is blocked even when those three variables exist. Only an authorised delivery test should temporarily set the server-only `ENABLE_PREVIEW_EMAIL_DELIVERY=true` variable in Preview.
- Resend requires an approved sending domain. Do not claim email readiness until a real preview enquiry arrives.
- Check headers, CSP, routes, mobile/desktop views, sitemap, robots and contact behavior on the preview URL.
- Promote only an approved commit. To roll back, redeploy the last known-good Vercel deployment and restore its matching environment configuration.

No `vercel.json` is required: the current Next.js defaults, headers and environment model cover the deployment requirements.

### Owner deployment steps

No authenticated Vercel CLI was available during the acceptance pass. An authorised repository owner can deploy without sharing credentials:

1. In the Vercel dashboard, choose **Add New → Project**, import `Wilberry/Dune-Consulting`, and leave the root directory as `.`.
2. Confirm Framework Preset **Next.js**, Node.js 20 or later, install command `npm ci`, and build command `npm run build`.
3. Add the approved public variables to the **Preview** scope. Set `NEXT_PUBLIC_REVIEW_MODE=true`; leave all Resend variables and `ENABLE_PREVIEW_EMAIL_DELIVERY` unset unless an email test is separately authorised.
4. Deploy branch `feature/initial-website` as a Preview. Do not assign the production domain or promote the deployment.
5. Record the generated URL and exact commit in `docs/preview-acceptance-report.md`.
6. Run the route, header, browser, overflow, and safe-form checks listed in that report.

Alternatively, after installing and authenticating the Vercel CLI through the browser, run `vercel link` from the repository root and `vercel deploy`. Do not use `vercel --prod`, and inspect `.vercel/project.json` locally without committing `.vercel/`.
