---
applyTo: "src/lib/**/*.{ts,tsx}"
---

# Library (src/lib/) Instructions

## File Size Limits (WARP.md — NON-NEGOTIABLE)
- Services/Utilities: ≤500 lines
- Hooks: ≤200 lines
- Type definitions: ≤300 lines (except auto-generated)

## Supabase Clients
- Browser: `import { createClient } from '@/lib/supabase/client'`
- Server: `import { createClient } from '@/lib/supabase/server'`
- Never use service role key client-side

## AI Integration
- Never call AI APIs directly — always via `ai-proxy` Edge Function
- Reference `src/lib/ai/capabilities.ts` for tier/capability matrix
- Check quota via `src/lib/hooks/useAIQuota.ts` before every AI request

## Storage
- Always store paths, never signed URLs
- Generate signed URLs on-demand at display time only

## Security
- Never expose service role keys client-side
- Maintain RLS policies for tenant isolation
- Validate all external input with Zod
