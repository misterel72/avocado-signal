# Avocado Signal · Firebase pilot

An isolated sales workspace beside the existing Astro marketing site. It does not replace or modify the Apps Script Command Centre. The pilot starts with fictional, tab-local demo data, or connects to a separate Firebase project using Google Authentication and Cloud Firestore.

## What works

- Prospect creation and editing, contact details, concept links, notes and potential value in GBP.
- Pipeline stages, active pipeline totals and follow-ups due today or overdue. Dates use Asia/Qatar.
- Draft subject/body editing. Suppressed contacts are excluded from follow-ups, active totals and draft listings. They remain visible in All prospects.
- CSV export of loaded records with formula injection protection. Cloud reads are capped at the 200 most recently updated records and the UI explicitly marks truncation.
- Firestore rules deny access by default, require verified accounts and administrator-approved membership, validate records, prevent cross-user access and prevent client deletion.
- Demo changes use sessionStorage. Reloading the same tab retains them; closing the tab clears them. They never upload to Firebase.

The pilot has no email-sending service, Gmail permission, production-data import, automatic migration or paid backend functions.

## Local run

Use Node 22.12+ or 24+.

```sh
cd pilot
npm ci
npm run dev
```

Choose **Explore the demo**. Demo mode needs no Firebase account or environment configuration.

```sh
npm test
npm run build
```

## Connect the cloud pilot

The task's isolated cloud backend has now been provisioned; see `CLOUD_STATUS.md`. Hosting and end-to-end sign-in checks remain pending. The instructions below are retained for a fresh setup; reuse the existing pilot rather than creating another project. Keep the no-cost **Spark** plan and do not attach a billing account. Authentication and Firestore have usage limits; Spark is not a promise of unlimited capacity.

1. Enable **Authentication → Google** for your own Google account and select the support email.
2. Create a **Cloud Firestore Standard** database in production mode. Select the location before creating it; use the region appropriate to your data and users.
3. Register a web app in the pilot project. Copy `.env.example` to `.env.local` and fill the four web configuration values. These identifiers are browser-visible; security comes from the rules and membership allowlist. Never put a service-account key in a Vite variable.
4. With Firebase CLI signed into the owning account, deploy only these rules and indexes, explicitly naming the pilot project:

   ```sh
   npx firebase login
   npx firebase deploy --only firestore:rules,firestore:indexes --project YOUR_PILOT_PROJECT_ID
   ```

5. Restart the dev server. Sign in once. The pilot will deny access and show your Firebase user ID. In the Firebase console, create document `pilotMembers/YOUR_USER_ID` with boolean field `enabled: true`. This is an intentional administrator action. Sign in again.
6. Add one fictional record. Refresh, sign out and sign back in to verify persistence. Try another unapproved account and confirm it cannot access records. Test in two approved accounts and confirm records remain separate.

An empty Firebase workspace stays empty until you add records; demo data is never seeded into the cloud. Repeated reads use an explicit Refresh button rather than live subscriptions to keep the pilot's usage modest. Membership is checked by Firestore rules on each request.

## Separate Netlify deployment

Create a **new** Netlify site from this branch/repository, with **base directory `pilot`**, build command `npm ci && npm run build`, and publish directory `dist` relative to that base. The `pilot/netlify.toml` file contains these settings and noindex/security headers. Do not reconfigure the current Netlify site, change the production branch, merge this pilot for deployment, or alter DNS.

Set the four `VITE_FIREBASE_*` values in the new site's build environment. Add its exact host to Firebase Authentication's authorized domains, then redeploy. Vite embeds environment values at build time. No billing or domain changes are required to use the separate Netlify subdomain. Netlify's current account/plan limits must be checked before deployment.

The sign-in page and app shell are static public assets; prospect data is private behind Firebase rules. A noindex header is not an access control. Do not place private data in the static bundle.

## Antigravity

Open **this `pilot` folder only** as an Antigravity project, using the official Antigravity app or IDE. Sign in yourself. If the Firebase integration is enabled, grant it access only to the pilot Firebase project. Read `AGENTS.md` and use `ANTIGRAVITY_PROMPT.md` as the initial brief. No Antigravity account was signed in or configured during this build.

## Rule tests

With Java 21+ available:

```sh
npm run test:rules
```

This uses the explicit `demo-avocado-pilot` emulator project. It does not touch a live Firebase project. The tests cover unauthenticated access, unapproved/unverified users, cross-user access, membership changes, query limits, record deletion, timestamp integrity and field validation.

## Reference documentation

- [Google Antigravity: Build with Google](https://antigravity.google/docs/build-with-google)
- [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

The existing marketing site's dependencies are untouched. The pilot overrides the Firebase SDK's transitive gRPC dependency to a patched compatible 1.x release. The Firebase CLI is development-only; its remaining transitive audit findings must be reviewed before using it beyond this local pilot.
