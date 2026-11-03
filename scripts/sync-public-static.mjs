/**
 * Next.js standalone does NOT copy `.next/static` or `public/` into the bundle.
 * Hostinger Passenger runs `hbuilds/current/nodejs/server.js` — assets must live at
 * `.next/standalone/.next/static` and `.next/standalone/public`.
 *
 * Also mirror into domain `public_html/_next/static` when that folder exists during
 * CI build (Hostinger Git deploy cwd is usually `.../hbuilds/source`).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const staticSrc = join(root, ".next", "static");
const standaloneRoot = join(root, ".next", "standalone");

function copyTree(src, dest) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

if (!existsSync(staticSrc)) {
  console.error("[sync-public-static] ERROR: .next/static missing after build");
  process.exit(1);
}

if (!existsSync(standaloneRoot)) {
  console.error("[sync-public-static] ERROR: .next/standalone missing — cannot deploy assets");
  process.exit(1);
}

const standaloneStatic = join(standaloneRoot, ".next", "static");
const standalonePublic = join(standaloneRoot, "public");

copyTree(staticSrc, standaloneStatic);

if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), standalonePublic, { recursive: true });
}

const publicHtmlTargets = [
  join(root, "public_html", "_next", "static"),
  join(root, "..", "public_html", "_next", "static"),
  join(root, "..", "..", "public_html", "_next", "static"),
];

for (const target of publicHtmlTargets) {
  const publicHtmlDir = dirname(dirname(target));
  if (!existsSync(publicHtmlDir)) continue;
  copyTree(staticSrc, target);
  console.log(`[sync-public-static] mirrored → ${target}`);
}

const cssDir = join(standaloneStatic, "css");
const cssFiles = existsSync(cssDir) ? readdirSync(cssDir) : [];
if (cssFiles.length === 0) {
  console.error("[sync-public-static] ERROR: no CSS files in standalone static bundle");
  process.exit(1);
}

for (const file of cssFiles) {
  const size = statSync(join(cssDir, file)).size;
  if (size < 1000) {
    console.error(`[sync-public-static] ERROR: CSS bundle too small: ${file} (${size} bytes)`);
    process.exit(1);
  }
}

console.log(
  `[sync-public-static] OK cwd=${root} css=${cssFiles.join(",")} standalone+public_html sync done`,
);
