import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { siteImages } from "../data/images";
import { projects } from "../data/portfolio";
import { testimonials } from "../data/testimonials";
import { publicEnv, publicEnvFallbacks } from "../lib/env";
import {
  getEmailEnvironment,
  getNewsletterProviderEnvironment,
  getResendWebhookSecret,
  getTurnstileEnvironment,
} from "../lib/server-env";

type Finding = {
  group: string;
  message: string;
  severity: "BLOCKER" | "WARNING";
};
const findings: Finding[] = [];
const add = (group: string, severity: Finding["severity"], message: string) =>
  findings.push({ group, severity, message });

if (
  publicEnv.siteUrl.endsWith(".example") ||
  publicEnv.siteUrl === publicEnvFallbacks.siteUrl
)
  add(
    "Company configuration",
    "BLOCKER",
    "Production site URL is not configured.",
  );
if (publicEnv.companyPhone === publicEnvFallbacks.phone)
  add(
    "Company configuration",
    "BLOCKER",
    "Company telephone number is still the documented placeholder.",
  );
if (publicEnv.companyEmail.endsWith(".example"))
  add(
    "Company configuration",
    "BLOCKER",
    "Public company email still uses the .example domain.",
  );
if (
  publicEnv.linkedinUrl === publicEnvFallbacks.linkedinUrl ||
  publicEnv.instagramUrl === publicEnvFallbacks.instagramUrl
)
  add(
    "Company configuration",
    "BLOCKER",
    "One or more social profile URLs still use generic fallback links.",
  );
if (!getEmailEnvironment().configured)
  add(
    "Enquiry delivery",
    "BLOCKER",
    "Resend sender, recipient, or API configuration is incomplete.",
  );
if (!getNewsletterProviderEnvironment().configured)
  add(
    "Newsletter delivery",
    "BLOCKER",
    "Resend newsletter sender, Segment, or API configuration is incomplete.",
  );
if (!getResendWebhookSecret())
  add(
    "Newsletter delivery",
    "BLOCKER",
    "Resend webhook signing secret is not configured.",
  );
if (getTurnstileEnvironment().status !== "configured")
  add(
    "Form protection",
    "BLOCKER",
    "Cloudflare Turnstile site and secret keys are not fully configured for public forms.",
  );

const pendingImages = siteImages.filter(
  (image) => image.status === "placeholder",
);
if (pendingImages.length)
  add(
    "Assets",
    "BLOCKER",
    `${pendingImages.length} image-manifest entries still require authorised files and approval.`,
  );
add(
  "Assets",
  "WARNING",
  "The geometric favicon/logo mark is temporary until the client approves it or supplies an official mark.",
);
if (projects.some((project) => /confirm/i.test(project.location)))
  add(
    "Portfolio",
    "BLOCKER",
    "One or more project locations remain unconfirmed.",
  );
if (!testimonials.length)
  add(
    "Client content",
    "WARNING",
    "No approved testimonials are configured; the honest empty state remains visible.",
  );
add(
  "Legal",
  "BLOCKER",
  "Privacy Policy and Terms remain approval placeholders.",
);
add(
  "Editorial",
  "WARNING",
  "Insight publication dates and article-detail content remain pending; article routes are intentionally not published.",
);

const roots = ["app", "components", "data", "lib"];
function files(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}
const unfinished: string[] = [];
for (const root of roots)
  for (const file of files(root)) {
    const content = readFileSync(file, "utf8");
    if (/\b(?:TODO|FIXME|lorem ipsum|content in preparation)\b/i.test(content))
      unfinished.push(relative(process.cwd(), file));
  }
if (unfinished.length)
  add(
    "Source audit",
    "BLOCKER",
    `Unfinished markers found in: ${unfinished.join(", ")}.`,
  );

console.log("\nDune Consulting launch-content audit\n");
for (const group of [...new Set(findings.map((finding) => finding.group))]) {
  console.log(`${group}:`);
  for (const finding of findings.filter((item) => item.group === group))
    console.log(`  [${finding.severity}] ${finding.message}`);
  console.log("");
}
const blockers = findings.filter(
  (finding) => finding.severity === "BLOCKER",
).length;
const warnings = findings.length - blockers;
console.log(
  `Summary: ${blockers} blocker(s), ${warnings} warning(s). No secret values were inspected or printed.`,
);
if (process.argv.includes("--strict") && blockers > 0) process.exitCode = 1;
