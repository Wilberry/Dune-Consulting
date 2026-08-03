# Dune Consulting content handoff

Use this checklist to collect material that the client has approved for public use. Do not send passwords, API keys, login details, private enquiry data, or other secrets through Git or place them in this repository. Share sensitive deployment values directly with the authorised deployment owner through an approved secret manager or Vercel's encrypted environment-variable settings.

## A. Company details

- Approved styling and capitalisation of the company name
- Final production domain
- Public telephone number
- Public enquiry email
- Approved wording for the physical location
- LinkedIn profile URL
- Instagram profile URL
- Any other approved public social accounts

## B. Branding

- Official primary logo and its usage guidance
- Light, dark, horizontal, stacked, and single-colour logo variants where available
- Decision on whether the temporary geometric favicon may remain
- Approval or correction of the current navy, amber, and neutral colour palette
- Written confirmation that every supplied image and logo may be used publicly on the website

Supply vector logos as SVG where possible, with transparent PNG alternatives when required. Do not export a photograph as SVG.

## C. Homepage

- Approved hero photograph
- Approved training photograph
- Approved mentorship photograph
- Approved statistics, including the source and date for each figure
- Approved client names
- Authorised client logo files and permission to display them

## D. Services

- Event Safety Management photographs
- HSE Training photographs
- Personnel Outsourcing photographs
- Confirmed description, scope, benefits, and exclusions for each service
- Approved service-specific frequently asked questions and answers

## E. Portfolio

Provide the following for every project:

- Approved project name and client name
- Confirmed location and year
- Services provided
- Short public project description
- Approved challenges, solution, and outcome wording
- Authorised photographs
- Written permission to identify the client and display the project publicly

Do not provide confidential incident data, internal reports, personal information, or outcomes that cannot be substantiated.

## F. Leadership

- Full public name
- Job title
- Approved biography
- Approved headshot
- Professional credentials that may be displayed publicly

## G. Testimonials

- Exact approved wording
- Client name, role, and company
- Written permission to publish the attribution and wording

## H. Mentorship

- Programme duration and delivery format
- Approved curriculum
- Eligibility requirements
- Fees, if applicable
- Application process and destination
- Next cohort dates, capacity, and application deadline

## I. Legal

- Legally approved Privacy Policy
- Legally approved Terms of Use
- Approved data-retention wording for enquiries
- Company registration information where legally or commercially appropriate

## J. Contact delivery

- Approved recipient email
- Verified Resend sending domain
- Approved sending address on that domain
- Production API key, entered directly into Vercel by an authorised owner—not shared in this document or Git
- Desired email subject format

Preview email delivery remains disabled unless an authorised deployment owner explicitly enables it. A real test enquiry must not be sent without approval.

## Required image filenames

Place approved files under `public/images/` using these exact repository-relative names. The dimensions are minimum recommendations; crop to the stated ratio before export.

| Filename                                                     | Recommended dimensions | Ratio |
| ------------------------------------------------------------ | ---------------------: | ----: |
| `hero-event-safety.jpg`                                      |            1600×1200px |   4:3 |
| `hse-training-session.jpg`                                   |            1600×1200px |   4:3 |
| `hse-mentorship.jpg`                                         |            1600×1200px |   4:3 |
| `about/about-hero.jpg`                                       |            1600×1200px |   4:3 |
| `about/our-story.jpg`                                        |            1600×1200px |   4:3 |
| `about/why-dune.jpg`                                         |            1600×1200px |   4:3 |
| `services/services-hero.jpg`                                 |            1600×1200px |   4:3 |
| `services/event-safety-management.jpg`                       |            1600×1200px |   4:3 |
| `services/hse-training.jpg`                                  |            1600×1200px |   4:3 |
| `services/personnel-outsourcing.jpg`                         |            1600×1200px |   4:3 |
| `mentorship/mentorship-hero.jpg`                             |            1600×1200px |   4:3 |
| `mentorship/who-should-apply.jpg`                            |            1600×1200px |   4:3 |
| `portfolio/portfolio-hero.jpg`                               |            1600×1200px |   4:3 |
| `projects/project-01.jpg` through `projects/project-06.jpg`  |            1600×1200px |   4:3 |
| `insights/insights-hero.jpg`                                 |             1600×900px |  16:9 |
| `insights/article-01.jpg` through `insights/article-05.jpg`  |            1600×1000px | 16:10 |
| `projects/jameson-distillery-on-tour-1.jpg` through `-3.jpg` |            1600×1200px |   4:3 |
| `projects/moonshot-by-techcabal-1.jpg` through `-3.jpg`      |            1600×1200px |   4:3 |
| `projects/afc-staff-retreat-1.jpg` through `-3.jpg`          |            1600×1200px |   4:3 |
| `projects/aproko-nation-fiesta-1.jpg` through `-3.jpg`       |            1600×1200px |   4:3 |
| `projects/martell-davido-launch-1.jpg` through `-3.jpg`      |            1600×1200px |   4:3 |
| `projects/zedcrest-launchpad-1.jpg` through `-3.jpg`         |            1600×1200px |   4:3 |

The typed source of truth is `data/images.ts`. After adding files, update an entry to `approved` only when its usage permission, crop, quality, and alt text are confirmed, then run `npm run assets:audit`.

## Image export guidance

- Prefer WebP or a high-quality progressive JPG for photographs; retain the exact manifest filename unless the code and manifest are deliberately updated together.
- Export photographs in sRGB, strip unnecessary embedded metadata, and target 70–82% quality.
- Keep raster files at or below 1.5MB and SVG files at or below 250KB.
- Preserve transparency only where it is required for logos or graphics.
- Do not upscale small source images merely to satisfy the dimension check.
- Optimise SVGs, convert text to accessible paths only when licensing and brand guidance permit it, and remove editor-specific data.
- Check faces and operational details at mobile, tablet, and desktop crops before approval.
