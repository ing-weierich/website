#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Installing Node dependencies (if needed)"
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "==> Ensuring Go is available"
if ! command -v go >/dev/null 2>&1; then
  GO_VERSION="${GO_VERSION:-1.21.13}"
  OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
  ARCH="$(uname -m)"

  case "$ARCH" in
    x86_64) ARCH="amd64" ;;
    arm64|aarch64) ARCH="arm64" ;;
  esac

  GO_TARBALL="go${GO_VERSION}.${OS}-${ARCH}.tar.gz"
  GO_URL="https://dl.google.com/go/${GO_TARBALL}"
  GO_INSTALL_DIR="/tmp/go-${GO_VERSION}"

  echo "Go not found. Downloading ${GO_TARBALL}..."
  mkdir -p "$GO_INSTALL_DIR"

  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$GO_URL" -o "$GO_INSTALL_DIR/$GO_TARBALL"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$GO_INSTALL_DIR/$GO_TARBALL" "$GO_URL"
  else
    echo "Neither curl nor wget is available to download Go."
    exit 1
  fi

  tar -C "$GO_INSTALL_DIR" -xzf "$GO_INSTALL_DIR/$GO_TARBALL"
  export GOROOT="$GO_INSTALL_DIR/go"
  export PATH="$GOROOT/bin:$PATH"
fi

go version
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
