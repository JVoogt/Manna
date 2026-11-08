# Product photo guide: "Home-kitchen daylight"

How to turn a phone photo of a prepacked, not-yet-frozen meal into a site photo that is appetising and still honest. Written 2026-11-08 from the first three dishes (Macaroni and Mince Cheese Bake, Macaroni and Cheese, Spaghetti and Meatballs).

## The rule
The photograph is retouched, the food is not. Customers receive exactly this tray. Nothing is added, removed, moved or "improved": same pasta, meatballs, cheese, browning, herbs and foil tray. We change the light, the colour and the background only.

## The look
- Top-down flat lay, one tray, centred, about 65 to 70 percent of the frame width, 4:3 landscape.
- A plain warm-oat surface (pale unvarnished wood or linen, about `#f1e6cd`), the same family as the site paper. No cloth prints, plates, cutlery or other trays.
- Soft window light from the upper left and a soft contact shadow to the lower right.
- Honest colour: cheese creamy-yellow (not grey or orange), shadows lifted a little so browning shows texture, natural saturation.
- Foil stays foil: remove dark reflections and fingerprints only.
- Never: steam, sauce drips, garnish, props, glossy "richer" food, text, borders.

## Tools
Codex does the edit (`codex exec -i <image>`, its image tool). Everything else is `sharp` in this repo.

```
scripts/edit-meal-photo.sh "<photo>" <meal-id> [left,top,width,height]
# example
scripts/edit-meal-photo.sh "~/Downloads/lasagne.jpeg" beef-lasagne 180,380,860,860
```
It crops, gives Codex the prompt in `docs/product-photo-prompt.txt`, then writes `public/images/meals/<meal-id>.jpg` and `.webp` at 1200x900 and prints the `imageUrl` line for `src/content/meals.json`. A run takes between one and eight minutes, depending on Codex.

## Steps for each new photo
1. Pick the dish's id from `src/content/meals.json`.
2. Crop to ONE tray, with no part of another tray or any third-party label or phone number in view. For a multi-tray shot (like the six macaroni trays) choose a tray with no extras on top: the jalapeno trays are not on the menu.
3. Run the script. Open the result next to the original.
4. Check, and re-run or fix if any of these fail:
   - Same number of meatballs, same pasta shapes, same herb and pepper flecks.
   - Cheese is bubbled and browned in patches, not smooth, waxy or like mashed potato.
   - Foil corners and rim look like the real tray; no extra or missing tray edges.
   - Colour is warm and believable, not orange or grey.
5. When happy, set `"imageUrl": "/images/meals/<meal-id>.jpg"` in `src/content/meals.json` (the schema accepts paths starting with `/`), build, and deploy. The dish well on the site is replaced by the photo automatically.

## What goes wrong, and what it taught us
- Low-resolution sources make Codex invent texture. The first macaroni and cheese came back waxy. Fix: upscale and gently sharpen before editing (the script does this under 1000 px wide) and keep the texture rules in the prompt.
- Whole multi-tray photos give worse results than one tray cropped in tight.
- The better fix is a better source: shoot each tray yourself, see below. A good source needs less editing and so stays more true.

## Shooting tips for the next photos
- Shoot straight down from about 40 cm, one tray at a time, before freezing and while the top is still just baked.
- Daylight from a window, no flash, on any plain light surface. The retouch replaces it anyway.
- At least 1500 px across the tray: use the main camera, not a zoomed or forwarded WhatsApp copy (WhatsApp compresses; send as a document or share by cable or Dropbox).
- Wipe the tray rim. Take two or three shots and keep the sharpest.

## Still to photograph
Beef Lasagne, Spaghetti Bolognaise, Malva Pudding, Ginger Pudding, Chocolate Pudding. For puddings use the same look from above or at a slight angle, with the same rules.
