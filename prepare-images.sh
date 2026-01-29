#!/bin/bash
# Prepare platter item images for website
# Usage: ./prepare-images.sh <input-directory>

INPUT_DIR="$1"
OUTPUT_DIR="./public/images/products"

if [ -z "$INPUT_DIR" ]; then
  echo "Usage: $0 <input-directory>"
  echo ""
  echo "Example: $0 ~/Downloads/flaticon-food-icons"
  echo ""
  echo "This script converts PNG images to WebP format (400x400px)"
  echo "and adds a subtle drop shadow for visual consistency."
  exit 1
fi

if [ ! -d "$INPUT_DIR" ]; then
  echo "Error: Directory $INPUT_DIR does not exist"
  exit 1
fi

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
  echo "Error: ImageMagick is not installed"
  echo ""
  echo "Install with:"
  echo "  Ubuntu/Debian: sudo apt install imagemagick"
  echo "  macOS: brew install imagemagick"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Determine ImageMagick command (v7 uses 'magick', v6 uses 'convert')
if command -v magick &> /dev/null; then
  MAGICK_CMD="magick"
else
  MAGICK_CMD="convert"
fi

echo "Converting images from: $INPUT_DIR"
echo "Output directory: $OUTPUT_DIR"
echo ""

count=0

for img in "$INPUT_DIR"/*.{png,PNG,jpg,JPG,jpeg,JPEG} 2>/dev/null; do
  # Skip if no files match
  [ -e "$img" ] || continue

  filename=$(basename "$img")
  filename_no_ext="${filename%.*}"

  # Convert to WebP, resize to 400x400, add subtle drop shadow
  $MAGICK_CMD "$img" \
    -resize 400x400 \
    -background none \
    -gravity center \
    -extent 400x400 \
    \( +clone -background black -shadow 80x3+0+2 \) \
    +swap -background none -layers merge +repage \
    -quality 85 \
    "$OUTPUT_DIR/${filename_no_ext}.webp" 2>/dev/null

  if [ $? -eq 0 ]; then
    echo "✓ Converted: ${filename_no_ext}.webp"
    ((count++))
  else
    echo "✗ Failed: ${filename}"
  fi
done

echo ""
if [ $count -eq 0 ]; then
  echo "No images were converted. Make sure the directory contains PNG or JPG files."
else
  echo "Successfully converted $count image(s)"
  echo "Location: $OUTPUT_DIR"
  echo ""
  echo "Next steps:"
  echo "1. Update image URLs in src/content/products.json"
  echo "2. Commit the new images to git"
  echo "3. Rebuild Docker container: cd docker && docker-compose -f docker-compose.dev.yml build"
fi
