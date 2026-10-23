# Avocado Signal pilot

This folder is an isolated Firebase pilot. The repository root is the existing public Astro website. Make pilot changes in this folder only.

- Keep the existing Astro site, Apps Script dashboard, Netlify production site and DNS unchanged.
- Use a separate Firebase project on Spark. Do not attach billing, provision paid services, or migrate production data.
- Use Google sign-in and the explicit `pilotMembers/{uid}.enabled` allowlist. Membership must be provisioned by an administrator; clients cannot grant access.
- Use fictional demo data until the owner approves importing real records. Never commit prospect exports, credentials, `.env` files or Firebase admin keys.
- There is no outbound email service. Keep sending disabled.
- Run `npm test`, `npm run build`, and the Firestore emulator tests before cloud activation. Document any checks that could not run.
- Deploy only to a separate Netlify pilot site with this folder as its base directory. Do not change the existing website's Netlify settings.
- Antigravity is the development tool, GitHub the source of truth, Netlify the static host, Firebase Auth and Firestore the backend.
