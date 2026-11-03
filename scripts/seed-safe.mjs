import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function dbFilePath() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/prod.db";
  if (!url.startsWith("file:")) return null;
  return join(root, url.slice("file:".length));
}

function runSeed() {
  return spawnSync("npx", ["tsx", "prisma/seed.ts"], {
    stdio: "inherit",
    shell: true,
    cwd: root,
  });
}

function runPush() {
  return spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], {
    stdio: "inherit",
    shell: true,
    cwd: root,
  });
}

let result = runSeed();

if (result.status !== 0) {
  const dbPath = dbFilePath();
  if (dbPath && existsSync(dbPath)) {
    console.warn("[seed-safe] Seed failed — recreating SQLite and retrying once…");
    rmSync(dbPath, { force: true });
    rmSync(`${dbPath}-journal`, { force: true });
    const push = runPush();
    if (push.status === 0) {
      result = runSeed();
    }
  }
}

if (result.status !== 0) {
  console.warn("[seed-safe] Seed skipped (build continues; public pages use catalog fallback).");
}

process.exit(0);
