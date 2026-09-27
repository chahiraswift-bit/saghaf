# SHAGAF — From Passion to Profession

A digital education ecosystem connecting learners, teachers and private
schools through one platform. Built with Next.js 14 (App Router),
TypeScript, Tailwind CSS and Supabase (Postgres + Auth + Storage).

> **Where this build stands:** this is **Phase 1** of a phased build — the
> real, working foundation: project scaffold, full database schema with Row
> Level Security, authentication (signup/login/logout/forgot-password) with
> role selection, role-protected routing for all four roles, the landing
> page, and a working Explore page with search across courses/schools/
> teachers. Learner/Teacher/School/Admin dashboards are stubbed with a
> real auth-gated welcome screen and an honest "coming in Phase N" list
> instead of fake buttons — see the roadmap at the bottom of this file.

---

## 1. Prerequisites

- Node.js 18.18 or newer
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account (for deployment)

## 2. Clone and install

```bash
git clone <your-repo-url> shagaf
cd shagaf
npm install
```

## 3. Create your Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Pick any name/region and a database password (save it somewhere safe).
3. Once the project is ready, go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server/script use only)

## 4. Run the database migration

1. In the Supabase dashboard, open **SQL Editor**.
2. Open `supabase/migrations/0001_init.sql` from this repo, copy its full
   contents, paste into the SQL Editor, and click **Run**.
   This creates every table, enum, index, trigger, Row Level Security
   policy, and storage bucket described in the project brief.
3. Confirm it worked: **Table Editor** should now show `profiles`,
   `schools`, `courses`, `enrollments`, etc.

*(If you prefer the Supabase CLI: `supabase link` then
`supabase db push` using the same file.)*

## 5. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the four values from steps 3 and (for `SEED_DEMO_PASSWORD`) your
own choice of a demo password, at least 8 characters.

## 6. Seed demo data (recommended)

This creates 4 fixed demo accounts (one per role) plus ~5 schools, 10
teachers, 20 courses with lessons, 30 learners, enrollments, reviews and
ads — so the app isn't empty the first time you open it.

```bash
npm run seed
```

Demo login credentials after seeding (password = whatever you set as
`SEED_DEMO_PASSWORD`):

| Role | Email |
|---|---|
| Learner | `learner@shagaf.demo` |
| Teacher | `teacher@shagaf.demo` |
| School Admin | `school@shagaf.demo` |
| Super Admin | `admin@shagaf.demo` |

> The `super_admin` role can never be self-selected at signup — it only
> exists because the seed script creates it directly with the service role
> key. To promote a real user to admin later, update their `role` in the
> `profiles` table directly in Supabase.

## 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 8. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project** → import the repo.
3. Add the same environment variables from `.env.local` in
   **Project Settings → Environment Variables** (all four — yes, including
   `SUPABASE_SERVICE_ROLE_KEY` if you plan to re-run the seed script from
   a local machine pointed at production; it is never read by the deployed
   app itself, only by `scripts/seed.ts`).
4. Deploy. Vercel auto-detects Next.js — no build config needed.
5. In Supabase → **Authentication → URL Configuration**, add your Vercel
   URL (e.g. `https://shagaf.vercel.app`) to **Site URL** and **Redirect
   URLs** so email confirmation and password-reset links work in production.

Everything here runs on each service's free tier. No paid service is
required.

---

## Project structure

```
src/
  app/                    Routes (App Router)
    (public pages: /, /explore, /about, /contact, /for-schools)
    login/ register/ forgot-password/ reset-password/
    dashboard/            Learner area (role: learner)
    teacher/              Teacher area (role: teacher)
    school/               School area (role: school_admin)
    admin/                Admin area  (role: super_admin)
    auth/callback/        OAuth/email-confirmation redirect handler
  components/
    brand/                Logo — uses your official artwork, unaltered
    ui/                   Design system primitives (Button, Input, Card…)
    layout/                Navbar, Footer, mobile menu, theme toggle
    course/ school/ auth/ dashboard/
  lib/
    supabase/              Browser client, server client, middleware helper
    types/database.ts      Hand-written types mirroring the SQL schema
    actions/                Server Actions (e.g. sign out)
  middleware.ts             Role-based route protection
supabase/
  migrations/0001_init.sql  Full schema + RLS + storage buckets
scripts/seed.ts              Demo account + demo data generator
public/brand/                 Your official logo, both background variants
```

## Roles & route protection

Every signup chooses `learner`, `teacher`, or `school_admin` (there's no
"Admin" option in the UI — see step 6 above). `src/middleware.ts` reads the
signed-in user's role from `profiles` and:

- redirects signed-out visitors away from `/dashboard`, `/teacher`,
  `/school`, `/admin` to `/login`
- redirects a signed-in user with the *wrong* role for a given area back to
  their own home
- redirects an already-signed-in user away from `/login` / `/register`

Row Level Security in `0001_init.sql` enforces the same boundaries at the
database level (see section 18 of the product brief) — the middleware is a
UX convenience, RLS is what actually protects the data even if someone
calls the API directly.

## What's next (phased build plan)

| Phase | Scope |
|---|---|
| ✅ 1 | Scaffold, schema + RLS, auth, role routing, landing, Explore |
| 2 | Course detail page + enrollment flow |
| 3 | Learner Dashboard: My Courses, progress, certificates, favorites, reviews |
| 4 | Teacher Dashboard: course/lesson CRUD, students, analytics |
| 5 | School Dashboard: teacher roster, courses, ads, analytics + public school/teacher profile pages |
| 6 | Admin Dashboard: moderation queues, platform analytics, notifications |

## Notes on scope decisions

- **Payments:** not wired to a real gateway (per the brief). The
  `transactions` table and `subscription_plan` enum on `schools` exist so
  Stripe or a local Algerian gateway can be added later without a schema
  change. Enrollment is free/demo in this MVP.
- **i18n:** UI copy is English-only for now; `profiles.language` and
  `courses.language` already exist in the schema so Arabic/French UI and
  RTL layout can be added later without a migration.
- **AI features, live streaming, messaging, exams, etc. (brief section 40):**
  intentionally out of scope for the MVP, as instructed.
