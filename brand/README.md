# Manna Kitchen brand pack

Built from the badge on the Manna Kitchen WhatsApp profile (`source/logo-original.png`, 640 px). That bitmap was traced into clean vector artwork, so everything here scales without blurring. See `brand-sheet.png` for the one-page overview.

## What is in the pack
| Folder | Contents |
|---|---|
| `svg/` | Vector logos. `logo-badge` (primary), `logo-badge-phone` (with the number, for stickers and packaging), `logo-badge-purple / black / white` (one-colour), `logo-mark` (cupcake with the badge's own M) and its ring, black and white versions, `logo-lockup` (mark plus "Manna Kitchen" in Vollkorn, for headers and documents), white and black lockups, `pattern-tile`. |
| `png/` | The same logos as transparent PNGs at 1024 px, and 2048 px for the badge and mark (print). |
| `favicons/` | `favicon.svg`, `favicon.ico` (16, 32, 48), PNGs at 16, 32, 48, 64, `apple-touch-icon` (180), `icon-192`, `icon-512`, `icon-maskable-512`, `app-icon.svg`, `site.webmanifest`. |
| `social/` | `avatar-badge-1024` (WhatsApp, Facebook, Instagram profile), `avatar-mark-1024` (cream cupcake on purple), `og-image-1200x630` (link previews). |
| `palette/` | `palette.json`, `palette.css` with the colour roles, a tonal purple scale and the contrast table. |
| `brand-sheet.html / .png` | One-page overview: logos, colourways, icons, colour, type, rules. |

## Colour
Taken from the logo: **Manna purple `#AA1FA0`**. Everything else is derived from its hue so the set stays in tune.

| Role | Hex | Use |
|---|---|---|
| Manna purple | `#AA1FA0` | Logo, buttons, links, marks |
| Plum | `#31102E` | Headlines and body text (15:1 on oat) |
| Plum soft | `#52244D` | Captions, secondary text |
| Berry hover | `#7D1775` | Hover and pressed states |
| Orchid | `#D782CC` | Accent on plum |
| Lilac | `#F0CAEA` | Soft fills, tags |
| Blush | `#F7EAF5` | Light purple panels |
| Oat paper | `#F7F1DF` | Page background |
| Clay | `#E8D0B5` | Warm panels behind food photos |
| Logo black | `#000000` | The logo outline only |

Contrast: purple on oat 5.5:1 (AA), white on purple 6.2:1, plum on oat 15:1. Purple on clay is 4.1:1, so use it for large or bold text only.

## Type
Vollkorn 600 for headlines and prices, Hanken Grotesk 400/600 for body, buttons and labels, body at 18 px or more. The hand-lettered MANNA KITCHEN belongs to the badge only.

## Rules
- Clear space around the badge: the height of the swirl tip to the first line of lettering.
- Minimum size: badge 90 px wide on screen, 22 mm in print. Smaller: use the mark.
- Full-colour badge on white, oat, blush or lilac. On photos, foil and one-colour print use the one-colour versions.
- Never recolour the purple, stretch, rotate, outline, add shadows, or retype the lettering.

## On the website
The purple replaced the old green in `src/styles/tokens.css` (the only place colours are defined). Favicons, manifest and `og-image.png` are in `public/`; the header and footer use `public/images/brand/`; the page head and the business data on the home page point to them.

## Rebuilding
```
cd brand/tools && npm install
node 01-vectorize.mjs && node 02-pack.mjs && node 03-palette.mjs && node 04-assets.mjs && node 06-sheet.mjs && node 05-optimize.mjs
```
Needs Node, `sharp` from the project root and Playwright (the path is set at the top of `04-assets.mjs` and `06-sheet.mjs`).

## Quality note
The source is a 640 px bitmap, so the tracing is as faithful as that allows: smooth curves, true to the shape and lettering, but not hand-drawn Bezier. If the sticker printer or whoever drew the logo still has the original vector file (AI, EPS, PDF or SVG), send it and swap it in as `source/`; every file here can then be regenerated from the real artwork.
