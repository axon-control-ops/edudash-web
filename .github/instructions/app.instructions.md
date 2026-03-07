---
applyTo: "src/app/**/*.{tsx,ts}"
---

# Next.js App Router Instructions

## File Size Limits (WARP.md — NON-NEGOTIABLE)
- Pages (page.tsx): ≤500 lines
- Layout files: ≤200 lines
- Route handlers (route.ts): ≤300 lines

## Page Pattern
Every page that fetches data must have loading, error, and empty states:
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;
if (!data?.length) return <EmptyState message="..." />;
```

## Auth & Role Guards
- Server components: check session via `createClient()` from `@/lib/supabase/server`
- Redirect unauthenticated users to `/sign-in`
- Redirect wrong-role users to their correct dashboard
- Never trust client-supplied role — always fetch from `profiles` table

## Forms
- Validate with Zod
- Show inline field errors
- Disable submit while processing
- **Never use `alert()`** — use toast notifications

## Logging
- Never use `console.log` in production
- Use Sentry for error reporting
