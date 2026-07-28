# YAS Outlet — Admin Dashboard

A SvelteKit rebuild of the YAS Outlet boutique admin dashboard: orders,
products, tours, customers, discounts and store settings, in a warm
cream / espresso / gold design system.

The data layer is a typed set of mock records — there is no backend. Every
interaction (filtering, validation, status changes, toasts) genuinely works
against that data; create/update/delete actions validate the submission and
confirm, but nothing is persisted.

## Stack

| Concern    | Choice                                      |
| ---------- | ------------------------------------------- |
| Framework  | SvelteKit 2 · Svelte 5 (runes)              |
| Language   | TypeScript (strict)                         |
| Styling    | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Components | shadcn-svelte primitives on Bits UI         |
| Forms      | Superforms + Zod 4                          |
| Icons      | `@lucide/svelte`                            |
| Toasts     | `svelte-sonner`                             |
| Linting    | ESLint flat config + `@antfu/eslint-config` |
| Formatting | Prettier + `prettier-plugin-svelte`         |

## Getting started

```bash
npm install
npm run dev
```

| Script            | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Development server                          |
| `npm run build`   | Production build (`@sveltejs/adapter-node`) |
| `npm run preview` | Preview the production build                |
| `npm run check`   | `svelte-check` + TypeScript                 |
| `npm run lint`    | ESLint                                      |
| `npm run format`  | Prettier                                    |

## Routes

```
/                       → redirects to /admin
/admin                  Overview
/admin/orders           Orders list  (?status= ?type= ?payment= ?delivery= ?q=)
/admin/orders/[id]      Order detail
/admin/products         Catalogue    (?category= ?productType= ?orderType= ?stock= ?visibility= ?view= ?q=)
/admin/products/new     Create product
/admin/products/[id]    Edit product
/admin/tours            Tours
/admin/tours/[id]       Tour detail
/admin/customers        Customers    (?q= ?customer=)
/admin/discounts        Discounts    (?edit=)
/admin/settings         Settings     (?section=)
```

Search, filters, tabs, the grid/table switch and the open customer/discount
drawer all live in the URL, so every view is linkable, refreshable and
back-button friendly.

## Project layout

```
src/
├── app.css                     Design tokens + global styles (Tailwind v4)
├── lib/
│   ├── components/
│   │   ├── ui/                 shadcn-svelte primitives (Bits UI)
│   │   ├── layout/             Sidebar, Header, Logo, PageHeader
│   │   ├── dashboard/          Summary cards, chart, badges, filter bar
│   │   ├── shared/             Field, EmptyState, skeletons, ConfirmAction
│   │   └── orders|products|tours|customers|discounts|settings/
│   ├── data/                   Typed mock records and filter helpers
│   ├── schemas/                Zod schemas for every form
│   ├── server/                 Server-only defaults and form projections
│   ├── stores/                 Shared UI preferences
│   ├── types/                  Domain types
│   └── utils/                  Formatting, status labels, URL state
└── routes/                     Filesystem routing
```

## Notes

- **Design tokens.** The warm palette lives in `src/app.css` as Tailwind v4
  `@theme` variables. The shadcn-svelte semantic tokens (`--color-primary`,
  `--color-border`, …) are mapped onto it, so generated primitives inherit the
  brand rather than the default neutral theme.
- **Loading states.** List data is streamed from the server load functions, so
  the page shell paints immediately and each panel shows its own skeleton until
  its rows arrive. No artificial delays.
- **Chart.** The seven-day sales chart is a custom responsive SVG with monotone
  cubic interpolation — no charting dependency.
- **Images.** Product and tour artwork are local SVGs under `static/images`.
