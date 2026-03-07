# Copilot Instructions — EduDash Pro Marketing Website

## Project Purpose

**This repo is the marketing website only.** It is NOT the web application.

| What | Where |
|------|-------|
| Marketing site (this repo) | `edudashpro.org.za` — landing, pricing, legal, careers |
| Web app | `app.edudashpro.org.za` — deployed from `../dashpro` (Expo web) |
| Mobile app | iOS / Android — deployed from `../dashpro` (React Native) |

**Rule: This repo contains NO authenticated app code.** Any route that requires auth, renders dashboards, or provides app functionality must redirect to `https://app.edudashpro.org.za`.

### Routes that belong in this repo
- `/` — landing page
- `/pricing` — pricing and tier comparison
- `/privacy`, `/terms`, `/popia` — legal pages
- `/jobs`, `/apply` — careers
- `/sitemap.ts` — SEO

### Routes that must redirect → `app.edudashpro.org.za`
Any route not in the list above. Add them to `vercel.json` as permanent redirects, not as Next.js pages.

---

## Project Overview (marketing context)

**EduDash Pro** is a multi-tenant, AI-powered educational platform for South African schools and preschools. This marketing site presents the platform to prospective users and directs them to the app.

**Stack:**
| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | TailwindCSS 4 |
| Payments (pricing CTA) | PayFast via `payfast-create-payment` Edge Function |
| i18n | `react-i18next`, 9 languages: en, af, zu, st, nso, fr, pt, es, de |
| Error tracking | Sentry (`@sentry/nextjs`) |
| Analytics | PostHog (optional) |

Supabase is used only for:
- `early_access_signups` table (email capture from landing page)
- Read-only public data (pricing tiers, feature flags for landing page display)

---

## WARP.md Rules (NON-NEGOTIABLE)

The following rules from `../dashpro/WARP.md` apply equally to this codebase:

### File Size Limits
| File type | Max lines |
|-----------|-----------|
| Components | ≤400 (excl. CSS/styles) |
| Pages/Routes | ≤500 |
| Hooks | ≤200 — split into subfolder with barrel `index.ts` |
| Services/Utilities | ≤500 |
| Type definitions | ≤300 (except auto-generated) |

### Logging
- **Never use `console.log`, `console.warn`, or `console.error` in production code.**
- Use a structured logger or Sentry for error reporting.
- `console.*` only inside `process.env.NODE_ENV === 'development'` guards.

### UI Rules
- **NEVER use `alert()` on web** — use toast notifications instead.
- Always provide loading, error, and empty states for every data-fetching component.

### AI Proxy Rule
- **NEVER call AI APIs (Anthropic, OpenAI) directly from the browser.**
- All AI calls must go through `supabase/functions/ai-proxy/` Edge Function.
- Reference `src/lib/ai/capabilities.ts` for tier/capability matrix.
- Check quota via `src/lib/hooks/useAIQuota.ts` before sending requests.

### Storage Paths Rule
- **Always store Supabase Storage paths, never signed URLs.**
- Signed URLs expire (~1 hour). Generate them on-demand at display time only.

### Database-First Rule
- If code needs a DB column that doesn't exist, add it via migration — do not code fallback chains.

### Security
- Never expose `SUPABASE_SERVICE_ROLE_KEY` client-side.
- Always maintain RLS policies for tenant isolation.
- Never modify authentication flow without explicit approval.
- Use Zod for all user input validation.

---

## Developer Workflows

```bash
# Development
npm run dev           # Next.js dev server on :3000

# Type checking (elevated memory — required)
npm run typecheck     # NODE_OPTIONS=--max-old-space-size=4096 tsc --noEmit

# Quality gates (run before committing)
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier

# Database migrations (run from ../dashpro)
supabase migration new <name>
npm run lint:sql
supabase db push
supabase db diff
```

---

## Route Structure (marketing pages only)

```
src/app/
├── page.tsx / page.module.css     # Landing page ✅ stays here
├── pricing/                       # Pricing tiers ✅ stays here
├── privacy/                       # Privacy policy ✅ stays here
├── terms/                         # Terms of service ✅ stays here
├── popia/                         # POPIA compliance ✅ stays here
├── jobs/                          # Job listings ✅ stays here
├── apply/                         # Job applications ✅ stays here
├── data-deletion/                 # GDPR/POPIA deletion request ✅ stays here
├── sitemap.ts                     # SEO sitemap ✅ stays here
└── api/                           # Only public/webhook API routes
```

