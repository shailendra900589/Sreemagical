import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const url = process.env.DATABASE_URL ?? "file:./prisma/prod.db";
if (url.startsWith("file:")) {
  const relativePath = url.slice("file:".length);
  mkdirSync(dirname(join(root, relativePath)), { recursive: true });
}

const push = spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  shell: true,
  cwd: root,
});

if (push.status !== 0) {
  process.exit(push.status ?? 1);
}
