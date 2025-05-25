#!/usr/bin/env bash
set -euo pipefail

# Load nvm if available, install if missing
if ! command -v nvm >/dev/null 2>&1; then
  echo "Installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
else
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi

# Install Node via nvm if not already installed
if ! command -v node >/dev/null 2>&1; then
  nvm install --lts
fi

# Install npm dependencies
npm install

# Install Playwright and dependencies
npx playwright install --with-deps

# Lint and build the project
npm run lint && npm run build
