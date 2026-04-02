@AGENTS.md

# MealsByMeier

Personal culinary brand site — recipe feed, baked goods shop, Instagram automation, admin dashboard.

## Commands

```bash
npm run dev              # Dev server (Turbopack, default in Next.js 16)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint

npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma migrate dev   # Create and apply a new migration (development)
npx prisma migrate deploy # Apply pending migrations (production/CI)
npx prisma studio        # Open Prisma Studio GUI
```

## Architecture

**Modular monolith** — Next.js 16 App Router with `src/` directory.

**Modules** (`src/modules/`):

| Module | Responsibility |
|---|---|
| `content/` | Feed posts — DB queries, server actions, types |
| `shop/` | Products — DB queries, server actions, types |
| `orders/` | Orders, Stripe webhooks (Phase 2) |
| `recipes/` | Recipe content, PDF generation (Phase 2) |
| `social/` | Instagram Graph API (Phase 3) |
| `notifications/` | Twilio SMS + Resend email (Phase 2) |

**Shared** (`src/lib/`): `db.ts` (Prisma client), `auth.ts` (NextAuth config)

## Route Structure

```
/                        Landing page
/feed                    Public recipe feed
/shop                    Baked goods storefront
/shop/[slug]             Product detail
/recipes/[token]         Token-gated recipe download (Phase 2)
/about                   About page

/admin/login             Login (no auth required)
/admin                   Dashboard (auth required)
/admin/posts             Manage posts
/admin/posts/new         Upload new post
/admin/shop              Manage products
/admin/orders            Order management
```

## Key Conventions

- **Prisma client**: import from `@/generated/prisma/client`, NOT `@prisma/client` (Prisma 7 entry point is `src/generated/prisma/client.ts`)
- **Auth**: call `auth()` from `@/lib/auth` in every server component/action that needs a session. Auth check always happens before any DB write.
- **Route protection**: admin protected via server layout (`src/app/admin/(protected)/layout.tsx`) — login page at `src/app/admin/login/` is outside the protected group
- **Prices**: always stored in **cents** (integers) in DB; format with `(cents / 100).toFixed(2)` for display
- **Server Actions**: file-level `"use server"` directive in `src/modules/*/actions.ts`
- **Cache revalidation**: call `revalidatePath()` after mutations; `refresh()` from `next/cache` for full page refresh
- **Next.js 16**: uses `proxy.ts` instead of `middleware.ts`; `params`/`searchParams` are Promises — always `await` them
- **Tailwind**: stone color palette for brand colors; rounded-lg/rounded-xl for cards; rounded-full for buttons

## Environment

Copy `.env.example` to `.env.local` for local development.
Required for Phase 1: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`
