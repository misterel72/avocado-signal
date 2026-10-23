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

No prospect data, draft notes or emails have been imported or sent. Existing Firebase workbook projects, the Astro production website and Apps Script Command Centre are unchanged.

## Remaining activation

1. Complete GitHub sign-in to the existing Netlify account in the browser tab prepared for this task.
2. Create a separate Netlify pilot site; preserve the existing site's production settings and DNS. Use the pilot folder as base, `npm ci && npm run build` as build command, and `dist` as publish directory. Alternatively upload the separately packaged cloud build to a new site.
3. Set the four `VITE_FIREBASE_*` build variables if using repository builds. The values exist locally in the ignored `.env.local`; never add Firebase admin keys.
4. Add the exact new Netlify hostname to Firebase Auth's authorized domains. Preserve the existing domains. Confirm the backend's domains directly; do not assume declaring `authorizedDomains` locally applies them.
5. Verify real Google sign-in, owner membership, prospect creation, update and persistence, denied unapproved access, sign-out, desktop/mobile rendering and CSV download on the hosted pilot.
6. Install/open Antigravity, sign in, and open this folder using the scoped brief. Antigravity was not found on PATH or in the inspected Windows uninstall entries; it has not been run or configured.

Google account credentials and the one-time authorization code must not be placed in the repository. Local provisioning configuration and owner data are under ignored paths and are excluded from deliverable source archives.

The Google account login code was consumed successfully. There is no need to reuse it.
