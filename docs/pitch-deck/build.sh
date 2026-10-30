#!/bin/sh
# Print deck.html to "Serasi pitch deck.pdf" at the repo root with headless Chrome.
# Needs network access, because the page loads Fraunces and DM Sans from Google Fonts (as the app does).
# Usage: sh docs/pitch-deck/build.sh [output.pdf]
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-$HERE/../../Serasi pitch deck.pdf}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=20000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="$OUT" "file://$HERE/deck.html"
echo "Wrote $OUT"
