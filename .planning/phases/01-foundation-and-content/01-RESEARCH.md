# Phase 1: Foundation & Content - Research

**Researched:** 2026-01-28
**Domain:** Static site deployment on Raspberry Pi with Astro, Docker, Traefik, and external image hosting
**Confidence:** HIGH

## Summary

Phase 1 deploys a static Astro site on Raspberry Pi 4 using Docker with Traefik reverse proxy for SSL, Cloudflare DNS for public access, and Cloudflare R2 for external image hosting. The research validates this stack as production-ready for the requirements (20+ concurrent users, <3s mobile image load times).

**Key findings:**
- Astro 5.0 (2026) delivers excellent static site performance with built-in Sharp image optimization, automatic responsive images, and minimal JavaScript by default
- Raspberry Pi 4 can serve static sites to 20+ concurrent users when using NGINX (2.5x faster than Apache for static content), SSD storage (not SD card), and Cloudflare CDN caching
- Cloudflare R2 provides 98-99% cost savings vs S3 for image hosting due to zero egress fees ($15/month vs $1,723/month for 1TB storage + 20TB bandwidth)
- Traefik with Let's Encrypt DNS-01 challenge via Cloudflare enables automatic SSL certificate management in Docker environments
- Multi-platform Docker builds (ARM64 for Pi, AMD64 for dev) are straightforward with buildx

**Primary recommendation:** Use NGINX (not Apache) to serve the static Astro build, Cloudflare R2 for images with zero egress costs, aggressive Cloudflare CDN caching to offload Pi bandwidth, and Zod for JSON schema validation (better DX than Ajv for this use case).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.0+ | Static site framework | Industry standard for content-focused static sites, zero-JS by default, built-in Sharp image optimization |
| Docker | 24.0+ | Containerization | Universal deployment standard, ARM64 support, isolation |
| Traefik | v3.0+ | Reverse proxy & SSL | Docker-native, automatic Let's Encrypt, dynamic configuration |
| NGINX | 1.25+ (alpine) | Static file server | 2.5x faster than Apache for static content, 5-6% less memory, event-driven architecture |
| Sharp | 0.33+ | Image processing | Fastest Node.js image processor (4-5x faster than ImageMagick), libvips-based |
| Cloudflare R2 | Current | Object storage | Zero egress fees (98-99% cheaper than S3 for bandwidth-heavy workloads) |
| Cloudflare DNS | Current | DNS + CDN | Global CDN caching offloads Pi, free SSL, DDoS protection |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 3.23+ | Schema validation | TypeScript-first validation for JSON content files, automatic type inference |
| Docker Buildx | 0.12+ | Multi-platform builds | Build ARM64 images on AMD64 dev machines, cross-compilation |
| Node.js | 20.3.0+ LTS | Build environment | Astro build process, Sharp requires Node-API v9 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Cloudflare R2 | AWS S3 | S3 has better AWS ecosystem integration but 98% more expensive for image delivery workloads |
| NGINX | Apache | Apache more familiar but 2.5x slower for static files, higher memory usage on Pi |
| Zod | Ajv | Ajv 5-18x faster but worse DX; for <1000 validations/sec Zod's performance is acceptable |
| Traefik | Caddy | Caddy simpler config but Traefik more Docker-native, better label-based routing |

**Installation:**
```bash
# Project setup
npm create astro@latest
npm install zod sharp

# Image optimization script dependencies
npm install @aws-sdk/client-s3 sharp
```

## Architecture Patterns

