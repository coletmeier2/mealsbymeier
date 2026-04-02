# MealsByMeier

Personal culinary brand web application for Cole Meier ([@mealsbymeier](https://instagram.com/mealsbymeier)).

Three pillars: a public recipe feed, a baked goods shop, and an admin dashboard for managing content and orders.

---

## Features

### Phase 1 — Complete
- **Public feed** at `/feed` — photo + caption grid, Instagram-style
- **Shop** at `/shop` — featured baked goods listings
- **Product detail** at `/shop/[slug]`
- **Admin dashboard** at `/admin` — stats for orders, posts, and products
- **Post management** — create (with Cloudinary image upload) and delete posts; choose publish target: site, Instagram, or both
- **Product management** — toggle featured, delete products
- **Single-admin auth** — credential-based login via NextAuth v5

### Phase 2 — Planned
- Stripe checkout + webhooks
- Order status management (PENDING → CONFIRMED → READY → COMPLETED)
- Recipe PDFs attached to products (`@react-pdf/renderer`)
- Token-gated recipe download at `/recipes/[token]`
- Email delivery via Resend
- Admin + customer SMS via Twilio

### Phase 3 — Planned
- Instagram Graph API integration — auto-post from admin when publish target includes Instagram
- Manual migration of existing Instagram content

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma 7 |
| Auth | NextAuth v5 (credentials strategy) |
| Image Storage | Cloudinary |
| Styling | Tailwind CSS (stone palette) |
| Payments | Stripe (Phase 2) |
| Email | Resend (Phase 2) |
| SMS | Twilio (Phase 2) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing routes (feed, shop, about)
│   ├── admin/
│   │   ├── (protected)/   # Auth-guarded admin routes
│   │   └── login/         # Login page (no auth required)
│   └── api/auth/          # NextAuth route handler
├── components/            # Shared client components (e.g. ImageUpload)
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── cloudinary.ts      # Cloudinary upload signature helper
│   └── db.ts              # Prisma client singleton (with PrismaPg adapter)
└── modules/
    ├── content/           # Posts — queries, actions, types
    ├── orders/            # Orders — queries, types
    └── shop/              # Products — queries, actions, types
```

**Key conventions:**
- Prisma client imported from `@/generated/prisma/client` (Prisma 7 output path)
- Prices always stored in **cents** (integers); formatted as `(cents / 100).toFixed(2)` for display
- Auth checked before every DB write in server actions
- `params` and `searchParams` are Promises in Next.js 16 — always `await` them

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Cloudinary](https://cloudinary.com) account

### Setup

```bash
# Install dependencies
npm install

# Copy env template and fill in values
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for NextAuth (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Email address for the admin login |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password (`bcryptjs`, cost 10) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Generating credentials:**
```bash
# AUTH_SECRET
openssl rand -base64 32

# ADMIN_PASSWORD_HASH (replace with your password)
node -e "const b = require('bcryptjs'); b.hash('yourpassword', 10).then(console.log)"
```

> **Note:** bcrypt hashes contain `$` characters. Wrap the value in the env file with escaped dollars in double quotes:
> `ADMIN_PASSWORD_HASH="\$2b\$10\$..."`

### Commands

```bash
npm run dev        # Dev server (Turbopack)
npm run build      # Production build
npm run lint       # ESLint

npx prisma generate        # Regenerate client after schema changes
npx prisma migrate dev     # Create and apply a migration (development)
npx prisma migrate deploy  # Apply pending migrations (production)
npx prisma studio          # Open Prisma Studio GUI
```

---

## Admin Usage

1. Navigate to `/admin/login`
2. Sign in with your `ADMIN_EMAIL` and password
3. **New Post** — upload an image (direct to Cloudinary), write a caption, choose publish target
4. **Shop** — manage product listings, toggle featured status
5. **Orders** — view and manage customer orders (Phase 2)
