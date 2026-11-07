# Vidzim — implementation and design plan

## Scope

Vidzim is a web app centered on one action: paste a video URL and inspect the downloadable options for a source the user owns or is authorized to download. The first deliverable is a polished frontend MVP with client-side URL validation, platform recognition, deterministic format previews, download-state feedback, a recent-downloads strip, and a clearly stated permitted-use boundary. The source resolver remains an explicit backend seam; the MVP does not bypass DRM, paywalls, authentication, or platform controls.

## Implementation approach

- React + TypeScript frontend in `client/src`, using the existing Vite/Express/tRPC starter.
- `Home.tsx` owns the focused URL-to-download interaction, including URL parsing, supported-platform labeling, format selection, progress feedback, empty/error/success states, and local recent-item state.
- `index.css` provides a dark visual system with a warm off-white text color, ink-black surfaces, a lime signature accent, responsive layout, soft grid texture, and motion-safe microinteractions.
- `server/_core/index.ts` continues to expose the starter health endpoint. A future resolver can be added behind `/api/resolve` or a tRPC procedure without changing the primary UI contract.
- `public/manus-routes.json` declares the single `/` page route.

## Design direction

### Style options

1. **Signal terminal** — editorial dark utility with electric lime accents and precise status cues. (0.07)
2. **Soft gradient studio** — bright, glassy consumer SaaS with pastel gradients and rounded cards. (0.06)
3. **Neo-brutalist capture deck** — white canvas, hard black borders, oversized type and raw interaction blocks. (0.05)

**Chosen style: Signal terminal.**

- **Design movement:** contemporary developer-tool editorial design crossed with media-player control surfaces.
- **Core principles:** one obvious action; high contrast and fast scanning; show system state instead of hiding it; make trust and permissions visible.
- **Color philosophy:** ink-black backgrounds keep attention on the URL task; warm white avoids sterile blue SaaS; lime is ownable and reserved for actions/ready states; muted slate handles metadata without competing with the primary CTA.
- **Layout paradigm:** asymmetric editorial frame with a wide hero rail, a narrow right-side activity rail on desktop, and stacked panels on smaller screens; no centered dashboard grid.
- **Signature elements:** lime “play wedge” logo mark; thin bracketed labels; tiny status pulses and mono metadata rows.
- **Interaction philosophy:** every control gives immediate feedback—paste, scan, select, queue, download—with no ambiguous disabled states.
- **Animation:** 180–260ms ease-out transitions; subtle sheen on the primary button; progress shimmer only while scanning; respect `prefers-reduced-motion`.
- **Typography system:** `Space Grotesk` for display/UI text, `IBM Plex Mono` for URLs, labels, status, and metadata. Use uppercase eyebrow labels sparingly.
- **Brand essence:** “The fast handoff from link to file.” Personality: direct, focused, trustworthy.
- **Brand voice:** headlines are short and active; CTAs are verbs. Example lines: “Drop a link. Keep the moment.” / “Scan this source”.
- **Wordmark & logo:** lowercase `vidzim` with a custom lime wedge replacing the dot on the i, paired with a small `V` playmark in a rounded square.
- **Signature brand color:** signal lime `#D7FF4F`.

## Project structure

- `client/src/pages/Home.tsx` — main Vidzim experience and interaction state.
- `client/src/index.css` — theme tokens, layout, component styling, responsive states.
- `client/src/App.tsx` — route composition and app providers.
- `client/index.html` — document title and font imports.
- `public/manus-routes.json` — route manifest for the single-page app.
- `server/_core/index.ts` — existing server shell and health endpoint; future resolver seam.
- `TODO.md` — outcome-based delivery tracking.

## Constraints

- The app should not imply that all platforms can be downloaded regardless of restrictions.
- The first UI may use demo format data for a valid URL; production resolver behavior requires a source-specific, legally permitted backend implementation.
- No login or database is needed for this first pass.
