#!/bin/bash
# Raspberry Pi Deployment Guide
# Quick deployment script for Manna Kitchen website

set -e  # Exit on any error

echo "======================================"
echo "Manna Kitchen - Raspberry Pi Deployment"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pre-deployment checks
echo -e "${YELLOW}Step 1: Pre-deployment checks${NC}"
echo ""

echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}ERROR: Docker is not installed${NC}"
    echo "Install Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi
echo -e "${GREEN}✓ Docker installed${NC}"

echo "Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}ERROR: Docker Compose is not installed${NC}"
    echo "Install Docker Compose: sudo apt-get install docker-compose"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose installed${NC}"

echo "Checking git installation..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}ERROR: Git is not installed${NC}"
    echo "Install Git: sudo apt-get install git"
    exit 1
fi
echo -e "${GREEN}✓ Git installed${NC}"

echo ""
echo -e "${GREEN}All prerequisites met!${NC}"
echo ""

# Step 2: Clone or update repository
echo -e "${YELLOW}Step 2: Repository setup${NC}"
echo ""

if [ -d "Manna" ]; then
    echo "Manna directory exists. Updating..."
    cd Manna
    git pull
else
    echo "Cloning repository..."
    echo "Enter repository URL:"
    read REPO_URL
    git clone "$REPO_URL" Manna
    cd Manna
fi

echo -e "${GREEN}✓ Repository ready${NC}"
echo ""

# Step 3: Build Docker image
echo -e "${YELLOW}Step 3: Building Docker image${NC}"
echo ""
echo "This may take a few minutes on Raspberry Pi..."
echo ""

docker-compose -f docker-compose.prod.yml build

echo ""
echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

# Step 4: Start container
echo -e "${YELLOW}Step 4: Starting container${NC}"
echo ""

# Stop and remove existing container if it exists
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Start new container
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}✓ Container started${NC}"
echo ""

# Step 5: Wait for container to be ready
echo -e "${YELLOW}Step 5: Waiting for service to start...${NC}"
sleep 5

# Step 6: Verify deployment
echo -e "${YELLOW}Step 6: Verifying deployment${NC}"
echo ""

echo "Testing homepage..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Homepage responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Homepage not responding (HTTP $HTTP_CODE)${NC}"
    echo "Check logs: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "Testing all pages..."
PAGES=("about" "contact" "cart" "checkout")
ALL_OK=true

for page in "${PAGES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/$page/)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ /$page/ responding (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}✗ /$page/ not responding (HTTP $HTTP_CODE)${NC}"
        ALL_OK=false
    fi
done

echo ""
if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}======================================"
    echo "✓ Deployment successful!"
    echo "======================================${NC}"
    echo ""
    echo "Your site is now running at:"
    echo "  Local:  http://localhost/"
    echo ""
    echo "Next steps:"
    echo "  1. Open browser and navigate to http://localhost/"
    echo "  2. Complete manual tests in docs/manual-test-script.md"
    echo "  3. Configure production domain (if needed)"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker-compose -f docker-compose.prod.yml logs -f"
    echo "  Stop site:    docker-compose -f docker-compose.prod.yml down"
    echo "  Restart site: docker-compose -f docker-compose.prod.yml restart"
    echo "  Update site:  git pull && docker-compose -f docker-compose.prod.yml up -d --build"
    echo ""
else
    echo -e "${RED}======================================"
    echo "✗ Deployment completed with errors"
    echo "======================================${NC}"
    echo ""
    echo "Check logs for details:"
    echo "  docker-compose -f docker-compose.prod.yml logs"
    echo ""
    exit 1
fi
