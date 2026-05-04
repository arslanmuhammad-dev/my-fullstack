# Practice — AI-Powered Task Management

A fullstack portfolio project showcasing modern web development practices: server-rendered React with Next.js 16, type-safe database access, secure authentication, and a streaming AI assistant.

## Features

- **Authentication** — email/password sign-up and sign-in with JWT sessions stored in HTTP-only cookies, bcrypt password hashing
- **Task management** — create, prioritize, schedule, and move tasks across `To do → In progress → Done` columns
- **AI assistant** — streaming chat sidebar that has context on your current tasks, powered by the Vercel AI SDK
- **Type safety end-to-end** — TypeScript throughout, Drizzle ORM for the database, Zod for input validation
- **Server Actions** — mutations call type-safe server functions directly from React components, no manual REST plumbing
- **Polished UI** — Tailwind CSS v4, dark mode, responsive layout, accessible primitives

## Stack

| Layer        | Tech                                              |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 16 (App Router, React 19, Turbopack)      |
| Language     | TypeScript                                        |
| Database     | SQLite via `better-sqlite3` + Drizzle ORM         |
| Auth         | `jose` (JWT) + `bcryptjs`                         |
| Validation   | Zod v4                                            |
| AI           | Vercel AI SDK v6 + AI Gateway (`anthropic/...`)   |
| Styling      | Tailwind CSS v4 + custom design tokens            |
| Icons        | lucide-react                                      |

## Project structure

```
src/
├── app/
│   ├── (auth)/                # sign-in, sign-up route group
│   │   ├── actions.ts         # signUp / signIn / signOut Server Actions
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/chat/route.ts      # streaming AI endpoint
│   ├── dashboard/             # protected dashboard
│   │   ├── actions.ts         # task CRUD Server Actions
│   │   ├── ai-assistant.tsx   # streaming chat client
│   │   ├── new-task-form.tsx
│   │   ├── task-board.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx               # landing page
├── components/ui/             # Button, Input, Label, Textarea
└── lib/
    ├── auth.ts                # session helpers
    ├── db/                    # Drizzle client + schema
    └── utils.ts
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `AI_GATEWAY_API_KEY` — optional. Get one at [vercel.com/ai-gateway](https://vercel.com/ai-gateway). Without it, the assistant runs in offline demo mode.

### 3. Run database migrations

```bash
npm run db:migrate
```

This creates `data.db` (SQLite) in the project root with the `users` and `tasks` tables.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start adding tasks.

## Scripts

| Script                | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Start the dev server (Turbopack)              |
| `npm run build`       | Production build                              |
| `npm run start`       | Run the production build                      |
| `npm run lint`        | ESLint                                        |
| `npm run db:generate` | Generate a new SQL migration from the schema |
| `npm run db:migrate`  | Apply migrations to the local database        |
| `npm run db:studio`   | Open Drizzle Studio in the browser            |

## Deploying

This app is ready to deploy on Vercel. For production:

1. Switch the database to a hosted Postgres (e.g. Neon via the Vercel Marketplace) and update `src/lib/db/index.ts` and `drizzle.config.ts` to use `drizzle-orm/postgres-js` or `drizzle-orm/neon-http`.
2. Set `AUTH_SECRET` and `AI_GATEWAY_API_KEY` in the Vercel project's environment variables.
3. `git push` — Vercel handles the rest.

## What this project demonstrates

- Designing a typed schema and writing migrations
- Implementing authentication from first principles (no external library)
- Composing React Server Components with client interactivity (`useActionState`, `useTransition`)
- Building an AI feature that streams responses to the UI
- Structuring an App Router project with route groups, layouts, and Server Actions
- Writing accessible, responsive UI without a heavy component library

---

Built by **arslan**.
