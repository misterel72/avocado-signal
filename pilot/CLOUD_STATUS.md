# Pilot cloud status · 23 October 2026

## Provisioned and verified

- Firebase project: `avocado-signal-pilot-m72` (Avocado Signal Pilot).
- Web app: `1:194614276261:web:e48551cd24bc07a8de1d4c`.
- Firestore database: `(default)`, Standard edition, `europe-west2` (London), free tier enabled. No billing account was attached during setup.
- Google sign-in configuration deployed through Firebase's provisioning workflow.
- The owner's verified Google identity was provisioned as a single Firebase Auth user and checked with a targeted account lookup.
- The corresponding `pilotMembers` document exists with `enabled: true`.
- Deployed Firestore rules were retrieved through Firebase MCP and match the tested rules in this folder.
- The local `.env.local` is configured for this project and a production build succeeds.
- The pilot is published at `https://avocado-signal-pilot.netlify.app/` through a separate Netlify project using branch `codex/firebase-pilot`, base directory `pilot`, and publish directory `dist`.
- Firebase Auth's exact authorized-domain list was checked after adding `avocado-signal-pilot.netlify.app`; the existing Firebase domains were retained.
- Hosted demo creation, search and persistence across a page reload were verified in Chrome with fictional tab-local data. A desktop screenshot is saved with the task outputs.
- Mobile review found an accessibility-label positioning issue that widened the document; the scroll container now establishes a positioning context. On the corrected live deployment, the document width is 375 px at a 390 px viewport, so there is no page-level horizontal overflow.
- A live unauthenticated Firestore read attempt was rejected with `permission-denied`.
- Regression tests now cover delayed Firebase auth callbacks so demo mode is retained and delayed cloud responses cannot replace demo records.

No prospect data, draft notes or emails have been imported or sent. Existing Firebase workbook projects, the Astro production website and Apps Script Command Centre are unchanged.

## Remaining activation

1. Complete account selection in the Google sign-in popup. The Google chooser loaded the correct owner account, but its renderer did not respond to automated input. A completed browser sign-in is not yet verified.
2. Verify real Google sign-in, cloud prospect creation/update/persistence, denied unapproved access and sign-out on the hosted pilot. The prior emulator rule tests passed; they do not substitute for real browser sign-in.
3. Complete final hosted verification of the auth-callback timing correction.
4. Install/open Antigravity, sign in, and open this folder using the scoped brief. Antigravity was not found on PATH or in the inspected Windows uninstall entries; it has not been run or configured.

Google account credentials and the one-time authorization code must not be placed in the repository. Local provisioning configuration and owner data are under ignored paths and are excluded from deliverable source archives.

The Google account login code was consumed successfully. There is no need to reuse it.
