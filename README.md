# LaunchLayer AI Full Stack MVP

This repo is a coded starter for an AI website builder SaaS.

It includes:

- Next.js App Router project structure
- Prisma schema with SQLite for local development
- Workspace, website, page, version, domain, lead, analytics, and subscription models
- Marketing site
- App dashboard
- New website onboarding flow
- Website builder page
- Database backed website renderer
- AI generate route with OpenAI integration point and fallback mode
- Billing page with Stripe integration point
- Domain flow with database persistence
- Lead API route
- Seed data for a demo workspace

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- SQLite for local development
- OpenAI integration point
- Stripe integration point

## Quick start

1. Install dependencies

```bash
npm install
```

2. Copy environment file

```bash
cp .env.example .env
```

3. Push database schema

```bash
npm run db:push
```

4. Seed demo data

```bash
npm run db:seed
```

5. Start development server

```bash
npm run dev
```

## What is already working

- Database models and local SQLite setup
- Marketing pages
- Dashboard route
- New website creation flow
- Stored JSON website rendering
- Builder UI backed by database records
- AI edit fallback when OpenAI is not configured
- Domain assignment flow
- Lead capture API route
- Seeded demo data

## What you still need to wire for production

- Real authentication and user sessions
- Real Stripe Checkout Sessions and webhooks
- Real domain registrar or DNS provider integration
- Email sending for leads and billing
- CDN or static site publish pipeline
- Object storage for media uploads
- Team permissions
- Rate limiting
- Moderation and abuse checks
- Better website JSON schema validation

## Suggested next production upgrades

- Add Clerk or Auth.js for authentication
- Move SQLite to Postgres
- Add background jobs for AI generation and publishing
- Add Cloudflare or registrar API for domain verification
- Add Stripe product price IDs and webhook syncing
- Add blob storage for uploaded images
- Add a visual editor alongside chat editing
- Add page templates and reusable blocks
