# Urgency Banners

## Files
- Config: `client/app/features/urgency-banner/config.js`
- Component: `client/js/components/urgency-banner.js`
- Persistence service: `client/app/features/urgency-banner/service.js`

## Add a banner
1. Add config object in `banners[]` with `id`, `selector`, `closeSelector`, `priority`, and `dismissMode`.
2. Add markup in HTML/view with matching selectors.
3. Optional: add countdown config:
   - `countdown: { selector: '.countdown', endsAt: '2026-10-01T00:00:00Z', expiredText: '00:00:00' }`

## Behavior
- Banners are sorted by priority.
- Dismissal supports `session` and `local` persistence.
- ESC closes visible banners.
