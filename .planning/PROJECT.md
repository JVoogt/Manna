# Manna Kitchen Website

> **Direction change (2026-11-08):** Manna now sells ONLY frozen meals for delivery, to help the elderly, disabled people and busy people with meal planning. Launch range: 5 meals + 2 desserts. The platter builder, weekly-meals model and "pickup only" scope below are historical. Current rules: local Pretoria delivery (fee quoted on WhatsApp), pickup at 71 Springbok St still available, 2 business days lead time, orders via WhatsApp. Draft prices/desserts await owner confirmation. See docs/market-research-frozen-meals.md.


## What This Is

A mobile-first ordering website for Manna Kitchen, a Pretoria-based home cooking business. Customers can build custom 6-item snack platters from available inventory or order weekly home-cooked meals. Orders are sent via WhatsApp to initiate conversation and payment arrangements.

## Core Value

Customers can easily browse products, build custom platters or select weekly meals, and place orders that seamlessly flow to Manna via WhatsApp for personalized service and fulfillment.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Custom platter builder: user selects any 6 items from inventory
- [ ] Display all available items with individual prices
- [ ] Real-time cost calculation (sum of 6 selected items)
- [ ] Weekly meals section: display 1-3 meals with image, name, and price
- [ ] Shopping cart: combine multiple platters and meals in one order
- [ ] Checkout form: collect customer name, phone number, and pickup time
- [ ] 48-hour lead time enforcement: prevent platter orders for pickup within 48 hours
- [ ] WhatsApp integration: send order details to +27825795210 when order placed
- [ ] JSON-driven content: all products and meals loaded from JSON files
- [ ] Admin workflow: simple JSON structure for non-technical admin to update
- [ ] Homepage: showcase platter builder and weekly meals
- [ ] About page: tell the story of the two sisters and why Manna exists
- [ ] Contact page: location, hours, phone, WhatsApp
- [ ] Google Analytics integration
- [ ] SEO optimization: target Pretoria North, South Africa keywords
- [ ] Rustic traditional South African design aesthetic
- [ ] Mobile-first responsive design
- [ ] Docker Compose deployment with Traefik integration

### Out of Scope

- User accounts/authentication — guest checkout only, keeps it simple
- Online payment processing — payment handled via WhatsApp conversation
- Delivery options — pickup only, no delivery logistics
- Real-time inventory sync — manual JSON updates sufficient for current scale
- Admin CMS panel — JSON editing provides enough flexibility without complexity
- Order history/tracking — WhatsApp conversation is the record

## Context

Manna Kitchen was started by two sisters when one was diagnosed with Guillain-Barré syndrome. What began as a way to generate additional revenue for medical treatments has grown into a sustainable business with a consistent client base in Pretoria North.

The business offers two product lines:
1. Custom snack platters (build your own from available items)
2. Weekly home-cooked meals (changes weekly, typically 1 meal option, occasionally 2-3)

The admin (one of the sisters) is not highly technical but comfortable editing JSON files in a text editor. The website needs to be easy to update without requiring developer intervention.

Customers are primarily mobile users in the Pretoria area looking for quality home-cooked food and custom snack options.

## Constraints

- **Hosting**: Raspberry Pi (ARM architecture, limited CPU/memory) — must be lightweight and efficient
- **Tech Stack**: Astro (static site generator) + Docker Compose — already decided
- **Networking**: Traefik reverse proxy + Cloudflare DNS — existing infrastructure
- **Domain**: manna.voogt.co.za — already configured
- **Performance**: Must run smoothly on Pi hardware — optimize bundle size, minimize runtime overhead
- **Budget**: Self-hosted to minimize ongoing costs — no paid services unless essential
- **Mobile-first**: Most customers order via phone — mobile experience is primary
- **Business Rule**: Platter orders require 48-hour lead time — must validate pickup date

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro framework | Static generation = fast + lightweight, perfect for Pi hosting | — Pending |
| JSON-driven content | Simple for non-technical admin, version controllable | — Pending |
| WhatsApp ordering | Customers already use WhatsApp, enables personal service | — Pending |
| No payment gateway | Avoid transaction fees, maintain personal touch | — Pending |
| Guest checkout only | Reduces friction, no login barriers for impulse orders | — Pending |
| Docker Compose | Matches existing infrastructure, easy deployment | — Pending |

---
*Last updated: 2026-01-28 after initialization*
