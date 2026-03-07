# Copilot Instructions — EduDash Pro Web Portal

## Project Overview

**EduDash Pro Web** is the Next.js web portal for EduDash Pro — a multi-tenant, AI-powered educational platform for South African schools and preschools. It shares a Supabase backend with the React Native mobile app (`../dashpro`).

**Stack:**
| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | TailwindCSS 4 |
| Backend | Supabase (PostgreSQL + RLS + Auth + Edge Functions) |
| State | TanStack React Query 5 |
| AI | Claude (Anthropic) via `ai-proxy` Edge Function |
| Payments | PayFast (South Africa) via `payfast-create-payment` Edge Function |
| i18n | `react-i18next`, 9 languages: en, af, zu, st, nso, fr, pt, es, de |
| Error tracking | Sentry (`@sentry/nextjs`) |

**Multi-tenant model:** Every school is a tenant (`preschool_id` / `organization_id`). All Supabase tables enforce RLS. Super-admins bypass RLS via service role.

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

## Route Structure

```
src/app/
├── page.tsx / page.module.css     # Landing page
├── sign-in/                       # Email/password + Google OAuth
├── sign-up/
│   ├── principal/                 # 4-step org registration
│   ├── teacher/                   # With invite code support
│   ├── parent/                    # With org selection, standalone support
│   ├── organization/              # Org type selector
│   ├── verify-email/
│   └── pending-approval/
├── auth-callback/                 # Supabase magic links, PKCE, OAuth
├── forgot-password/
├── reset-password/
├── dashboard/                     # Role-based redirect hub
│   ├── page.tsx                   # Routes by role
│   ├── teacher/
│   ├── principal/
│   ├── parent/
│   ├── student/                   # TODO: implement web learner dashboard
│   └── admin/
├── invite/teacher/, member/, executive/
├── pricing/                       # PayFast integration
├── exam-prep/                     # Standalone CAPS exam prep
├── admin/                         # Super-admin tools
└── api/                           # 14 API route directories
```

---

## Key Architectural Patterns

### 1. Authentication & Supabase Client

```typescript
// Browser (client components)
import { createClient } from '@/lib/supabase/client';

// Server (server components, API routes)
import { createClient } from '@/lib/supabase/server';
```

- Auth handled via `@supabase/ssr` — use `createClient()` from the appropriate module.
- Session cookies managed by middleware at `src/middleware.ts`.
- Role-based routing in `src/app/dashboard/page.tsx` — reads `profiles.role` and redirects.

### 2. Role-Based Access

User roles: `super_admin`, `principal`, `teacher`, `parent`, `student`

```typescript
// Always check role before rendering or executing
const { data: profile } = await supabase
  .from('profiles')
  .select('role, organization_id, preschool_id')
  .eq('auth_user_id', user.id)
  .single();

if (profile.role !== 'principal') redirect('/dashboard');
```

### 3. Data Fetching — React Query

```typescript
export function useTeachers(orgId: string) {
  return useQuery({
    queryKey: ['teachers', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('preschool_id', orgId);
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}
```

### 4. Edge Function Calls

```typescript
const supabase = createClient();
const { data, error } = await supabase.functions.invoke('ai-proxy', {
  body: { messages, service_type: 'chat_message', model: 'claude-haiku-4-5-20251001' },
});
```

### 5. Invite Deep Linking

Invite routes detect platform (iOS/Android/desktop) and deep-link to native app:
- Teacher: `edudashpro:///screens/teacher-invite-accept?token=...&email=...`
- Member: `edudashpro:///invite/member?code=...`
- Executive: `edudashpro:///invite/executive?code=...`
- Fallback: web sign-in/sign-up with pending invite in `localStorage`.

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

## Shared Utilities (avoid reinventing)

- `src/lib/utils/` — general helpers
- `src/lib/supabase/client.ts` — browser Supabase client
- `src/lib/supabase/server.ts` — server Supabase client
- `src/lib/ai/capabilities.ts` — AI tier/capability matrix
- `src/lib/hooks/useUserProfile.ts` — current user profile + school context
- `src/lib/hooks/useAIQuota.ts` — AI usage tracking
- `src/lib/auth/recoveryFlow.ts` — password recovery detection

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

- [ ] File size limits respected (≤400 components, ≤500 pages, ≤200 hooks)
- [ ] No `console.log` / `alert()` in production code
- [ ] All data fetching has loading, error, and empty states
- [ ] RBAC: role checked before rendering restricted UI
- [ ] Multi-tenant: queries filtered by `organization_id` / `preschool_id`
- [ ] AI calls go through `ai-proxy` Edge Function, not directly
- [ ] Storage paths stored, not signed URLs
- [ ] Zod validation on all user input
- [ ] TypeScript types correct — run `npm run typecheck`
- [ ] No secrets committed
