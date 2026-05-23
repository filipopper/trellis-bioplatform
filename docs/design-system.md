# Design System & CSS

## Current style entrypoint
- `client/styles/index.css` is the only stylesheet linked from HTML.
- It imports reset, tokens/base, layout, and feature styles.

## Token usage
- Prefer existing CSS variables in `core.css` (`--c-*`, `--sp-*`, `--fs-*`, `--shadow-*`, `--radius-*`).
- Avoid hardcoded values when equivalent tokens exist.

## Conventions
- Reuse existing utility/semantic classes before adding new selectors.
- Keep specificity low and avoid chained selectors unless required.
- Remove duplicate/unused CSS when features are removed.
