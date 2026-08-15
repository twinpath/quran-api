# Quran JSON Repository Guide

## Non-obvious constraints

- Write all documentation and code comments in English.
- Use Node.js 22 and pnpm (`package.json` is authoritative). The workspace root is the Next.js app on the `web` branch; the `master` branch (checked out as a git worktree at `./master/`) holds the canonical Quran JSON dataset.
- Do not hand-edit `src/components/ui/**`; it is managed by shadcn and excluded from manual modification.
- Zero native emoji throughout the entire codebase and UI. Use `lucide-react` for all icons, status indicators, badges, and decorative accents without exception.
- Use `lucide-react` for Lucide icons; do not add `lucide-vue-next`, `@lucide/vue`, or any other Lucide binding.
- Skeleton-first loading: every data-driven UI section must have a companion `*-skeleton.tsx` component built with the shadcn `Skeleton` primitive, wrapped in React `Suspense` boundaries at the page level.
- All TypeScript interfaces and types live in `src/types/`. Never define inline types in components or pages.
- All pure functions (formatting, data transforms, code generation, constants) live in `src/lib/`. These files must not import React or render JSX.
- All custom React hooks live in `src/hooks/`.
- Page-specific components are isolated in `src/components/<page-name>/` (e.g. `src/components/home/`, `src/components/about/`). Shared layout components live in `src/components/common/`.
- Page files in `src/app/` are strictly declarative: they import and compose types, hooks, and components. No business logic or utility functions in page files.
- The Quran JSON dataset follows the schema defined in `master/surah/{number}.json`. Each file is keyed by surah number as a string. Fields: `number` (string), `name` (Arabic), `name_latin` (Latin transliteration), `number_of_ayah` (string), `text` (Record of ayah number to Arabic text), `translations.id` (Indonesian translation from Kemenag RI), `tafsir.id.kemenag` (Tafsir from Kemenag RI).
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
    home/                 # Home page components and skeletons
    about/                # About page components and skeletons
  hooks/                  # Custom React hooks
  lib/                    # Pure functions, constants, formatters, data helpers
  types/                  # TypeScript interfaces and type definitions
master/                   # Git worktree of master branch (Quran JSON dataset)
  surah/                  # 114 surah JSON files (1.json - 114.json)
  surah-3digit/           # Zero-padded copies (001.json - 114.json)
  generator.sh            # Dataset generator script
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
