#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Installing Node dependencies (if needed)"
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "==> Ensuring ssgo module is available"
if ! command -v go >/dev/null 2>&1; then
  echo "Go is not installed or not on PATH. Please install Go 1.21+."
  exit 1
fi

go get github.com/janmarkuslanger/ssgo@latest

echo "==> Preparing dist folder"
mkdir -p dist
if [ -d "public" ]; then
  cp -R public/* dist/ 2>/dev/null || true
fi

echo "==> Building Tailwind CSS"
npm run build:css

echo "==> Building SSGO pages"
npm run build:ssgo

echo "Done."
