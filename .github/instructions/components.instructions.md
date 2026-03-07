---
applyTo: "src/components/**/*.{tsx,ts}"
---

# Web Components Instructions

## File Size Limits (WARP.md — NON-NEGOTIABLE)
- Components: ≤400 lines (excluding CSS/styles)
- Hooks: ≤200 lines — split into subfolder with barrel `index.ts` when exceeded
- Type definitions: ≤300 lines (except auto-generated)

## When to Split
Split immediately if ANY apply:
- File exceeds size limits
- File has 3+ distinct responsibilities
- Multiple developers frequently cause merge conflicts

## Code Organization
- Extract logic into custom hooks; keep UI components pure
- Use Container/Presentational pattern
- Place reusable primitives in `components/ui/`

## Access Control
- Always check role before rendering restricted UI
- Never hardcode role string comparisons — use profile.role checks with explicit constants

## AI Integration
- Never call AI APIs directly from client
- Always use `ai-proxy` Edge Function
