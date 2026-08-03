# Preview acceptance report

## Deployment record

- Vercel project: Connected to the GitHub repository
- Preview URL: Pending the first branch preview deployment
- Source baseline at preparation: `a09d874eba7752d284717c0c85c880ddb6bd201d`
- Deployment date: Not applicable
- Report prepared: 3 August 2026
- Environment: Local production build and Chromium emulation

The Vercel project is now connected to the GitHub repository and is awaiting its first preview deployment from `feature/initial-website`. The final pushed commit is recorded in PR #1 and in the implementation handoff. When the branch preview completes, add its URL, deployment ID, date, and exact commit here in a follow-up acceptance update.

A local production build using `VERCEL_ENV=preview` and `NEXT_PUBLIC_REVIEW_MODE=true` confirmed the review notice, `noindex` metadata, crawl blocking, production-domain canonical fallback, security headers, and disabled preview email delivery.

## Routes checked locally

- `/`
- `/about`
- `/services`
- `/services/event-safety-management`
- `/services/hse-training`
- `/services/personnel-outsourcing`
- `/mentorship`
- `/portfolio`
- `/portfolio/jameson-distillery-on-tour`
- `/insights`
- `/contact`
- `/sitemap.xml`
- `/robots.txt`
- `/manifest.webmanifest`
- `/opengraph-image`
- `/icon.svg`
- An unsupported route, confirmed as HTTP 404

Every listed local route returned HTTP 200 and the unsupported route returned HTTP 404. CSP, HSTS, MIME sniffing protection, frame protection, referrer policy, and permissions policy were present. Live mixed-content and deployment-network checks remain pending until a preview URL exists.

## Browser and accessibility results

- Browser sizes: 390×844 mobile, 768×1024 tablet, and 1440×1000 desktop
- Core Playwright suite: passed locally
- Mobile navigation, keyboard navigation, invalid routes, resources, internal links, console errors, and horizontal overflow: passed locally
- axe serious/critical scan: passed on 20 desktop/mobile route combinations
- Visual regression: passed against 15 committed baselines
- Curated review images: stored under `docs/review-screenshots/` and explicitly labelled as placeholder previews

## Lighthouse summary

Four representative routes were measured in a local production build:

| Profile | Performance | Accessibility | Best Practices | SEO |
| ------- | ----------: | ------------: | -------------: | --: |
| Desktop |      88–100 |           100 |         96–100 | 100 |
| Mobile  |       77–84 |           100 |         96–100 | 100 |

Lighthouse reports are temporary local output and are not committed.

## Contact and email delivery

- Form validation, error mapping, honeypot, minimum completion time, rate limiting, duplicate-submit prevention, HTML escaping, provider failure, and missing configuration are automated.
- Without valid server-only configuration, the endpoint returns HTTP 503 and no success message is shown.
- Vercel previews block email delivery by default, even if email credentials are present. An authorised owner must explicitly set the server-only `ENABLE_PREVIEW_EMAIL_DELIVERY=true` flag before an approved preview delivery test.
- No real enquiry was sent during this acceptance pass.

## Known placeholders and launch blockers

- Production domain, telephone, enquiry email, physical location wording, and social URLs
- Official logo decision and authorised client logos
- Forty-three approved image-manifest assets
- Confirmed project locations, descriptions, challenges, solutions, and outcomes
- Leadership details and approved credentials
- Testimonials and publication permission
- Final mentorship programme details
- Resend recipient, verified domain, sending address, and production API key
- Legally approved Privacy Policy, Terms of Use, and data-retention wording
- Final insight publication details
- GitHub Actions account billing lock, which prevents the workflow job from starting

Run `npm run content:audit` and `npm run assets:audit` for the current machine-readable summary.

## Client review instructions

1. Review the responsive pages and the curated placeholder screenshots.
2. Record content corrections against `docs/content-handoff.md`; do not send credentials through Git.
3. Confirm image permissions, names, crops, and alt text before any manifest entry is marked approved.
4. Treat all `.example` details, generic locations, temporary branding, and legal placeholders as non-final.
5. Do not approve production launch until the strict content and asset audits pass, contact delivery is authorised and tested, and the release checklist is complete.

## Approval sign-off

- Client reviewer:
- Role:
- Decision: Approved / Approved with changes / Not approved
- Date:
- Required changes or conditions:
- Delivery owner confirmation:
