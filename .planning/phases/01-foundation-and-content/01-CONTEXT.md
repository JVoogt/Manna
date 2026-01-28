# Phase 1: Foundation & Content - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Deploy a static Astro site on Raspberry Pi with JSON-based content management for products and meals, plus About and Contact information pages. The site must handle 20+ concurrent users with fast mobile image loading.

This phase delivers the infrastructure and content system that all future ordering features will build on.

</domain>

<decisions>
## Implementation Decisions

### Content editing workflow
- JSON files (products.json, meals.json) live in Git repository - version controlled
- Manual rebuild process: Admin SSHs into Pi and runs rebuild script/command
- No staging environment - rebuilds go straight to production
- Admin can edit JSON files using their preferred method (exact editing interface at Claude's discretion)

### Image management & optimization
- Product/meal images stored on external service (Cloudflare R2 or S3) - offloads Pi bandwidth
- Automated upload script handles optimization when admin runs it
- Script produces WebP format with JPEG fallback for browser compatibility
- Multiple sizes generated (thumbnail, medium, full) for responsive loading
- Images use native browser lazy loading (loading="lazy" attribute)

### Static page structure
- Separate pages: /about and /contact (not combined)
- About page emphasizes the sisters' personal story - who they are, why they started, their passion
- Contact page includes:
  - WhatsApp number (+27825795210) as primary contact
  - Physical location/address for pickup
  - Contact form for web inquiries
  - No operating hours displayed
- Pages are text-focused, clean and simple on mobile - fast loading, content-first approach
- Visual design within rustic South African aesthetic

### Claude's Discretion
- Pi performance strategy (caching, CDN usage, build vs runtime tradeoffs)
- Specific JSON editing interface/tool recommendation for admin
- Exact image optimization parameters (compression levels, resize dimensions)
- Typography, spacing, and micro-interactions on static pages
- Error handling and validation for JSON content

</decisions>

<specifics>
## Specific Ideas

- External image storage chosen specifically to avoid putting bandwidth load on the Raspberry Pi
- Manual rebuild workflow preferred over automation - admin maintains control
- Personal story on About page builds emotional connection with customers
- No operating hours on Contact page suggests flexible/appointment-based service

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-and-content*
*Context gathered: 2026-01-28*
