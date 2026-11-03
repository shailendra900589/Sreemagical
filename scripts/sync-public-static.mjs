/**
 * Hostinger LiteSpeed serves /_next/static from public_html. After `next build`,
 * copy hashed assets into public/_next/static so they stay in sync with HTML.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = join(root, ".next", "static");
// Hostinger publishes this tree into public_html (not under `public/` — Next forbids public/_next).
const dest = join(root, "_next", "static");

if (!existsSync(src)) {
  console.warn("[sync-public-static] .next/static missing — skip");
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(join(root, "_next"), { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("[sync-public-static] Copied .next/static → _next/static");
