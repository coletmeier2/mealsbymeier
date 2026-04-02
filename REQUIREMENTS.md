# MealsByMeier — Requirements & Architecture

> Generated from design interview. Reference this document when making architectural decisions.

---

## Project Overview

Personal culinary brand web application for Cole Meier (@mealsbymeier on Instagram).

**Three core pillars:**
1. **Content feed** — professional website mirroring the Instagram @mealsbymeier aesthetic
2. **Social automation** — admin workflow to upload photos/captions and post to Instagram, site, or both
3. **E-commerce** — baked goods shop (bake-to-order, local pickup/delivery); each purchase includes the recipe

---

## User Personas

| Role | Description |
|---|---|
| **Admin (Cole)** | Single admin. Manages all content, products, and orders via `/admin` |
| **Customer** | Public visitor who browses the feed and purchases baked goods |

---

## Functional Requirements

### Content Feed
- Public-facing feed at `/feed` displaying recipe/cooking photos with captions
- Grid layout similar to Instagram
- Admin can upload image + caption and choose publish target: Site, Instagram, or Both
- Instagram migration: manual curation (re-upload best posts with original dates)

### Shop
- Product listings at `/shop` — featured items only displayed (admin manually controls which are featured)
- Products are baked goods, baked to order
- Fulfillment: local pickup or local delivery (no fee; coordinated by communication)
- Each product is linked to a recipe

### Orders & Checkout (Phase 2)
- Stripe checkout for product purchases
- Customer provides: name, email, phone, fulfillment preference (pickup/delivery), delivery address if applicable
- On successful payment: order created, recipe access token generated
- Recipe delivery: emailed PDF (Resend) + downloadable from `/recipes/[token]`
- Admin receives SMS (Twilio) on new order
- Admin manages order status: PENDING → CONFIRMED → READY → COMPLETED (or CANCELLED)
- Status updates trigger customer SMS notifications

### Instagram Integration (Phase 3)
- Connect via Instagram Graph API (requires Facebook Page + Instagram Business account)
- Admin selects "Instagram" or "Both" when uploading a post
- Post is published to Instagram; `instagramPostId` stored for reference

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (TypeScript) | App Router, Turbopack default |
| Database | Postgres (Neon) | Vercel-native integration |
| ORM | Prisma 7 | Client at `src/generated/prisma/client` |
| Auth | NextAuth v5 (beta) | Single admin, credentials strategy |
| Payments | Stripe | Phase 2 |
| Image Storage | Cloudinary | Food photo optimization |
| SMS | Twilio | Phase 2 |
| Email | Resend | Phase 2 |
| Instagram | Instagram Graph API | Phase 3 |
| PDF | @react-pdf/renderer | Phase 2 |
| Deployment | Vercel | |

---

## Data Model

### Post
| Field | Type | Notes |
|---|---|---|
| id | cuid | |
| imageUrl | String | Cloudinary URL |
| caption | String | |
| publishedToSite | Boolean | |
| publishedToInstagram | Boolean | |
| instagramPostId | String? | Set after successful IG post |
| createdAt / updatedAt | DateTime | |

### Product
| Field | Type | Notes |
|---|---|---|
| id | cuid | |
| name | String | |
| slug | String (unique) | URL-safe identifier |
| description | String | |
| price | Int | Cents |
| imageUrl | String | |
| isFeatured | Boolean | Admin-controlled |
| recipeId | String? (unique FK) | One-to-one with Recipe |

### Recipe
| Field | Type | Notes |
|---|---|---|
| id | cuid | |
| title | String | |
| content | String | Markdown |
| pdfUrl | String? | Generated PDF stored in Cloudinary |

### Order
| Field | Type | Notes |
|---|---|---|
| id | cuid | |
| customerName/Email/Phone | String | |
| fulfillmentType | PICKUP / DELIVERY | |
| deliveryAddress | String? | |
| status | PENDING→CONFIRMED→READY→COMPLETED / CANCELLED | |
| stripePaymentIntentId | String (unique) | |
| totalAmount | Int | Cents |

### OrderItem
Price snapshot at time of purchase. Each order item links to a product.

### RecipeAccess
Token-gated recipe download link. Generated per order, per recipe.

---

## URL Structure

### Public
| URL | Page |
|---|---|
| `/` | Landing page |
| `/feed` | Recipe/cooking feed |
| `/shop` | Baked goods storefront |
| `/shop/[slug]` | Product detail + order |
| `/recipes/[token]` | Token-gated recipe download |
| `/about` | About Cole Meier |

### Admin (auth-protected)
| URL | Page |
|---|---|
| `/admin` | Dashboard |
| `/admin/posts` | Manage posts |
| `/admin/posts/new` | Upload post |
| `/admin/shop` | Manage products |
| `/admin/orders` | Order list + status |

---

## Build Phases

### Phase 1 — Foundation ✓
- [x] Next.js 16 + Prisma 7 + Neon scaffold
- [x] NextAuth v5 single-admin auth
- [x] Post upload + public feed
- [x] Shop page + product management
- [x] Admin dashboard with stats
- [ ] Connect Neon database (`DATABASE_URL`)
- [ ] First `prisma migrate dev`
- [ ] Cloudinary setup + image upload in admin

### Phase 2 — Commerce
- [ ] Stripe checkout + webhooks
- [ ] Order status dashboard + actions
- [ ] Recipe attachment to products + PDF generation (`@react-pdf/renderer`)
- [ ] Email delivery (Resend) + recipe download page (`/recipes/[token]`)
- [ ] SMS notifications (Twilio) for admin + customer status updates

### Phase 3 — Instagram
- [ ] Facebook Page + Instagram Business account setup
- [ ] Instagram Graph API credentials
- [ ] Auto-post flow in admin (publish to Instagram option)
- [ ] Migrate existing Instagram content manually

### Phase 4 — Polish
- [ ] SEO (sitemap, meta tags, Open Graph per post)
- [ ] Mobile-responsive polish
- [ ] About page copy and photos
- [ ] Custom domain + Vercel deployment

---

## Key Decisions & Rationale

| Decision | Rationale |
|---|---|
| Next.js over Java | Vercel-native, SSR for SEO, better Instagram/Stripe SDK support |
| Modular monolith | Appropriate for solo low-traffic app; avoids microservice overhead |
| Credentials auth (no OAuth) | Single admin, no social login needed |
| Prices in cents | Avoids floating point errors in financial calculations |
| Route group `(protected)` | Separates login page from auth-guarded admin routes cleanly |
| Manual Instagram migration | Gives curation control; no programmatic re-posting of old content |
