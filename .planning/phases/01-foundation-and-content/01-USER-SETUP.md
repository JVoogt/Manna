# Phase 01 - User Setup Guide

**Required:** External service configuration for Docker deployment

---

## Cloudflare Setup

### 1. Create API Token for SSL Certificates

Traefik needs a Cloudflare API token to automatically manage SSL certificates via DNS-01 challenge.

**Steps:**

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to: **My Profile → API Tokens → Create Token**
3. Use template: **"Edit zone DNS"**
4. Configure permissions:
   - **Zone - DNS - Edit**
   - **Zone Resources:** Include → Specific zone → `voogt.co.za`
5. Click **"Continue to summary"** → **"Create Token"**
6. **Copy the token** (shown only once!)

**Add to environment:**

Create `/home/jpvoogt/Documents/_Code/Manna/docker/.env` file:

```bash
CF_DNS_API_TOKEN=your_token_here
```

**Verify token works:**

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones" \
     -H "Authorization: Bearer your_token_here" \
     -H "Content-Type: application/json"
```

Expected: JSON response with zone list (should include voogt.co.za)

---

### 2. Configure DNS Record

Point `manna.voogt.co.za` to your Raspberry Pi IP address.

**Steps:**

1. Navigate to: **Cloudflare Dashboard → DNS → Records**
2. Add A record:
   - **Type:** A
   - **Name:** manna
   - **IPv4 address:** [Your Raspberry Pi IP]
   - **Proxy status:** DNS only (grey cloud) ← IMPORTANT
   - **TTL:** Auto
3. Click **Save**

**Why "DNS only"?**
Traefik manages SSL directly. Cloudflare proxy would interfere with Let's Encrypt certificate validation.

**Verify DNS propagation:**

```bash
dig manna.voogt.co.za +short
```

Expected: Your Raspberry Pi IP address

---

### 3. Set acme.json Permissions

Let's Encrypt certificate storage requires specific permissions.

**Steps:**

```bash
chmod 600 docker/traefik/acme.json
```

**Verify:**

```bash
ls -la docker/traefik/acme.json
```

Expected: `-rw------- 1 user user 163 Jan 28 12:22 docker/traefik/acme.json`

---

## Verification Checklist

Before first deployment:

- [ ] CF_DNS_API_TOKEN set in `docker/.env`
- [ ] Cloudflare API token verified via curl test
- [ ] DNS A record for manna.voogt.co.za points to Pi IP
- [ ] DNS propagation complete (dig returns correct IP)
- [ ] acme.json has 600 permissions
- [ ] Raspberry Pi port 80 and 443 accessible from internet

---

## First Deployment

Once setup complete:

```bash
cd /home/jpvoogt/Documents/_Code/Manna
docker compose -f docker/docker-compose.yml up -d
```

**Expected behavior:**
1. Traefik starts and requests SSL certificate via Cloudflare DNS-01
2. Certificate obtained in ~30 seconds
3. Site accessible at https://manna.voogt.co.za
4. HTTP requests automatically redirect to HTTPS

**Troubleshooting:**

Check Traefik logs:
```bash
docker compose -f docker/docker-compose.yml logs traefik
```

Check Manna logs:
```bash
docker compose -f docker/docker-compose.yml logs manna
```

---

**Questions?** See Docker Compose configuration: `docker/docker-compose.yml`
