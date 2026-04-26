#!/bin/bash
export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
eval "$(rbenv init -)" 2>/dev/null || true
cd /home/manubm77/gumroad-copilot
bin/rails server -p 3000
