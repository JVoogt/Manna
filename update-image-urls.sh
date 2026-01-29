#!/bin/bash
# Update products.json to use local image paths
# Run after preparing images with prepare-images.sh

PRODUCTS_FILE="src/content/products.json"

if [ ! -f "$PRODUCTS_FILE" ]; then
  echo "Error: $PRODUCTS_FILE not found"
  exit 1
fi

echo "Updating image URLs in $PRODUCTS_FILE..."
echo ""
echo "Before:"
grep -o '"imageUrl": "[^"]*"' "$PRODUCTS_FILE" | head -3
echo "..."

# Replace remote URLs with local paths
sed -i 's|"imageUrl": "https://images.manna.voogt.co.za/|"imageUrl": "/images/products/|g' "$PRODUCTS_FILE"

echo ""
echo "After:"
grep -o '"imageUrl": "[^"]*"' "$PRODUCTS_FILE" | head -3
echo "..."

echo ""
echo "✓ Updated image URLs to use local paths"
echo ""
echo "Next steps:"
echo "1. Verify changes: git diff $PRODUCTS_FILE"
echo "2. Commit: git add $PRODUCTS_FILE && git commit -m 'feat(images): use local image paths'"
echo "3. Rebuild: cd docker && docker-compose -f docker-compose.dev.yml build"