### Recommended Project Structure
```
/
├── .planning/                 # GSD planning artifacts (gitignored)
├── docker/
│   ├── docker-compose.yml     # Traefik + Astro service definitions
│   ├── traefik/
│   │   ├── traefik.yml        # Static Traefik config
│   │   └── acme.json          # Let's Encrypt certificates (600 perms)
│   └── nginx/
│       └── nginx.conf         # Static file serving config
├── scripts/
│   └── optimize-images.js     # Upload to R2 with Sharp processing
├── src/
│   ├── content/
│   │   ├── products.json      # Product catalog
│   │   └── meals.json         # Weekly meals
│   ├── schemas/
│   │   ├── product.schema.ts  # Zod schema for products
│   │   └── meal.schema.ts     # Zod schema for meals
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # Sisters' story
│   │   └── contact.astro      # Location, WhatsApp, contact form
│   ├── components/            # Astro components
│   └── layouts/               # Page layouts
├── public/                    # Static assets (NOT images - use R2)
├── astro.config.mjs           # Astro configuration
├── Dockerfile                 # Multi-stage build
└── .dockerignore              # Exclude node_modules, .git
```

### Pattern 1: Multi-Stage Docker Build for Astro
**What:** Separate dependency installation from source changes to optimize rebuild times
**When to use:** Always for production Astro deployments
**Example:**
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```
**Source:** [Astro Docker Documentation](https://docs.astro.build/en/recipes/docker/)

### Pattern 2: Traefik with Let's Encrypt DNS-01 Challenge
**What:** Automatic SSL certificate management using Cloudflare DNS validation
**When to use:** When domain is managed by Cloudflare (this project)
**Example:**
```yaml
# docker-compose.yml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--certificatesresolvers.letsencrypt.acme.dnschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.dnschallenge.provider=cloudflare"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@example.com"
    environment:
      - CF_DNS_API_TOKEN=${CF_DNS_API_TOKEN}
    labels:
      - "traefik.http.routers.astro.tls.certresolver=letsencrypt"
```
**Source:** [Traefik Let's Encrypt DNS Challenge Guide](https://doc.traefik.io/traefik/user-guides/docker-compose/acme-dns/)

### Pattern 3: Zod Schema Validation for JSON Content
**What:** Type-safe JSON schema validation with automatic TypeScript types
**When to use:** For products.json and meals.json validation
**Example:**
```typescript
// src/schemas/product.schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  dietary: z.array(z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free'])),
  allergens: z.array(z.string())
});

export const productsSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;

// Usage
import productsData from '../content/products.json';
const products = productsSchema.parse(productsData);
```
**Source:** [Zod Documentation](https://zod.dev/)

### Pattern 4: Sharp Image Optimization Script
**What:** Batch process images to WebP/JPEG, multiple sizes, upload to R2
**When to use:** Admin uploads new product/meal images
**Example:**
```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const sizes = { thumbnail: 320, medium: 640, full: 1024 };
const formats = ['webp', 'jpeg'];

async function processImage(inputPath, outputName) {
  for (const [sizeName, width] of Object.entries(sizes)) {
    for (const format of formats) {
      const buffer = await sharp(inputPath)
        .resize(width)
        [format]({ quality: format === 'webp' ? 80 : 85 })
        .toBuffer();

      await uploadToR2(`${outputName}-${sizeName}.${format}`, buffer);
    }
  }
}
```
**Quality settings:** WebP 80, JPEG 85 provides 60% size reduction vs original with imperceptible quality loss
**Source:** [Sharp Documentation](https://sharp.pixelplumbing.com/)

### Pattern 5: Astro Responsive Images from R2
**What:** Use Astro's Picture component with external R2 URLs
**When to use:** All product and meal images
**Example:**
```astro
---
import { Picture } from 'astro:assets';
const baseUrl = 'https://r2-bucket.account.r2.cloudflarestorage.com';
const imageName = 'product-123';
---

<picture>
  <source
    type="image/webp"
    srcset={`
      ${baseUrl}/${imageName}-thumbnail.webp 320w,
      ${baseUrl}/${imageName}-medium.webp 640w,
      ${baseUrl}/${imageName}-full.webp 1024w
    `}
    sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px"
  />
  <img
    src={`${baseUrl}/${imageName}-medium.jpeg`}
    srcset={`
      ${baseUrl}/${imageName}-thumbnail.jpeg 320w,
      ${baseUrl}/${imageName}-medium.jpeg 640w,
      ${baseUrl}/${imageName}-full.jpeg 1024w
    `}
    sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px"
    alt="Product description"
    loading="lazy"
  />
