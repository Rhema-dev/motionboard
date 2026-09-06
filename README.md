# MotionBoard

MotionBoard is a motion-first personal-finance dashboard built with Expo and React Native. Finance data gives every gesture a meaningful consequence: one transaction mutation updates the balance, chart, category mix, and activity ledger from a single source.

## Included interactions

- Animated SVG category chart
- Collapsing balance header
- Direction-aware swipe actions with spring settling
- Draggable transaction detail sheet
- Snapping, responsive budget controls
- Responsive mobile and desktop web layouts

## Run locally

```bash
npm install
npm run typecheck
npm run web
```

## Production web build

```bash
npm run build:web
```

The static site is exported to `dist/`. `vercel.json` configures the same build command and output directory for Vercel.

## Architecture

Zustand owns domain state. Pure functions derive summaries. Reanimated shared values own per-frame motion state. Data is deliberately mocked; there is no backend, authentication, payment flow, or real bank integration.
