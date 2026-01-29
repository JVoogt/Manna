# Raspberry Pi Deployment - SUCCESS ✅

**Date:** 2026-01-29
**Server:** voogiepi@192.168.0.120 (dockpi)
**Domain:** https://manna.voogt.co.za
**Status:** ✅ **DEPLOYED AND OPERATIONAL**

---

## Deployment Summary

The Manna Kitchen website has been successfully deployed to the Raspberry Pi server at `~/docker/manna/` and is now accessible at **https://manna.voogt.co.za**.

### What Was Done

1. **SSH Connection** - Connected to voogiepi@192.168.0.120
2. **Directory Setup** - Created `~/docker/manna/` directory
3. **File Transfer** - Copied entire solution (excluding node_modules, .git, .claude, dist, .astro)
4. **Traefik Configuration** - Created docker-compose.prod.yml with Traefik labels
5. **Docker Build** - Built multi-stage Docker image (Node 20 → NGINX Alpine)
6. **Service Start** - Started manna-prod container with Traefik routing
7. **Verification** - Confirmed all services operational

---

## Deployment Details

### Container Information
```
Name: manna-prod
Image: manna_manna-prod:latest
Port: 8230 (internal) → 80 (NGINX)
Network: homeassistant_default (Traefik network)
Status: Running
```

### Traefik Configuration
```yaml
Domain: manna.voogt.co.za
HTTP → HTTPS: Automatic redirect (308 Permanent Redirect)
SSL/TLS: Let's Encrypt certificate (managed by Traefik)
Entry Points:
  - HTTP (web): Port 80
  - HTTPS (websecure): Port 443
```

### Build Information
```
Build Time: ~30 seconds (on Raspberry Pi)
Build Steps:
  1. Node 20 Alpine: npm ci (19s)
  2. Astro build: 8.67s
  3. NGINX Alpine: Copy static files
Image Size: Optimized multi-stage build
```

---

## Verification Results ✅

### All Pages Accessible (200 OK)
```
✓ / (Homepage)
✓ /about/ (About page)
✓ /contact/ (Contact page)
✓ /cart/ (Shopping cart)
✓ /checkout/ (Checkout form)
```

### HTTPS Working
```
✓ HTTP redirects to HTTPS (308 Permanent Redirect)
✓ HTTPS serves content (HTTP/2 200 OK)
✓ Let's Encrypt certificate active
✓ All assets loading correctly
```

### Existing Services Unaffected ✅
```
✓ transport.voogt.co.za - Still operational
✓ Kampi (dev) - Still running
✓ Slippi - Still running
✓ Workshop - Still running
✓ Traefik - Still routing all services
✓ 29 containers running (28 existing + 1 new)
```

---

## Access Information

### Public URL
**https://manna.voogt.co.za**

### Direct Port Access (Local Network)
**http://192.168.0.120:8230**

### Container Management
```bash
# SSH into server
ssh voogiepi@192.168.0.120

# Navigate to Manna directory
cd ~/docker/manna

# View logs
docker logs manna-prod
docker logs -f manna-prod  # Follow logs

# Restart container
docker-compose -f docker-compose.prod.yml restart

# Stop container
docker-compose -f docker-compose.prod.yml down

# Start container
docker-compose -f docker-compose.prod.yml up -d

# Rebuild after code changes
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## Files Deployed

### Location on Server
`/home/voogiepi/docker/manna/`

### Key Files
```
docker-compose.prod.yml  - Production Docker Compose with Traefik labels
Dockerfile              - Multi-stage build (Node → NGINX)
src/                    - Source code (Astro + React + TypeScript)
public/                 - Static assets
package.json            - Node dependencies
astro.config.mjs        - Astro configuration
```

### Excluded Files (Not Copied)
```
node_modules/  - Dependencies (installed during Docker build)
.git/          - Git repository
.claude/       - Claude Code files
dist/          - Build output (generated during Docker build)
.astro/        - Astro cache
```

---

## Traefik Routing Configuration

The site is configured with the following Traefik labels:

```yaml
# Enable Traefik
traefik.enable: true

# HTTP Router (for ACME challenge and redirect)
traefik.http.routers.manna-http.rule: Host(`manna.voogt.co.za`)
traefik.http.routers.manna-http.entrypoints: web
traefik.http.routers.manna-http.middlewares: manna-https-redirect

# HTTP → HTTPS Redirect
traefik.http.middlewares.manna-https-redirect.redirectscheme.scheme: https
traefik.http.middlewares.manna-https-redirect.redirectscheme.permanent: true

