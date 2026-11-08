#!/usr/bin/env bash
# Retouch one phone photo of a prepacked meal with Codex, then write the site files.
# Usage: scripts/edit-meal-photo.sh <photo> <meal-id> [left,top,width,height]
#   meal-id   an id from src/content/meals.json, e.g. beef-lasagne
#   crop      optional pixel crop around ONE tray, e.g. 180,380,860,860
# Output: public/images/meals/<meal-id>.jpg and .webp (1200x900). Review before use.
# Puddings and other non-foil dishes: PROMPT_FILE=docs/product-photo-prompt-pudding.txt scripts/edit-meal-photo.sh ...
# Full guide: docs/product-photo-guide.md
set -euo pipefail
SRC="${1:?photo path}"; ID="${2:?meal id}"; CROP="${3:-}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"; mkdir -p "$WORK/in" "$WORK/out"
cd "$ROOT"
node -e '
const sharp=require("sharp");const [src,dst,crop]=process.argv.slice(1);
(async()=>{let s=sharp(src);
 if(crop){const [l,t,w,h]=crop.split(",").map(Number);s=s.extract({left:l,top:t,width:w,height:h});}
 const buf=await s.toBuffer();const m=await sharp(buf).metadata();
 // low-resolution sources make Codex invent texture, so give it a larger, gently sharpened input
 const out=m.width<1000?sharp(buf).resize({width:1110,kernel:"lanczos3"}).sharpen({sigma:0.8}):sharp(buf);
 await out.png().toFile(dst);})()' "$SRC" "$WORK/in/$ID.png" "$CROP"
sed "s/NAME/$ID/g" "${PROMPT_FILE:-docs/product-photo-prompt.txt}" | codex exec --skip-git-repo-check -s workspace-write -C "$WORK" -i "$WORK/in/$ID.png" - > "$WORK/codex.log" 2>&1
[ -f "$WORK/out/$ID.png" ] || { echo "Codex did not write the image. Log: $WORK/codex.log"; exit 1; }
mkdir -p public/images/meals
node -e '
const sharp=require("sharp");const [src,id]=process.argv.slice(1);
(async()=>{const b=sharp(src).resize(1200,900,{fit:"cover"});
 await b.clone().jpeg({quality:82,mozjpeg:true}).toFile(`public/images/meals/${id}.jpg`);
 await b.clone().webp({quality:80}).toFile(`public/images/meals/${id}.webp`);})()' "$WORK/out/$ID.png" "$ID"
echo "Done. Compare against the original, then set in src/content/meals.json:"
echo "  \"imageUrl\": \"/images/meals/$ID.jpg\""
echo "Codex raw output: $WORK/out/$ID.png"
