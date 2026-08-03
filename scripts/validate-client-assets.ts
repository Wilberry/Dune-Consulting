import { existsSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import sharp from "sharp";
import { siteImages } from "../data/images";

type Severity = "BLOCKER" | "WARNING";
type Finding = { severity: Severity; path: string; message: string };

const root = join(process.cwd(), "public", "images");
const supportedFormats = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);
const maxRasterBytes = 1_500_000;
const maxSvgBytes = 250_000;
const aspectTolerance = 0.05;
const findings: Finding[] = [];

function add(severity: Severity, path: string, message: string): undefined {
  findings.push({ severity, path, message });
}

function files(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

function expectedDimensions(value: string) {
  const match = value.match(/^(\d+)×(\d+)px$/);
  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : undefined;
}

function expectedRatio(value: string) {
  const match = value.match(/^(\d+):(\d+)$/);
  return match ? Number(match[1]) / Number(match[2]) : undefined;
}

async function main() {
  const suppliedFiles = files(root);
  const manifestPaths = new Set(
    siteImages.map((item) => join(process.cwd(), "public", item.pathname)),
  );

  for (const file of suppliedFiles) {
    const path = relative(process.cwd(), file);
    const extension = extname(file).toLowerCase();
    if (!supportedFormats.has(extension))
      add(
        "BLOCKER",
        path,
        `Unsupported format ${extension || "without an extension"}; use JPG, PNG, WebP, or SVG where appropriate.`,
      );
    if (!manifestPaths.has(file))
      add(
        "WARNING",
        path,
        "Unexpected file: it is not referenced by the typed image manifest.",
      );
  }

  for (const item of siteImages) {
    const file = join(process.cwd(), "public", item.pathname);
    const path = relative(process.cwd(), file);
    if (
      !item.alt.trim() ||
      /^(image|photo|photograph)|authorised (project|gallery) photograph/i.test(
        item.alt.trim(),
      )
    )
      add(
        "WARNING",
        path,
        "Alt text is missing or generic; describe the approved image's relevant purpose.",
      );
    if (!existsSync(file)) {
      add(
        "BLOCKER",
        path,
        item.status === "placeholder"
          ? "Required asset is missing and its manifest status remains placeholder."
          : "Required approved asset is missing.",
      );
      continue;
    }
    if (item.status === "placeholder")
      add("BLOCKER", path, "Manifest status is still placeholder.");
    const extension = extname(file).toLowerCase();
    if (!supportedFormats.has(extension)) continue;
    const size = statSync(file).size;
    const sizeLimit = extension === ".svg" ? maxSvgBytes : maxRasterBytes;
    if (size > sizeLimit)
      add(
        "BLOCKER",
        path,
        `File is oversized (${Math.ceil(size / 1024)}KB; maximum ${Math.ceil(sizeLimit / 1024)}KB).`,
      );
    try {
      const metadata = await sharp(file, {
        limitInputPixels: 100_000_000,
      }).metadata();
      if (!metadata.width || !metadata.height) {
        add("BLOCKER", path, "Image dimensions could not be determined.");
        continue;
      }
      const minimum = expectedDimensions(item.recommendedDimensions);
      if (
        minimum &&
        (metadata.width < minimum.width || metadata.height < minimum.height)
      )
        add(
          "BLOCKER",
          path,
          `Dimensions ${metadata.width}×${metadata.height}px are below the recommended ${item.recommendedDimensions}.`,
        );
      const ratio = expectedRatio(item.aspectRatio);
      if (
        ratio &&
        Math.abs(metadata.width / metadata.height - ratio) / ratio >
          aspectTolerance
      )
        add(
          "BLOCKER",
          path,
          `Aspect ratio ${metadata.width}:${metadata.height} does not match ${item.aspectRatio} within 5%.`,
        );
    } catch {
      add(
        "BLOCKER",
        path,
        "Image could not be read. Confirm that it is a valid, non-corrupt asset.",
      );
    }
  }

  console.log("\nDune Consulting client-asset audit\n");
  if (!findings.length) console.log("All manifest assets passed validation.\n");
  for (const severity of ["BLOCKER", "WARNING"] as const) {
    const matching = findings.filter(
      (finding) => finding.severity === severity,
    );
    if (!matching.length) continue;
    console.log(`${severity}S (${matching.length})`);
    for (const finding of matching)
      console.log(`  - ${finding.path}: ${finding.message}`);
    console.log("");
  }
  const blockers = findings.filter(
    (finding) => finding.severity === "BLOCKER",
  ).length;
  const warnings = findings.length - blockers;
  console.log(
    `Summary: ${siteImages.length} manifest asset(s), ${suppliedFiles.length} supplied file(s), ${blockers} blocker(s), ${warnings} warning(s).`,
  );
  console.log("No files were modified and no embedded metadata was printed.");
  if (process.argv.includes("--strict") && blockers > 0) process.exitCode = 1;
}

main().catch(() => {
  console.error("Asset validation could not complete.");
  process.exitCode = 1;
});