# HTTPS Router
traefik.http.routers.manna.rule: Host(`manna.voogt.co.za`)
traefik.http.routers.manna.entrypoints: websecure
traefik.http.routers.manna.tls: true
traefik.http.routers.manna.tls.certresolver: letsencrypt

# Service Configuration
traefik.http.services.manna.loadbalancer.server.port: 80
traefik.docker.network: homeassistant_default
```

---

## Container Health Check

```
Container: manna-prod
State: running
Running: true
Uptime: Active since deployment
Restart Policy: unless-stopped
```

---

## Network Configuration

### Connected Networks
```
1. homeassistant_default (Traefik network)
   - traefik
   - manna-prod
   - don-s-transport-prod-1
   - workshop-nginx-1
   - kampi-dev-nginx
   - mosquitto
   - deye-mqtt

2. manna_default (Bridge network)
   - manna-prod
```

---

## Performance Metrics

### Build Performance
```
Build Time: ~30 seconds
npm ci: 19 seconds
Astro build: 8.67 seconds
Docker image: <1 second
```

### Runtime Performance
```
First Load: <100ms (static files via NGINX)
HTTP/2: Enabled via Traefik
Gzip: Enabled
```

---

## Security

### SSL/TLS
```
✓ Let's Encrypt certificate (auto-renewed)
✓ HTTPS enforced (HTTP redirects)
✓ HTTP/2 enabled
✓ TLS 1.2+ required
```

### Container Security
```
✓ Multi-stage build (minimal production image)
✓ NGINX Alpine (lightweight, secure)
✓ No unnecessary services in container
✓ Isolated Docker network
```

---

## Maintenance

### Updating the Site

To deploy code changes:

```bash
# SSH into server
ssh voogiepi@192.168.0.120

# Navigate to manna directory
cd ~/docker/manna

# Pull latest code (if using git)
git pull

# Or copy updated files via rsync from dev machine:
# rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' \
#   ./ voogiepi@192.168.0.120:~/docker/manna/

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Verify
docker logs manna-prod
curl -sI https://manna.voogt.co.za
```

### Monitoring

```bash
# View real-time logs
docker logs -f manna-prod

# Check container status
docker ps | grep manna

# Check resource usage
docker stats manna-prod

# Check Traefik routing
docker logs traefik | grep manna
```

---

## Troubleshooting

### Site Not Accessible

1. **Check container is running:**
   ```bash
   docker ps | grep manna-prod
   ```

2. **Check logs for errors:**
   ```bash
   docker logs manna-prod
   ```

3. **Verify Traefik routing:**
   ```bash
   docker logs traefik | grep manna
   ```

4. **Test local port:**
   ```bash
   curl -I http://localhost:8230
   ```

### SSL Certificate Issues

1. **Check Traefik logs:**
   ```bash
   docker logs traefik | grep letsencrypt
   ```

2. **Verify certificate file:**
   ```bash
   ls -la ~/docker/homeAssistant/certs/acme.json
   ```

### Container Won't Start

1. **Check build logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Check for port conflicts:**
   ```bash
   docker ps | grep 8230
   ```

3. **Verify network exists:**
   ```bash
   docker network ls | grep homeassistant_default
   ```

---

## Rollback Plan

If issues arise:

```bash
cd ~/docker/manna
docker-compose -f docker-compose.prod.yml down
# Fix issues or revert code
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

---

## Next Steps

1. ✅ **Deployment Complete** - Site is live at https://manna.voogt.co.za
2. ⏳ **User Acceptance Testing** - Test all features on production
3. ⏳ **DNS Verification** - Ensure manna.voogt.co.za resolves correctly from external networks
4. ⏳ **Content Updates** - Add product images and final content
5. ⏳ **Monitoring Setup** - Configure alerts if needed

---

## Support

### Deployment Location
**Server:** voogiepi@192.168.0.120
**Directory:** ~/docker/manna/
**Container:** manna-prod
**Network:** homeassistant_default

### Key Contacts
- **Domain:** manna.voogt.co.za (via Traefik)
- **Direct Access:** http://192.168.0.120:8230
- **SSL:** Let's Encrypt (auto-managed by Traefik)

---

## Summary

✅ **Deployment Status:** SUCCESS
✅ **All Services:** Operational
✅ **HTTPS:** Working
✅ **Navigation:** All pages accessible
✅ **Existing Services:** Unaffected

The Manna Kitchen website is now live and ready for use!
