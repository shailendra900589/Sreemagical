#!/usr/bin/env bash
# Run on Hostinger via SSH after: cd ~/domains/sm.amrdev.in/public_html
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f package.json ]]; then
  echo "Error: package.json not found in $ROOT"
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "Missing .env in $ROOT"
  echo "Create it from .env.example (use prisma/prod.db and a strong AUTH_SECRET)."
  exit 1
fi

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}"
export NEXT_TELEMETRY_DISABLED=1

echo "==> Node $(node -v), npm $(npm -v)"
echo "==> Installing dependencies (includes dev deps for build)"
npm install

echo "==> Production build"
npm run build

echo "==> Standalone static assets (also runs at end of npm run build)"
node scripts/sync-public-static.mjs

echo ""
echo "Build finished. In hPanel: sm.amrdev.in → Deployments → Restart application"
echo "Or wait ~1 min if Hostinger auto-restarts Node after file changes."
