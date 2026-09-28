# lino-portfolio

Portfolio for a Senior Generative AI Engineer — Next.js App Router, TypeScript strict mode, Tailwind v4, GSAP/Lenis-driven scroll scenes, and a small RAG-grounded "Ask me" agent.

## Setup

Requires Node 20+.

```bash
npm install
cp .env.example .env.local   # fill in the values you have — every key is optional and the site degrades gracefully without them
npm run dev
```

Open http://localhost:3000.

### Environment variables

All of these are optional — features that need a missing key degrade to a clear "not configured" state instead of crashing.

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG tags, sitemap, robots.txt |
| `ANTHROPIC_API_KEY` | The Cmd/Ctrl+K "Ask me" agent (`/api/chat`) |
| `RESEND_API_KEY`, `CONTACT_EMAIL` | The contact form's email delivery (server action in `app/actions/contact.ts`) |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics |
| `CHAT_RATE_LIMIT_PER_MINUTE`, `CONTACT_RATE_LIMIT_PER_HOUR` | In-memory rate limiting for the chat route and contact form |

### Scripts

```bash
npm run dev          # dev server (Turbopack)
npm run build         # production build
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npm run format        # prettier --write
npm run test          # vitest (unit)
npm run test:e2e      # playwright (nav + contact form smoke tests)
npm run check          # typecheck + lint + format:check + test, all in one
```

## Editing content

All portfolio content lives in `/content` as typed TypeScript files, each validated against a Zod schema in `content/schemas.ts` at import time — **the app throws immediately on invalid content**, so a typo in a required field fails loudly in dev rather than silently rendering blank. You should never need to touch a component to change what's on the page.

| File | Powers |
|---|---|
| `content/profile.ts` | Name, title, bio, links, availability, operating principles |
| `content/projects.ts` | Selected Work index — slugs here must match a file in `content/case-studies/` |
| `content/case-studies/*.mdx` | The long-form case study write-ups (frontmatter validated by `caseStudyFrontmatterSchema`, body is MDX) |
| `content/capabilities.ts` | The five pinned capability groups |
| `content/experience.ts` | Timeline roles, each with 2–4 metric-backed impact bullets |
| `content/writing.ts` | Research, Writing & Talks horizontal scroller |
| `content/oss.ts` | Open Source repo cards |
| `content/testimonials.ts` | Stacking-card pull quotes |
| `content/lab.ts` | Lab experiment index — `id` must match a route under `app/lab/[slug]` and a `component` registered in `components/lab/registry.ts` |
| `content/education.ts` | Degrees and certifications |
| `content/metrics.ts` | The count-up metrics strip between Hero and Capabilities |
| `content/navigation.ts` | Nav/footer sitemap links |

To add a new case study: add a project to `content/projects.ts` and an MDX file to `content/case-studies/` with a matching `slug`. `app/work/[slug]/page.tsx` reads both — the project entry for the index-page card, the MDX file for the detail page (problem, constraints, architecture, outcome, and a scroll-spy side nav generated from its `##` headings).

## Design system

- **Tokens** live in `styles/tokens.css`: palette (light + dark), type scale, grid (1200px max width, 12 columns), radii, elevation and easing curves. Change a value there and it applies everywhere.
- **Layout primitives** in `components/ui`: `Section` (consistent vertical rhythm, optional tinted `surface` tone), `Container`, `SectionHeader` (numbered eyebrow + serif heading + optional action), `Button`, `Tag`, `Icons`, and `PageShell` for secondary pages (case studies, lab, résumé).
- **Typography**: Instrument Serif for display headings, Geist for body text, Geist Mono for small labels (`eyebrow` utility).
- **Motion** is deliberately restrained: short ease-out transitions on hover/press (buttons scale to 0.97 when pressed), and a one-time fade-up on scroll driven by `components/ui/RevealObserver.tsx`. Add `data-reveal` to any element (and optionally a `--reveal-delay`) to opt in. Content is only hidden while JS runs, and `prefers-reduced-motion` disables it entirely.
- All base styles in `app/globals.css` live in `@layer base` so Tailwind utilities always win. Don't add unlayered element resets there: they override every spacing utility.

The heavier GSAP primitives in `/components/motion` and `/hooks` are still in the repo but are no longer mounted on the home page.

## Deploy

Built for Vercel:

1. Push to a Git repo and import it in Vercel.
2. Set the environment variables above in the Vercel project settings (all optional, but the chat agent and contact form need their respective keys to actually work in production).
3. Vercel Analytics and Speed Insights are already wired in `app/layout.tsx` — no extra setup needed once the project is linked.

The `/api/chat` route runs on the Node.js runtime (it reads the MDX case studies off disk at request time via `lib/rag.ts` / `lib/case-studies.ts`), everything else is static or edge-rendered by default.
