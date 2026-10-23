# Pilot validation · 23 October 2026

Completed:

- `npm test`: 5 passing tests covering follow-up and value calculations, date/value/link validation, CSV escaping, demo creation and editing, filtering, suppression, draft visibility, sign-out and pending sign-in feedback.
- `npm run test:rules`: 4 passing Firestore Emulator tests covering unapproved/unverified/unauthenticated accounts, user isolation, capped queries, membership protections, immutable creation time, no deletion and schema validation.
- `npm run build`: Vite production build succeeds.
- Parent Astro website production build succeeds with telemetry disabled for the sandbox. Existing website source and configuration are unchanged.
- `npm audit --omit=dev`: zero vulnerabilities. The Firebase SDK's transitive gRPC package is overridden to patched 1.x.

Limits and outstanding work:

- Browser visual QA is outstanding. Local HTTP preview requests timed out; the browser URL policy also rejected opening the standalone file, so no rendered screenshot is supplied.
- DOM interaction tests use jsdom and dialog stubs; they do not verify rendering, responsive appearance, Google popup behavior or real cloud access.
- Firebase project, London database, Google sign-in configuration and owner membership have now been provisioned and verified; see `CLOUD_STATUS.md`. Netlify deployment and browser sign-in tests are still pending. No production data was copied.
- Antigravity instructions and a scoped project brief are prepared. Antigravity itself has not been installed, signed in or run.
- Firebase CLI has 7 development-only transitive audit findings (4 moderate, 3 high). It is not part of the deployed browser bundle. Review before broader CLI use.
- The Firebase browser bundle is approximately 579 KB before gzip. It is acceptable for this functional pilot; lazy loading is a possible later improvement.

This is a tested implementation for review and connection, not a completed live migration.
