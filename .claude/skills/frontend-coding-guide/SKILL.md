---
name: FE Coding Guide
description: Build or refactor frontend apps using Next.js (App Router) with shadcn/ui + Tailwind CSS, SWR data fetching, and Zustand state management. Use when implementing dashboard/start-page/new-tab tile UIs (首页/新标签页/起始页), or when the stack must be constrained to Next.js + shadcn + SWR + Zustand.
---

# Next.js Shadcn SWR Zustand

## Overview

Constrain architecture, state, and UI design when building Next.js frontends with shadcn/ui + Tailwind, SWR, and Zustand. Produce a clean, card-based start-page layout (grid tiles + time + search) similar to a new-tab dashboard.

## Workflow

1. Confirm scope and data sources.
2. Apply architecture constraints (App Router, SWR, Zustand, shadcn).
3. Apply UI constraints (new-tab dashboard layout + card grid).
4. Implement page and components with Tailwind + shadcn.
5. Verify responsiveness and visual fidelity to the reference.

## Architecture Constraints

Use and enforce the following:

- Use Next.js App Router (app directory) with TypeScript.
- Use Tailwind CSS for all styling; no CSS modules, no styled-components.
- Use shadcn/ui components from `components/ui` and `cn` from `lib/utils`.
- Use SWR for client-side data fetching; prefer a `/app/api/*` route for mock/real data.
- Use Zustand for global UI state (layout mode, tile config, user prefs). Keep it small and typed.
- Use server components for layout and static shells; use client components only when needed for SWR/Zustand.
- Keep data and UI decoupled: `lib/data` for fetchers, `stores/` for Zustand, `components/` for UI.

Suggested structure (adjust to repo conventions):

- `app/(home)/page.tsx` for the dashboard page.
- `components/tiles/*` for tile cards.
- `lib/fetchers/*` for SWR fetchers.
- `stores/useDashboardStore.ts` for Zustand.

## UI Constraints: New-Tab Dashboard Look

Match the reference image’s visual intent:

- Background: textured/gradient teal/blue-green surface (subtle noise or vignette ok).
- Top center: large time (HH:mm), below it the date/weekday; use a lighter, airy font weight.
- Under time: a rounded search bar centered horizontally.
- Main grid: multiple tiles/cards with varied sizes (1x1, 2x1, 2x2), evenly spaced, subtle shadows.
- Cards: soft radius (10–14px), white or light surface, minimal borders, gentle drop shadow.
- Icons: use simple colorful icons; avoid heavy illustrations.
- Spacing: use 8px grid; padding 12–16; gaps 12–16.

Responsiveness:

- Desktop: 6–8 columns grid; center grid within max-width.
- Tablet: 4 columns.
- Mobile: 2 columns; stack time/search above grid; cards become 1-column width.

Behavior:

- Cards are clickable; hover lift + shadow.
- Search bar is focused on load if requested.
- Use subtle entry animation (fade/slide up) for tiles.

## Implementation Checklist

Follow this checklist when implementing:

- Use `app/layout.tsx` to set body background and base font.
- Build the top time/date/search section as a component.
- Build a tile grid component that accepts tile config data.
- Use SWR in client components for live widgets (clock, weather, etc.).
- Use Zustand for layout preferences (grid density, tile order).
- Use shadcn `Card`, `Input`, `Button`, `Badge` as base building blocks.

## Do / Don’t

- Do keep the UI airy with lots of negative space.
- Do keep cards consistent in style even if sizes vary.
- Do keep typography bold for time, light for supporting text.
- Don’t introduce additional state libraries (Redux, Jotai, etc.).
- Don’t use heavy gradients inside cards; keep surfaces clean.
- Don’t use CSS-in-JS or inline styles except for dynamic values.

## References

Consult `references/layout-spec.md` for detailed layout ratios, tile sizing hints, and example tile config data.
