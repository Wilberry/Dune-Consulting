# Dune Consulting release checklist

Leave every unresolved item unchecked. Record any explicit waiver beside the relevant item.

## Quality and approval

- [ ] Formatting, lint, TypeScript, unit, browser and accessibility checks pass.
- [ ] Lighthouse scores meet the documented desktop and mobile targets.
- [ ] GitHub Actions is available and green, or the release owner records an explicit waiver.
- [ ] Client acceptance checklist is completed and signed off.
- [ ] Content audit passes in strict mode.

## Configuration and delivery

- [ ] Production public environment variables are configured.
- [ ] Server-only Resend variables are configured in Vercel.
- [ ] Resend sending domain is verified.
- [ ] A real test enquiry reaches the approved recipient.
- [ ] No automatic customer reply is enabled without separate approval.
- [ ] Production domain and DNS are configured.
- [ ] HTTPS is active and HSTS is present.

## Search, identity and legal

- [ ] `/sitemap.xml` is accessible and contains the production domain.
- [ ] `/robots.txt` is accessible and references the production sitemap.
- [ ] Canonical and Open Graph URLs use the production domain.
- [ ] Breadcrumb, Organization, Service and Blog structured data are checked.
- [ ] Temporary favicon/mark is replaced or explicitly approved.
- [ ] Analytics decision is recorded, including “no analytics” if applicable.
- [ ] Privacy Policy is legally approved.
- [ ] Website Terms are legally approved.

## Operations

- [ ] Production build and preview smoke tests pass.
- [ ] Backup/export of the release commit and environment-variable list exists securely.
- [ ] Rollback owner and previous stable Vercel deployment are identified.
- [ ] Post-launch contact delivery, 404, sitemap, robots and primary routes are checked.
