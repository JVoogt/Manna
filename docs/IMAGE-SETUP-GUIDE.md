# Platter Item Images Setup Guide

## ✅ Bugs Fixed First!

Both platter builder issues have been **resolved**:

1. **✅ Dynamic Pricing**: Platter price now calculates automatically from selected items
   - Real-time calculation: sums all 6 item prices from products.json
   - Updates as you select/deselect items
   - Example: 6 items @ R5 each = R30 platter

2. **✅ Item Deselection**: Users can now swap items
   - Click a selected item again to remove it
   - Use remove buttons in platter slots
   - Select a different item to replace it

## Image Resources

### Free Illustration Sources

I found several excellent sources for food illustrations matching your warm, homemade aesthetic:

#### Best Option: Flaticon (Free with Attribution)
[Flaticon](https://www.flaticon.com) offers thousands of food icons designed by Freepik. Download PNG or SVG format.

**Direct Links for Your Items:**
1. [Chicken Wings](https://www.flaticon.com/free-icon/chicken-wings_3075638) - 1,434+ options
2. [Meatballs](https://www.flaticon.com/free-icon/meatballs_2755260) - Multiple styles
3. [Sausage](https://www.flaticon.com/free-icon/sausage_11520712) - BBQ and food themed
4. [Spring Rolls](https://www.flaticon.com/free-icon/spring-roll_2819209)
5. [Tempura/Prawns](https://www.flaticon.com/free-icon/tempura_2393759)
6. [Cheese](https://www.flaticon.com/free-icon/cheese_744997)

#### Alternative Sources:

- **[Vecteezy](https://www.vecteezy.com/free-vector/food-platter)** - 5,578+ food platter vectors, icons, and backgrounds
- **[Freepik](https://www.freepik.com/free-photos-vectors/food-plate-clipart)** - High-quality food illustrations free for commercial use
- **[GraphicMama](https://graphicmama.com/blog/free-food-illustrations/)** - 120+ free food illustrations (1000+ graphics total)
- **[Pixabay](https://pixabay.com/vectors/search/food/)** - 4000+ free food vectors
- **[unDraw](https://undraw.co/)** - Open-source SVG illustrations (general purpose, customizable colors)

### Style Guidelines

Your website uses warm, earthy tones:
- **Primary**: #8b5a3c (terracotta brown)
- **Secondary**: #e8d5c4 (warm cream)
- **Accent**: #d4a574 (golden wheat)

**Icon Style Recommendations:**
- Flat design with warm colors
- Simple line art (can be colored to match theme)
- Minimal detail for clarity at 400x400px
- Avoid photorealistic styles

## Download Instructions

### Step 1: Download Icons from Flaticon

1. Visit each link above
2. Click "Download" button
3. Select **PNG format, 512px** (free tier)
4. Save to a folder (e.g., `~/Downloads/platter-icons`)

### Step 2: Rename Files

Rename downloaded files to match product IDs:

```bash
cd ~/Downloads/platter-icons

# Example renames:
mv "chicken-wing-icon.png" "chicken-wings.png"
mv "meatballs-icon.png" "meatballs.png"
# ... etc
```

**Required Filenames:**
- ribblets.png
- chicken-wings.png
- meatballs.png
- cocktail-cheese-viennas.png
- cocktail-red-viennas.png
- prawn-tempura.png
- beef-cheese-wors.png
- chicken-strips.png
- vienna-rolls.png
- sausage-rolls.png
- chicken-pops.png
- mince-muffins.png
- pancake-mince.png
- pancake-chicken.png
- cheese-onion-vienna-sticks.png
- cheese-vienna-sticks.png

### Step 3: Convert to WebP

Run the preparation script:

```bash
cd /path/to/Manna
./prepare-images.sh ~/Downloads/platter-icons
```

This script will:
- Resize all images to 400x400px
- Convert to WebP format (smaller file size, better quality)
- Add subtle drop shadow for visual consistency
- Output to `public/images/products/`

### Step 4: Update Image URLs

The script tells you files are ready. Now update `src/content/products.json`:

```bash
# Current (placeholder URLs):
"imageUrl": "https://images.manna.voogt.co.za/ribblets.webp"

# Change to (local):
"imageUrl": "/images/products/ribblets.webp"
```

Or run this quick replacement:

```bash
cd src/content
sed -i 's|https://images.manna.voogt.co.za/|/images/products/|g' products.json
```

### Step 5: Commit and Build

```bash
git add public/images/products/ src/content/products.json
git commit -m "feat(images): add platter item illustrations"

cd docker
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
```

## Troubleshooting

### ImageMagick Not Installed

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install imagemagick
```

**macOS:**
```bash
brew install imagemagick
```

### Script Permissions Error

```bash
chmod +x prepare-images.sh
```

### Images Not Showing After Build

1. Check file paths: `ls -la public/images/products/`
2. Verify products.json URLs match filenames
3. Rebuild Docker container
4. Hard refresh browser (Ctrl+Shift+R)

## Image Licensing

**Flaticon Free Tier:**
- ✅ Free for commercial use
- ⚠️ Requires attribution (footer or credits page)
- Limit: Up to 10 downloads/day

**Attribution Example:**
```html
<a href="https://www.flaticon.com/free-icons/food" title="food icons">
  Food icons created by Freepik - Flaticon
</a>
```

**Pixabay/unDraw:**
- ✅ Free for commercial use
- ✅ No attribution required
- ✅ Unlimited downloads

## Quick Reference

| Product | Search Terms | Suggested Icon Style |
|---------|--------------|---------------------|
| Ribblets | "pork ribs", "bbq ribs" | Glazed, on plate |
| Chicken Wings | "chicken wings", "buffalo wings" | Crispy, saucy |
| Meatballs | "meatballs", "meat balls" | In sauce, on fork |
| Viennas | "hot dog", "sausage", "frankfurter" | Wrapped in pastry |
| Prawn Tempura | "tempura", "shrimp", "prawn" | Battered, fried |
| Chicken Strips | "chicken tender", "chicken finger" | Breaded, golden |
| Sausage Rolls | "sausage roll", "pastry roll" | Flaky, baked |
| Mince Items | "meat pie", "savory pastry" | Filled, golden |
| Pancakes | "crepe", "pancake", "filled pancake" | Folded, stuffed |

## Next Steps

Once images are set up:
1. Test on mobile devices (images should be crisp at all sizes)
2. Verify WebP format works in all browsers (fallback: keep PNGs)
3. Consider adding hover effects in CSS (slight scale, shadow increase)
4. Add loading="lazy" to image tags for performance
