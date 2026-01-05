# Layout Spec: New-Tab Dashboard

## Layout Ratios

- Background: full-bleed, teal/blue-green gradient + subtle noise/vignette.
- Content container: max-width 1200–1360px, centered with top padding 48–72px.
- Time block: centered, large text (64–96px), line-height 1, date below at 12–14px.
- Search bar: centered, width 460–640px, height 40–48px, radius 999px.

## Grid System

- Desktop: 8 columns (preferred) or 6 columns when narrow.
- Gap: 12–16px.
- Row height: 96–120px.
- Cards span:
  - 1x1: 1 col x 1 row
  - 2x1: 2 col x 1 row
  - 2x2: 2 col x 2 row
  - 3x2: 3 col x 2 row (optional)

## Tile Style

- Surface: white or near-white (#f8fafc).
- Shadow: soft (e.g., 0 8px 24px rgba(0,0,0,0.12)).
- Radius: 12px.
- Border: optional 1px rgba(0,0,0,0.04).

## Sample Tile Config

Use this structure to define tiles and render via a map:

```
{
  id: string
  title: string
  icon: ReactNode
  size: "1x1" | "2x1" | "2x2" | "3x2"
  variant: "metric" | "link" | "media" | "note" | "clock"
}
```

Example list:

```
[
  { id: "clock", title: "Time", size: "1x1", variant: "clock" },
  { id: "weather", title: "Weather", size: "2x1", variant: "metric" },
  { id: "calendar", title: "Calendar", size: "2x2", variant: "note" },
  { id: "music", title: "Music", size: "2x1", variant: "media" },
  { id: "link-1", title: "GitHub", size: "1x1", variant: "link" }
]
```

## Animation

- Use a short fade + translateY (6–10px) on load.
- Stagger tiles by 30–50ms if easy.

## Accessibility

- Ensure 4.5:1 contrast for text on card surfaces.
- Provide focus rings on tiles and search input.
