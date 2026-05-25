# Wiki Resource Resolution

## Article location
Wiki article resources must live under:

- `client/app/features/wiki/articles/<slug>/article.json`
- `client/app/features/wiki/articles/<slug>/content.md`

Each article folder name must match the registry `slug`.

## Registry contract
`client/app/features/wiki/registry.js` defines article identity and editorial metadata only:

- `slug`
- `title`
- `description`
- `aliases`, `tags`, `category`, `related`, etc.

The registry must **not** contain raw filesystem fetch paths.

## Runtime URL resolution
`client/app/features/wiki/wiki-paths.js` resolves resource URLs with:

- `new URL('./articles/', import.meta.url)` as stable feature base
- `resolveWikiResourceUrl(slug, fileName)` for `article.json` and `content.md`

This avoids fragile `fetch('./relative/path')` behavior tied to document URL and keeps route changes (`#/wiki/...`) safe.

## Error diagnostics
`WikiService.loadArticle()` reports scoped diagnostics for:

- invalid slug/resource resolution
- non-OK HTTP responses (includes URL + status)
- JSON parse failures
- markdown read failures
- fetch-level exceptions

Failed loads gracefully return `kind: 'error'` so the view can render fallback UI.

## Adding a new article safely
1. Add folder: `client/app/features/wiki/articles/<slug>/`
2. Add `article.json` and `content.md`
3. Add metadata entry with same `slug` in `registry.js`
4. Link from content using `[[Article Title]]` or alias

If any resource is missing, runtime diagnostics will include the failing URL and status.
