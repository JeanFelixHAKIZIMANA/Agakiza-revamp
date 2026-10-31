# Agakiza website

The official website of Agakiza ministry, served at [agakiza.rw](https://agakiza.rw).

Built with [Next.js](https://nextjs.org) and [Payload CMS](https://payloadcms.com) on PostgreSQL.
The public site is bilingual (Kinyarwanda at `/rw`, English at `/en`) and the admin panel lives at `/admin`.

## Local development

Requirements: Node 24 (see `.nvmrc`), pnpm, and PostgreSQL (or Docker).

```bash
docker compose up -d          # starts PostgreSQL on port 5432
cp .env.example .env          # then set PAYLOAD_SECRET
pnpm install
pnpm dev                      # http://localhost:3000, admin at /admin
```

The first visit to `/admin` asks you to create the first admin user.
In development Payload syncs the database schema automatically.

## Project layout

| Path | What it holds |
|---|---|
| `src/app/(frontend)/[locale]` | Public pages, one route tree per language |
| `src/app/(payload)` | Payload admin panel and REST/GraphQL API (generated boilerplate) |
| `src/collections`, `src/globals` | Content types managed in the admin |
| `src/messages/{rw,en}.json` | Interface text in each language |
| `src/lib/navigation.ts` | Header menu and footer groups |
| `src/migrations` | Database migrations applied in production |

## Changing the content model

After editing a collection or global:

```bash
pnpm generate:types        # refresh src/payload-types.ts
pnpm generate:importmap    # only when admin components change
pnpm migrate:create <name> # create a migration for production
```

`pnpm start` applies pending migrations before starting the server.
