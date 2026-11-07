# Vidzim delivery checklist

## Build the URL-first downloader experience

- [x] Vidzim is a web app with the product name visible in the brand header.
- [x] The primary workflow accepts a video URL as the main input.
- [x] The interface validates malformed or empty URLs and explains what to fix.
- [x] The interface recognizes common platform hostnames and displays a source label.
- [x] A valid URL produces a format-selection panel with resolution, file type, estimated size, and a primary download action.
- [x] The interface shows scanning and queued/download feedback states.
- [x] The interface presents recent download items in a compact activity rail.
- [x] The layout is responsive for mobile and desktop widths.
- [x] The UI includes clear permitted-use / no-DRM-bypass language.

## Preserve a safe production boundary

- [x] The first pass keeps source resolution behind a future backend seam rather than pretending to bypass platform controls.
- [ ] Connect a production resolver for sources the user owns or is authorized to download.
- [ ] Add server-side source validation, rate limiting, and response streaming for permitted direct media sources.
- [ ] Persist recent downloads only if a database and user account experience are intentionally added.

## Validation and handoff

- [ ] Run typecheck and production build.
- [ ] Start the Preview server and verify `/api/health` plus the route manifest.
- [ ] Save a checkpoint after the final implementation.
