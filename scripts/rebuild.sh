#!/bin/bash
#
# Manna Kitchen Rebuild Script
#
# Purpose: Rebuild and deploy the Manna Kitchen website after content changes
# Usage: ./scripts/rebuild.sh
#
# This script:
# 1. Pulls latest changes from git (your JSON content updates)
# 2. Builds the Astro static site
# 3. Rebuilds the Docker image with fresh content
# 4. Deploys the updated container (zero-downtime)
#

# Exit immediately if any command fails
set -e

echo "=========================================="
echo "  Starting Manna Kitchen rebuild..."
echo "=========================================="
echo ""

# Navigate to project root (script is in scripts/ directory)
cd "$(dirname "$0")/.."

# Step 1: Get latest content changes
echo "[1/5] Pulling latest changes from git..."
git pull
echo "✓ Latest changes retrieved"
echo ""

# Step 2: Build the Astro site
echo "[2/5] Building Astro site..."
npm run build
echo "✓ Astro build complete"
echo ""

# Step 3: Build fresh Docker image
echo "[3/5] Building Docker image (this may take 1-2 minutes)..."
docker compose -f docker/docker-compose.yml build --no-cache manna
echo "✓ Docker image built"
echo ""

# Step 4: Deploy updated container
echo "[4/5] Deploying updated site..."
docker compose -f docker/docker-compose.yml up -d manna
echo "✓ Container deployed"
echo ""

# Step 5: Optional - Purge Cloudflare cache
# Uncomment the lines below to automatically purge Cloudflare cache after deployment
# You'll need to create an API token with "Cache Purge" permission
#
# echo "[5/5] Purging Cloudflare cache..."
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
#      -H "Authorization: Bearer YOUR_CF_API_TOKEN" \
#      -H "Content-Type: application/json" \
#      --data '{"purge_everything":true}'
# echo "✓ Cache purged"
# echo ""

echo "=========================================="
echo "  Rebuild complete!"
echo "=========================================="
echo ""
echo "Your updated site will be live in ~30 seconds."
echo "Visit: https://manna.voogt.co.za"
echo ""
