import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["tsx", "prisma/seed.ts"], {
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  console.warn("[seed-safe] Seed skipped (database may already be seeded or unavailable).");
  process.exit(0);
}