All other routes currently in the repo (sign-in, sign-up, dashboard, auth-callback,
invite, exam-prep, admin, aftercare, ecd, display, registration, teacher-signup)
**must be migrated to redirects** pointing to `https://app.edudashpro.org.za`.

---

## Key Patterns

### Redirecting App Routes

Any link on the marketing site that takes a user into the app must use full URLs:
```typescript
// ✅ Correct — sends user to the app
<a href="https://app.edudashpro.org.za/sign-in">Sign In</a>
<a href="https://app.edudashpro.org.za/sign-up/principal">Get Started</a>

// ❌ Wrong — creates a page in the marketing site
<Link href="/sign-in">Sign In</Link>
```

For vercel.json redirects (existing routes that used to be app pages):
```json
{
  "redirects": [
    { "source": "/sign-in", "destination": "https://app.edudashpro.org.za/sign-in", "permanent": false },
    { "source": "/dashboard/:path*", "destination": "https://app.edudashpro.org.za/dashboard/:path*", "permanent": false }
  ]
}
```

### Supabase Usage (limited)

Only for unauthenticated public reads and email capture:
```typescript
// ✅ Email capture on landing page
const { error } = await supabase
  .from('early_access_signups')
  .insert({ email, created_at: new Date().toISOString() });

// ❌ Never query auth-protected tables from the marketing site
```

### PayFast CTAs (pricing page)

The pricing page can link to checkout URLs via Edge Function, but the user must be authenticated first — so the CTA redirects to the app:
```typescript
// Pricing page CTA → sends to app sign-up with plan pre-selected
href={`https://app.edudashpro.org.za/sign-up?plan=${tier}`}
```

---

## Styling Conventions

- **TailwindCSS utility classes** for all styling.
- CSS Modules (`.module.css`) only for landing page and complex animated layouts.
- Never use inline `style={{}}` for anything beyond dynamic values.
- Dark mode via Tailwind `dark:` prefix.
- Use `cn()` utility (`lib/utils`) for conditional class merging.

---

## File Naming

- Pages: `page.tsx` (Next.js App Router convention)
- Components: PascalCase (`TeacherCard.tsx`)
- Hooks: camelCase starting with `use` (`useTeacherDashboard.ts`)
- Services: camelCase (`registrationService.ts`)
- Types: PascalCase in `types/` folder

---

## Shared Utilities

- `src/lib/utils/` — general helpers
- `src/lib/supabase/client.ts` — browser Supabase client (for email capture only)
- `src/lib/metadata/` — SEO metadata helpers for marketing pages

---

## Error & Empty States (mandatory for all data-fetching components)

```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;
if (!data?.length) return <EmptyState message="No teachers yet" />;
```

---

## Form Patterns

- Validate with **Zod** schemas.
- Show inline field errors.
- Disable submit button while `isLoading`.
- Never use `alert()` — use toast for success/error feedback.

---

## PDF Generation

Use `src/lib/utils/pdf-export.ts` for agent-driven PDF generation. The `generate-invoice-pdf` Edge Function handles server-side PDF rendering.

---

## Testing

```bash
npm test   # Jest
```

- Tests co-located or in `tests/`
- Mock Supabase client for unit tests
- Test user flows for each role

---

## Deployment

- **Web**: Vercel — auto-deploys on push to `main`
- Preview deploys on PRs
- Environment variables set in Vercel dashboard (never in code)

---

## Code Review Checklist

- [ ] Change is to a marketing page — if not, it belongs in `dashpro` not here
- [ ] No authenticated routes or app logic added
- [ ] App links use full `https://app.edudashpro.org.za/...` URLs, not relative paths
- [ ] File size limits respected (≤400 components, ≤500 pages, ≤200 hooks)
- [ ] No `console.log` / `alert()` in production code
- [ ] Zod validation on any form input (email capture, job applications)
- [ ] TypeScript types correct — run `npm run typecheck`
- [ ] No secrets committed
- [ ] SEO: meta tags present on all public pages
