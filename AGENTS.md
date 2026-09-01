# Quran API Repository Guide

## Non-obvious constraints

- Write all documentation and code comments in English.
- Use Node.js 22 and pnpm (`package.json` is authoritative). The workspace root is the Next.js app on the `web` branch; the `data` branch holds the canonical Quran API dataset.
- Do not hand-edit `src/components/ui/**`; it is managed by shadcn and excluded from manual modification.
- Zero native emoji throughout the entire codebase and UI. Use `lucide-react` for all icons, status indicators, badges, and decorative accents without exception.
- Use `lucide-react` for Lucide icons; do not add `lucide-vue-next`, `@lucide/vue`, or any other Lucide binding.
- Skeleton loading: skeletons must be rendered directly inline within the single main return statement of feature/page components using the shadcn `Skeleton` primitive with an `isLoading` prop (without creating separate `*-skeleton.tsx` files, early return blocks, or separate skeleton render functions).
- Strictly forbid using ad-hoc CSS or custom styling overrides on UI primitives (`src/components/ui/**`), as default primitive styles are pre-established.
- Strictly forbid using custom `rounded-*` classes. `components.json` configures `rounded-none`, which is already set by default on all UI primitives.
- All TypeScript interfaces and types live in `src/types/`. Never define inline types in components or pages.
- All static constants (site metadata, navigation, API paths, feature lists, FAQ items, UI data arrays) live in `src/constants/`. Modularized by domain (e.g. `site.ts`, `navigation.ts`, `api.ts`) and re-exported via `src/constants/index.ts`. Import as `@/constants`.
- All pure functions (formatting, data transforms, code generation) live in `src/lib/`. These files must not import React or render JSX.
- All custom React hooks live in `src/hooks/`.
- Page-specific components are isolated in `src/components/<page-name>/` (e.g. `src/components/home/`, `src/components/about/`). Shared layout components live in `src/components/common/`.
- Page files in `src/app/` are strictly declarative: they import and compose types, hooks, and components. No business logic or utility functions in page files.
- The Quran API dataset follows the schema defined in branch `data`. Each file is keyed by surah number as a string. Fields: `number` (string), `name` (Arabic), `name_latin` (Latin transliteration), `number_of_ayah` (string), `text` (Record of ayah number to Arabic text), `translations.id` (Indonesian translation from Kemenag RI), `tafsir.id.kemenag` (Tafsir from Kemenag RI).
- The `surah-3digit/` folder contains the same data with zero-padded filenames (`001.json` through `114.json`).
- Data source attribution: Kementerian Agama Republik Indonesia (`https://quran.kemenag.go.id`). Original dataset by Rio Astamal. Distributed under MIT License by Twinpath.
- Follow nearby code style before adding explicit imports for framework globals. Prefer named exports.
- After adding new shadcn components, run `npx shadcn@latest add <component>` rather than manually creating files in `src/components/ui/`.

## Directory structure

```
src/
  app/                    # Next.js App Router pages (declarative only)
    globals.css           # Tailwind + shadcn design tokens
    layout.tsx            # Root layout with providers
    page.tsx              # Home page
    about/page.tsx        # About page
  components/
    ui/                   # shadcn primitives (do not hand-edit)
    common/               # Shared layout: Header, Footer, ThemeToggle, CodeBlock, JsonViewer
    home/                 # Home page components
    about/                # About page components
  constants/              # Static constants, modularized by domain (site, navigation, api, features, faq, about, quickstart)
  hooks/                  # Custom React hooks
  lib/                    # Pure functions, formatters, data helpers (no constants)
  types/                  # TypeScript interfaces and type definitions
```

## Setup and commands

```bash
pnpm install                              # install dependencies
pnpm dev                                  # Next.js dev server on port 3000
pnpm build                                # production build
pnpm lint                                 # ESLint check
pnpm preview                              # OpenNext Cloudflare local preview
pnpm deploy                               # OpenNext Cloudflare deploy
pnpm upload                               # OpenNext Cloudflare upload
pnpm cf-typegen                           # generate Cloudflare env types
npx tsc --noEmit                          # TypeScript type check
```

## Cloudflare Dashboard & Telemetry Setup

- **Managed Transforms (`Cloudflare Dashboard -> Rules -> Settings -> Managed Transforms tab`)**:
  - `Add visitor location headers` (**Required for complete telemetry**): Injects HTTP request headers with visitor location details (`cf-ipcountry`, `cf-region`, `cf-ipcity`, `cf-iplatitude`, `cf-iplongitude`). `logTelemetry` in `src/lib/telemetry.ts` reads these headers with a code-level fallback to `getCloudflareContext().cf`.
  - `Add security headers` (**Recommended**): Automatically injects security response headers (e.g. HSTS, X-Content-Type-Options).
  - `Remove "X-Powered-By" headers` (**Recommended**): Strips server/framework technology disclosure headers for security hardening.
- **Telemetry Verification**:
  - Query remote D1 database telemetry logs: `pnpm exec wrangler d1 execute quran --remote --command "SELECT id, endpoint, country, region, city, latitude, longitude FROM telemetry_logs ORDER BY id DESC LIMIT 10;"`

## Logo Component

The reusable, theme-aware `Logo` component is located at `src/components/common/logo.tsx`.

**Features:**
- Automatic light/dark theme detection via `next-themes`
- TypeScript support with full type safety
- Customizable colors, sizes, and variants
- Hydration-safe (prevents SSR mismatches)
- Two variants: `"full"` (icon + text) and `"icon"` (icon only)
- Default colors configured for light and dark themes

**Basic usage:**
```tsx
import { Logo } from "@/components/common/logo";

// Theme-aware (auto-adapts to light/dark mode)
<Logo size={48} />

// Icon variant (compact)
<Logo size={32} variant="icon" />

// Custom colors (overrides theme)
<Logo size={48} primaryColor="#0B5F4C" secondaryColor="#292728" />

// With Tailwind styling
<Logo size={48} className="hover:scale-110 transition-transform" />
```

**Default colors:**
- Light: Primary `#0B5F4C` (teal), Secondary `#292728` (dark gray), Accent `#C0A576` (gold)
- Dark: Primary `#1B7168` (lighter teal), Secondary `#FAFAF8` (off-white), Accent `#D4C5A9` (lighter gold)

**Full documentation:** See `docs/LOGO_COMPONENT.md` for comprehensive guide and 7+ usage examples.

**Examples:** `src/components/common/logo-examples.tsx` contains practical examples for navbar, hero, sidebar, and animations.

