#!/bin/bash
set -e

export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
eval "$(rbenv init -)" 2>/dev/null || true

cd /home/manubm77/gumroad-copilot

echo "=== Ruby Version ==="
ruby --version
echo ""

echo "=== Bundle Install ==="
bundle install
echo ""

echo "=== Database Setup ==="
bin/rails db:create 2>/dev/null || echo "Databases may already exist"
bin/rails db:migrate
echo ""

echo "=== Seed Data ==="
bin/rails db:seed
echo ""

echo "=== Build Frontend ==="
npm run build
npm run build:css
echo ""

echo "✅ Setup complete! Run 'bin/dev' to start the dev server."
