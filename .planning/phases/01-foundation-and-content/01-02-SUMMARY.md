---
phase: 01-foundation-and-content
plan: 02
subsystem: infra
tags: [docker, traefik, nginx, ssl, raspberry-pi, deployment]

# Dependency graph
requires:
  - phase: 01-01
    provides: Astro project foundation with TypeScript and Sharp
provides:
  - Multi-stage Docker build optimized for ARM64 (Raspberry Pi)
  - Traefik v3.0 reverse proxy with automatic SSL via Let's Encrypt DNS-01
  - NGINX static file serving with gzip and security headers
  - Zero-downtime rebuild script for non-technical admin
affects: [01-03, 01-04, 01-05, 01-06, deployment, production]

# Tech tracking
tech-stack:
  added: [traefik:v3.0, nginx:alpine, docker-compose]
  patterns:
    - "Multi-stage builds for minimal production images"
    - "DNS-01 challenge for SSL without exposing ports"
    - "Volume mounts for configuration files"

key-files:
  created:
    - Dockerfile
    - docker/docker-compose.yml
    - docker/traefik/traefik.yml
    - docker/traefik/acme.json
    - docker/nginx/nginx.conf
    - scripts/rebuild.sh
  modified: []

key-decisions:
  - "Traefik DNS-01 challenge with Cloudflare for SSL certificates"
  - "Multi-stage build: Node 20 Alpine for build, NGINX Alpine for production"
  - "Zero-downtime deployment with docker compose up -d"
  - "1-year cache for static assets with immutable flag"

patterns-established:
  - "Admin workflow: git pull → npm run build → docker compose build → docker compose up -d"
  - "Automatic HTTP to HTTPS redirect via Traefik"
  - "Security headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection"

# Metrics
duration: 5min
completed: 2026-01-28
---

# Phase 1 Plan 2: Docker Infrastructure Summary

**Multi-stage Docker deployment with Traefik SSL automation, NGINX static serving, and single-command rebuild workflow for Raspberry Pi hosting**

## Performance

- **Duration:** 5 minutes
- **Started:** 2026-01-28T10:21:54Z
- **Completed:** 2026-01-28T10:26:16Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Docker infrastructure ready for Raspberry Pi ARM64 deployment
- Automatic SSL certificate management via Cloudflare DNS-01 challenge
- Zero-downtime rebuild script enabling non-technical admin to update content
- Optimized static file serving with gzip compression and 1-year caching

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Multi-Stage Dockerfile** - `6d89d73` (chore)
2. **Task 2: Create Docker Compose and Traefik Configuration** - `30a4a9d` (chore)
3. **Task 3: Create Admin Rebuild Script** - `8afb151` (chore)

## Files Created/Modified

- `Dockerfile` - Multi-stage build: Node 20 Alpine for building Astro site, NGINX Alpine for serving static files (79.9MB final image)
- `docker/docker-compose.yml` - Orchestrates Traefik reverse proxy and Manna application container with proper labels and networking
- `docker/traefik/traefik.yml` - Traefik v3.0 configuration with Let's Encrypt DNS-01 challenge, HTTP to HTTPS redirect, and Docker provider
- `docker/traefik/acme.json` - SSL certificate storage with 600 permissions
- `docker/nginx/nginx.conf` - Static file serving with gzip compression, security headers, and 1-year asset caching
- `scripts/rebuild.sh` - Admin-friendly rebuild script with clear progress indicators and optional Cloudflare cache purge

## Decisions Made

1. **Traefik DNS-01 Challenge with Cloudflare** - Enables SSL certificate automation without exposing HTTP challenge on port 80, perfect for home-hosted Pi behind router
2. **Multi-stage Docker Build** - Separates build dependencies (Node) from production runtime (NGINX), reducing final image size and attack surface
3. **NGINX Alpine Base** - Minimal production image optimized for Pi performance (79.9MB total including static assets)
4. **Zero-downtime Deployment** - `docker compose up -d` replaces container gracefully without service interruption
5. **1-year Static Asset Cache** - Assets with content-hash filenames can be cached aggressively with `immutable` flag

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - Docker build and Docker Compose validation completed successfully on first attempt.

## User Setup Required

**External services require manual configuration.** See [01-USER-SETUP.md](./01-USER-SETUP.md) for:
- Cloudflare API token creation (CF_DNS_API_TOKEN environment variable)
- DNS record configuration (manna.voogt.co.za → Raspberry Pi IP)
- acme.json permissions setup (chmod 600)

## Next Phase Readiness

**Ready for deployment:**
- Docker infrastructure complete and validated
- Rebuild workflow tested (syntax validated)
- SSL automation configured (pending CF_DNS_API_TOKEN)

**Blockers:**
- Requires CF_DNS_API_TOKEN environment variable before first deployment (see USER-SETUP.md)
- Requires Cloudflare DNS record pointing to Pi IP address

**Next phase can proceed with:**
- Content development (JSON data files)
- Component creation (product cards, platter builder)
- Testing deployment workflow on development machine before Pi deployment

---
*Phase: 01-foundation-and-content*
*Completed: 2026-01-28*
