# SEM / LSA Planning MVP

Mobile-first Next.js MVP that productizes the old PowerPoint/email workflow into a complete internal builder + public client wizard for LSA onboarding and planning.

## What the app does

- Internal SEM team can create and edit planning proposals from `/admin`.
- Generates and previews public client URLs like `/client/[slug]`.
- Client completes a polished 10-step wizard (services, budget, geo, assets, hours, bio categories, review, submit).
- Final submit changes session status to `submitted` in local mock state.
- Includes seeded demo content for **Gutter Guardians** based on the provided PPT example.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui-style components
- lucide-react
- react-hook-form
- zod

## Install and run

```bash
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Key routes

- `/` -> redirects to `/demo`
- `/demo` -> redirects to seeded demo client flow
- `/admin` -> admin dashboard and planning list
- `/admin/planning/new` -> create new planning
- `/admin/planning/[id]` -> edit internal planning builder
- `/client/[slug]` -> public client wizard

## Data and persistence model (mock)

- Seed data lives in:
  - `/mock-data/clients.ts`
  - `/mock-data/planning.ts`
- Types live in:
  - `/types/planning.ts`
- Local mock state store:
  - `/lib/store.tsx`
- State is persisted to browser `localStorage` for MVP behavior.

## What is mocked vs. real-later

### Mocked now

- No backend/database
- No authentication
- File uploads are local file-input simulation only
- Public links are local app routes

### Real implementation later

- API + database persistence
- Auth and role permissions
- Cloud file storage
- Email/SMS notifications
- Analytics/event tracking