</picture>
```
**Note:** For external images, manual srcset required; Astro's automatic optimization only works for local images
**Source:** [Astro Images Guide](https://docs.astro.build/en/guides/images/)

### Pattern 6: Cloudflare CDN Caching for Pi Performance
**What:** Aggressive CDN caching to minimize Pi bandwidth and latency
**When to use:** All static assets and HTML pages
**Configuration:**
```
Cloudflare Page Rules:
1. manna.voogt.co.za/* - Cache Level: Cache Everything, Edge Cache TTL: 1 week
2. SSL/TLS mode: Full (strict)
3. Proxy status: Proxied (orange cloud) for A record
```
**Why:** Cloudflare edges serve 95%+ of requests, Pi only handles cache misses and rebuilds
**Source:** [Cloudflare Caching Documentation](https://developers.cloudflare.com/cache/)

### Anti-Patterns to Avoid
- **Don't store images in Git:** Large binary files slow down clones and bloat repository. Use R2 with Git-tracked JSON metadata.
- **Don't use SD card for Docker volumes:** SD cards are too slow for container I/O. Use external SSD via USB 3.0.
- **Don't skip .dockerignore:** Sending node_modules to Docker context adds 30+ seconds to builds.
- **Don't build multi-platform with --load:** Multi-platform images must be pushed to registry; --load only works for single platform.
- **Don't use HTTP challenge with Cloudflare proxy:** Cloudflare proxying breaks HTTP-01 challenge; use DNS-01 instead.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom ImageMagick wrapper | Sharp | Sharp is 4-5x faster, handles format conversion, resizing, quality optimization with single API |
| Responsive image srcset | Manual HTML generation | Astro Picture component (for local) or standardized template | Automatic width calculation, format fallbacks, lazy loading attributes |
| JSON schema validation | Manual checks with if/else | Zod | Type inference eliminates manual TypeScript types, runtime validation prevents bad data |
| SSL certificate renewal | Cron job with certbot | Traefik with Let's Encrypt | Automatic renewal, DNS challenge support, Docker label-based config |
| Multi-platform Docker builds | Manual builds per arch | Docker buildx | Single command builds both ARM64 and AMD64, pushes manifest list |
| CDN configuration | Manual CloudFront setup | Cloudflare CDN | Zero-config CDN when using Cloudflare DNS, free SSL, simpler caching rules |

**Key insight:** Astro, Sharp, and Traefik have already solved the hard edge cases (image format detection, SSL renewal, responsive breakpoints). Custom solutions will miss these cases and create maintenance burden.

## Common Pitfalls

### Pitfall 1: Raspberry Pi Storage Performance Bottleneck
**What goes wrong:** Using SD card for Docker volumes causes unbearable slowness (<10 MB/s read speeds)
**Why it happens:** SD cards are optimized for sequential writes (photos), not random I/O (databases, containers)
**How to avoid:**
- Boot from SD card but mount Docker data directory on external SSD via USB 3.0
- Configure in `/etc/docker/daemon.json`: `{"data-root": "/mnt/ssd/docker"}`
**Warning signs:** Docker commands hang, container startups take >30 seconds, `docker build` takes 5+ minutes

### Pitfall 2: Cloudflare Proxy Breaking Let's Encrypt HTTP Challenge
**What goes wrong:** Let's Encrypt HTTP-01 challenge fails with Cloudflare orange-cloud (proxied) enabled
**Why it happens:** Cloudflare's proxy intercepts the `.well-known/acme-challenge` requests before they reach origin
**How to avoid:**
- Use DNS-01 challenge instead (Traefik with `dnschallenge.provider=cloudflare`)
- Never use HTTP-01 challenge with Cloudflare proxying enabled
**Warning signs:** `acme: error: 403` during certificate request, Traefik logs show "challenge validation failed"

### Pitfall 3: Multi-Platform Docker Build Without Registry Push
**What goes wrong:** `docker buildx build --platform linux/amd64,linux/arm64 --load` fails with "multi-platform is not supported"
**Why it happens:** Docker daemon can only load images for current platform; multi-platform manifests require registry storage
**How to avoid:**
- Use `--push` to push to registry: `docker buildx build --platform linux/amd64,linux/arm64 -t registry/image --push .`
- For local testing, build single platform: `docker buildx build --platform linux/arm64 --load -t image .`
**Warning signs:** Error message "ERROR: multi-platform images cannot be loaded"

### Pitfall 4: Forgetting CORS Headers for R2 Images
**What goes wrong:** Product images fail to load or throw CORS errors in browser console
**Why it happens:** R2 bucket doesn't allow cross-origin requests by default
**How to avoid:**
- Configure R2 bucket CORS policy to allow GET from `https://manna.voogt.co.za`
- Set `Access-Control-Allow-Origin: *` for public images
**Warning signs:** Browser console shows "CORS policy: No 'Access-Control-Allow-Origin' header", images don't display

### Pitfall 5: Static Build Not Reflecting JSON Changes
**What goes wrong:** Admin updates products.json but changes don't appear on site
**Why it happens:** Astro static builds embed JSON at build time; runtime changes don't propagate
**How to avoid:**
- Document rebuild workflow: SSH to Pi, `cd /app && npm run build && docker-compose restart`
- Consider build script: `#!/bin/bash\nnpm run build\ndocker-compose up -d --force-recreate`
**Warning signs:** Admin reports "I changed the file but website still shows old data"

### Pitfall 6: DEBUG=true in Production Dockerfile
**What goes wrong:** Detailed error messages expose internal paths, dependencies, environment variables
**Why it happens:** Copy-paste from development Dockerfile without adjusting environment
**How to avoid:**
- Set `NODE_ENV=production` in Dockerfile
- Never set `DEBUG=true`, `VERBOSE=true`, or similar flags in production builds
- Use separate `.env.production` file
**Warning signs:** Error pages show stack traces with `/app/src/` paths, dependency versions

### Pitfall 7: Insufficient Cloudflare Cache TTL
**What goes wrong:** Pi serves every request, bandwidth and CPU spike, site slows down
**Why it happens:** Default Cloudflare cache TTL is 2 hours for static content; Pi handles too many cache misses
**How to avoid:**
- Set Edge Cache TTL to 1 week for static assets
- Use "Cache Everything" page rule for all URLs
- Purge cache manually after rebuilds: `curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache"`
**Warning signs:** Pi CPU >80%, htop shows nginx using significant CPU, Pi network traffic high

## Code Examples

Verified patterns from official sources:

### Docker Compose for Traefik + Astro
```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./traefik/acme.json:/acme.json
    environment:
      - CF_DNS_API_TOKEN=${CF_DNS_API_TOKEN}
    networks:
      - web

  astro:
    build:
      context: ..
      dockerfile: Dockerfile
      platforms:
        - linux/arm64
    container_name: manna-astro
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.astro.rule=Host(`manna.voogt.co.za`)"
      - "traefik.http.routers.astro.entrypoints=websecure"
      - "traefik.http.routers.astro.tls.certresolver=letsencrypt"
      - "traefik.http.services.astro.loadbalancer.server.port=80"
    networks:
      - web

networks:
  web:
    external: false
```
**Source:** Synthesized from [Traefik Docker documentation](https://doc.traefik.io/traefik/) and [Astro Docker recipe](https://docs.astro.build/en/recipes/docker/)

### Traefik Static Configuration
```yaml
# docker/traefik/traefik.yml
api:
  dashboard: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: jpvoogt@gmail.com
      storage: /acme.json
      dnsChallenge:
        provider: cloudflare
        delayBeforeCheck: 10s
```
**Source:** [Traefik ACME DNS Challenge Guide](https://doc.traefik.io/traefik/user-guides/docker-compose/acme-dns/)

### NGINX Configuration for Static Files
```nginx
# docker/nginx/nginx.conf
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
  gzip_min_length 1000;

  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
  }
}
```
**Source:** [NGINX documentation](https://nginx.org/en/docs/) best practices

### Astro Config for Production
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://manna.voogt.co.za',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Sharp is default, explicitly configured for clarity
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    // External R2 images don't need optimization at build time
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com'
      }
    ]
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'esbuild'
    }
  }
});
```
**Source:** [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)

### JSON Schema Validation in Astro Page
```astro
---
// src/pages/index.astro
import { productsSchema } from '../schemas/product.schema';
import productsData from '../content/products.json';

// Validate at build time - build fails if schema invalid
const products = productsSchema.parse(productsData);
---

<html>
  <body>
    <h1>Products</h1>
    <ul>
      {products.map(product => (
        <li>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>R{product.price.toFixed(2)}</p>
        </li>
      ))}
    </ul>
  </body>
</html>
```
**Source:** [Zod documentation](https://zod.dev/) integrated with Astro

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Astro 3.x | Astro 5.0 | January 2025 | Server Islands for deferred rendering, unified output modes, 5x faster Markdown builds, type-safe environment variables |
| Docker build per platform | Docker buildx multi-platform | 2021 (stable 2023) | Single command for ARM64+AMD64, manifest lists, eliminates manual per-arch builds |
| AWS S3 egress fees | Cloudflare R2 zero egress | 2022 (R2 GA) | 98-99% cost reduction for bandwidth-heavy workloads like image hosting |
| Manual Let's Encrypt certbot cron | Traefik automatic renewal | Traefik v2 (2019) | Zero-touch SSL management, DNS challenge support, container-native |
| Sharp v0.32 | Sharp v0.33 | 2024 | AVIF support, faster ARM64 performance, Node-API v9 requirement |
| Zod v3.22 | Zod v3.23+ | 2024 | Improved error messages, better performance, pipe() method for transforms |

**Deprecated/outdated:**
- **Squoosh for image optimization:** Unmaintained since 2023, Sharp is faster and actively developed
- **Let's Encrypt HTTP-01 challenge with Cloudflare proxy:** Always fails; DNS-01 is the only viable option
- **Apache for static file serving on Pi:** NGINX is 2.5x faster with lower memory footprint
- **Astro Image component for external URLs:** Works but requires manual srcset for R2; better to use template pattern

## Open Questions

Things that couldn't be fully resolved:

1. **Raspberry Pi 4 vs Pi 5 performance for 20+ concurrent users**
   - What we know: Pi 4 with 4GB RAM + SSD + NGINX + Cloudflare CDN handles static sites well per community reports
   - What's unclear: Exact concurrent user limit before degradation (likely 50-100 with CDN, 10-20 without)
   - Recommendation: Start with Pi 4 (cheaper, validated), monitor with htop during peak traffic, upgrade to Pi 5 if CPU >90% sustained

2. **Optimal Cloudflare cache purge strategy after rebuild**
   - What we know: Manual purge via API works, Cloudflare supports tag-based purging
   - What's unclear: Whether to purge all cache or use cache versioning in URLs (e.g., `?v=timestamp`)
   - Recommendation: Start with full cache purge after rebuild (`purge_everything: true`), migrate to versioned URLs if rebuild frequency increases

3. **Best JSON editor for non-technical admin**
   - What we know: Many GUI options exist (JSON Editor Online, Visual JSON Editor, JSONedit)
   - What's unclear: Which provides best balance of simplicity and validation feedback for products/meals schema
   - Recommendation: Test Visual JSON Editor (auto-generates GUI from schema) and JSON Editor Online (tree view); admin should pick preferred

4. **R2 bucket access strategy: public vs signed URLs**
   - What we know: R2 supports both public buckets and temporary signed URLs
   - What's unclear: Security implications for public product images (no PII or sensitive content)
   - Recommendation: Use public R2 bucket with custom domain (`images.manna.voogt.co.za`) for simplicity; all product images are meant to be public

## Sources

### Primary (HIGH confidence)
- [Astro Documentation - Images](https://docs.astro.build/en/guides/images/) - Official guide for image optimization, verified 2026-01-28
- [Astro Documentation - Docker](https://docs.astro.build/en/recipes/docker/) - Official Docker deployment recipe, verified 2026-01-28
- [Traefik Documentation - ACME DNS Challenge](https://doc.traefik.io/traefik/user-guides/docker-compose/acme-dns/) - Official guide for Let's Encrypt with DNS-01
- [Docker Documentation - Multi-platform builds](https://docs.docker.com/build/building/multi-platform/) - Official buildx guide
- [Sharp Documentation](https://sharp.pixelplumbing.com/) - Official image processing library docs
- [Zod Documentation](https://zod.dev/) - Official TypeScript schema validation docs
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/) - Official object storage docs
- [Cloudflare Cache Documentation](https://developers.cloudflare.com/cache/) - Official CDN caching guide

### Secondary (MEDIUM confidence)
- [Cloudflare R2 vs AWS S3 Comparison (Vantage)](https://www.vantage.sh/blog/cloudflare-r2-aws-s3-comparison) - Third-party cost analysis, verified with official pricing
- [NGINX vs Apache Performance (Linuxiac)](https://linuxiac.com/apache-vs-nginx/) - Community benchmarks, consistent with multiple sources
- [Astro Content Collections Guide (2026)](https://inhaq.com/blog/getting-started-with-astro-content-collections/) - Community guide verified against official docs
- [Raspberry Pi Web Server Benchmark](https://www.jeremymorgan.com/tutorials/raspberry-pi/raspberry-pi-web-server-comparison/) - Independent testing, Pi 3/4 generation
- [Docker Buildx Multi-Architecture Guide (OneUpTime)](https://oneuptime.com/blog/post/2026-01-06-docker-multi-architecture-images/view) - Recent guide (Jan 2026)

### Tertiary (LOW confidence)
- Various Stack Overflow, Reddit, and Raspberry Pi forum discussions - Used for validation only, not as primary source
- WebSearch results for "best practices" queries - Cross-referenced with official documentation before including

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools have official documentation, widespread production use, and clear installation paths
- Architecture: HIGH - Docker multi-stage builds, Traefik with Let's Encrypt, and NGINX static serving are industry-standard patterns with official examples
- Pitfalls: HIGH - Common issues (SD card performance, Cloudflare HTTP challenge, multi-platform builds) are well-documented in official sources and community reports
- Image optimization: HIGH - Sharp quality settings and responsive image patterns verified in official Astro and Sharp documentation
- Cost estimates: MEDIUM - Cloudflare R2 pricing verified from official calculator, S3 comparison from third-party but consistent with AWS pricing
- Pi performance limits: MEDIUM - Community reports consistent but exact concurrent user limits depend on content size and caching strategy
- JSON editor recommendation: LOW - No hands-on testing of GUI tools, recommendation based on feature descriptions

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (30 days - stable technologies, Astro 5.0 recently released)

**Research notes:**
- Astro 5.0 released very recently (January 2025), so documentation is current and relevant
- Docker, Traefik, and NGINX are mature stable technologies with slow release cycles
- Sharp and Zod are actively maintained with frequent releases; revalidate in 30 days
- Cloudflare R2 pricing and features stable since GA in 2022
- Raspberry Pi 4 is end-of-life approaching but still widely deployed; Pi 5 migration path exists if needed
