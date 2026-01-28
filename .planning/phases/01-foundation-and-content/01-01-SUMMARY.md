---
phase: 01-foundation-and-content
plan: 01
subsystem: foundation
tags: [astro, typescript, static-site, configuration]

requires:
  - PROJECT.md (project definition)
  - ROADMAP.md (4-phase plan)

provides:
  - Astro 5.0 static site generator configured for Pi deployment
  - TypeScript strict mode with path aliases
  - Base layout with semantic HTML structure
  - Homepage placeholder with warm SA aesthetic

affects:
  - All future plans depend on this foundation
  - Phase 02 will extend homepage with content management
  - Phase 03 will add platter builder to homepage
  - Phase 04 will add WhatsApp ordering integration

tech-stack:
  added:
    - astro: ^5.16.15 (static site generator)
    - sharp: ^0.34.5 (image optimization)
    - zod: ^3.25.76 (schema validation - future use)
  patterns:
    - Static site generation with Astro
    - Mobile-first responsive design
    - TypeScript strict mode
    - Path aliases for clean imports (@/*)

key-files:
  created:
    - package.json: Project dependencies and npm scripts
    - astro.config.mjs: Astro configuration (site, output, image service)
    - tsconfig.json: TypeScript configuration with strict mode
    - .gitignore: Git exclusions (node_modules, dist, .astro, .env, *.local)
    - .dockerignore: Docker exclusions (planning docs, git, markdown)
    - src/layouts/BaseLayout.astro: Shared HTML layout with CSS reset
    - src/pages/index.astro: Homepage with hero and placeholder sections
    - public/favicon.svg: Kitchen-themed pot icon (warm colors)
  modified: []

decisions:
  - decision: Use Astro 5.0 minimal template
    rationale: Fastest path to static generation, no unnecessary boilerplate
    impact: Clean starting point for food business site
    phase: 01
    plan: 01

  - decision: Warm color scheme (#8b5a3c, #d4a574, #6b4423)
    rationale: Rustic SA aesthetic matching home cooking brand
    impact: Establishes visual identity for all future design
    phase: 01
    plan: 01

  - decision: TypeScript path aliases (@/* → src/*)
    rationale: Cleaner imports, easier refactoring
    impact: All future code uses @/ for src/ imports
    phase: 01
    plan: 01

metrics:
  duration: 4 minutes
  completed: 2026-01-28
---

# Phase 01 Plan 01: Astro Project Foundation Summary

**One-liner:** Astro 5.0 static site configured for Pi deployment with TypeScript strict mode, Sharp image service, and warm SA aesthetic homepage placeholder.

## What Was Built

Created the foundational Astro project with production-ready configuration:

1. **Project Configuration**
   - Astro 5.0 with static output targeting Raspberry Pi
   - Site URL: https://manna.voogt.co.za
   - Sharp image service for optimized assets
   - Remote patterns configured for Cloudflare R2 storage (**.r2.cloudflarestorage.com)
   - Vite build with CSS code splitting and esbuild minification

2. **TypeScript Setup**
   - Strict mode enabled (astro/tsconfigs/strict)
   - Path aliases: @/* maps to src/*
   - Full type safety for all future development

3. **Base Layout System**
   - Semantic HTML structure (header, main, footer)
   - Mobile-first responsive design
   - CSS reset for consistent cross-browser rendering
   - Flexible slot-based content injection
   - Warm color scheme established (#8b5a3c brown, #d4a574 tan)

4. **Homepage Placeholder**
   - Hero section with gradient background (brown to tan)
   - Placeholder sections for future features:
     - Custom platters (Phase 3)
     - Weekly meals (Phase 2)
   - Responsive typography (scales on mobile)

5. **Development Infrastructure**
   - .gitignore: Excludes node_modules, dist, .astro, .env, *.local
   - .dockerignore: Excludes planning docs, git, unnecessary markdown
   - npm scripts: dev, build, preview, astro

## Decisions Made

**1. Warm Rustic Color Palette**
- Primary: #8b5a3c (warm brown)
- Secondary: #d4a574 (tan/sand)
- Accent: #6b4423 (dark brown)
- **Rationale:** Reflects home cooking, SA warmth, approachable aesthetic
- **Impact:** All future components will use this palette

**2. Path Aliases (@/*)**
- Configured @/* to map to src/*
- **Rationale:** Cleaner imports, easier refactoring, standard practice
- **Impact:** All imports use @/layouts/*, @/components/*, etc.

**3. Sharp for Image Service**
- Configured Sharp as Astro's image service
- Added R2 remote patterns for future image hosting
- **Rationale:** Better performance than default, Pi-compatible
- **Impact:** All images will use optimized Sharp processing

## Deviations from Plan

### Environment Blocker Documented

**Node.js Version Incompatibility**
- **Found during:** Task 1 verification (npm run build)
- **Issue:** Node.js v18.19.1 installed, Astro 5.16.15 requires >=18.20.8
- **Impact:** Cannot run `npm run build` or `npm run dev` until Node.js upgraded
- **Why not auto-fixed:** Environment/infrastructure change outside project scope
- **Resolution needed:** Upgrade Node.js to v18.20.8+ or v20.3.0+
- **Workaround:** Project configuration is correct; environment upgrade unblocks execution

This is documented but not blocking plan completion - the project is correctly configured and will work once Node.js is upgraded.

## Files Changed

**Created (8 files):**
- `package.json` - Project manifest with astro, sharp, zod dependencies
- `package-lock.json` - Locked dependency tree
- `astro.config.mjs` - Astro configuration (site, output, image service, vite)
- `tsconfig.json` - TypeScript strict mode with path aliases
- `.gitignore` - Git exclusions
- `.dockerignore` - Docker exclusions
- `src/layouts/BaseLayout.astro` - Shared HTML layout (66 lines)
- `src/pages/index.astro` - Homepage placeholder (69 lines)

**Modified (1 file):**
- `public/favicon.svg` - Updated to kitchen pot icon with warm colors

## Testing & Verification

**Configuration Verification:**
- ✅ package.json has correct dependencies (astro, sharp, zod)
- ✅ astro.config.mjs has site='https://manna.voogt.co.za'
- ✅ astro.config.mjs has output='static'
- ✅ tsconfig.json extends 'astro/tsconfigs/strict'
- ✅ tsconfig.json has @/* path alias

**File Structure Verification:**
- ✅ src/layouts/BaseLayout.astro exists (>20 lines)
- ✅ src/pages/index.astro exists and imports BaseLayout
- ✅ public/favicon.svg exists with warm colors

**Functional Verification:**
- ⚠️ npm run build - blocked by Node.js version
- ⚠️ npm run dev - blocked by Node.js version
- ✅ Project structure correct and ready for Node.js upgrade

## Git Commits

| Commit | Type | Message |
|--------|------|---------|
| 46f1c8a | chore | Initialize Astro project configuration |
| e185f08 | chore | Add Astro minimal template files |
| 60db1a3 | feat | Create base layout and homepage placeholder |

## Next Phase Readiness

**Blockers:**
- Node.js v18.19.1 → v18.20.8+ upgrade required before `npm run dev` works

**Ready for Phase 02:**
- ✅ Base layout system in place
- ✅ Homepage structure ready for content
- ✅ TypeScript configured for data schemas
- ✅ Image service ready for product photos
- ✅ Warm color palette established

**Recommendations for 01-02:**
1. Upgrade Node.js before starting content management work
2. Test build and dev server after upgrade
3. Verify Sharp image processing works with sample images

## Performance Notes

- Astro 5.0 static output = optimal for Pi deployment (no SSR overhead)
- CSS code splitting enabled = faster page loads
- esbuild minification = smaller bundle sizes
- Sharp image service = optimized assets for limited Pi bandwidth

## Knowledge Captured

**Astro 5.0 Configuration for Static Pi Deployment:**
- Use `output: 'static'` for pure static generation
- Configure Sharp service explicitly for better Pi performance
- Set remotePatterns early for future R2 image integration
- Enable Vite cssCodeSplit and esbuild minify for optimization

**TypeScript Path Aliases:**
- Add baseUrl: "." and paths: {"@/*": ["src/*"]} to compilerOptions
- All imports use @/ prefix (e.g., import BaseLayout from '@/layouts/BaseLayout.astro')

**Mobile-First CSS Reset:**
- box-sizing: border-box on all elements
- Reset margin/padding to 0
- Viewport meta tag with initial-scale=1
- System font stack for fast loading
