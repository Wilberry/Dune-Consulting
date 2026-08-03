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
- Configure public variables separately for Preview and Production so preview canonical URLs use the intended preview-testing policy.
- Keep `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL` and `CONTACT_FROM_EMAIL` server-only. Email remains honestly unavailable when they are absent.
- Resend requires an approved sending domain. Do not claim email readiness until a real preview enquiry arrives.
- Check headers, CSP, routes, mobile/desktop views, sitemap, robots and contact behavior on the preview URL.
- Promote only an approved commit. To roll back, redeploy the last known-good Vercel deployment and restore its matching environment configuration.

No `vercel.json` is required: the current Next.js defaults, headers and environment model cover the deployment requirements.
