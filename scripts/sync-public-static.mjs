/**
 * Next.js standalone does NOT copy `.next/static` or `public/` into the bundle.
 * Hostinger Passenger runs `hbuilds/current/nodejs/server.js`.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
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
  console.error("[sync-public-static] ERROR: .next/standalone missing");
  process.exit(1);
}

const cssDir = join(staticSrc, "css");
const cssFiles = existsSync(cssDir) ? readdirSync(cssDir) : [];
if (cssFiles.length === 0) {
  console.error("[sync-public-static] ERROR: no CSS in .next/static/css");
  process.exit(1);
}

const primaryCss = cssFiles[0];
const cssPath = join(cssDir, primaryCss);
const cssText = readFileSync(cssPath, "utf8");
const cssSize = statSync(cssPath).size;
if (cssSize < 1000) {
  console.error(`[sync-public-static] ERROR: CSS too small: ${primaryCss}`);
  process.exit(1);
}
if (cssText.includes("@tailwind") || !cssText.includes(".flex{")) {
  console.error(
    `[sync-public-static] ERROR: Tailwind utilities missing in ${primaryCss} — add @tailwindcss/postcss for webpack builds`,
  );
  process.exit(1);
}

const manifest = {
  css: `/_next/static/css/${primaryCss}`,
  builtAt: new Date().toISOString(),
};

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "asset-manifest.json"), JSON.stringify(manifest, null, 2));

const standaloneStatic = join(standaloneRoot, ".next", "static");
copyTree(staticSrc, standaloneStatic);

if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), join(standaloneRoot, "public"), { recursive: true });
}

// Hostinger Git build cwd: .../domains/sm.amrdev.in/hbuilds/source/repository
const publicHtmlTargets = [
  join(root, "../../../public_html/_next/static"),
  join(root, "../../public_html/_next/static"),
  join(root, "../public_html/_next/static"),
  join(root, "public_html/_next/static"),
];

for (const target of publicHtmlTargets) {
  const publicHtmlRoot = dirname(dirname(target));
  if (!existsSync(publicHtmlRoot)) continue;
  copyTree(staticSrc, target);
  console.log(`[sync-public-static] mirrored → ${target}`);
}

console.log(
  `[sync-public-static] OK css=${primaryCss} (${cssSize}b) cwd=${root}`,
);
