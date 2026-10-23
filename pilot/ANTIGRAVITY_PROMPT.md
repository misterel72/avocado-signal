# Continue the Avocado Signal Firebase pilot

Read AGENTS.md and README.md in this folder. This is an isolated Vite sales dashboard pilot inside the avocado-signal repository; the parent folder contains the existing Astro marketing website.

Review the existing implementation before changing it. Use the Firebase integration only with a separately confirmed pilot project. Keep the project on Spark with no billing account. Keep all email sending disabled and use fictional records until real-data import is explicitly approved.

First confirm that `npm test`, `npm run build` and `npm run test:rules` pass. Then connect the app to the new pilot project's Google Authentication and Firestore. Verify approved sign-in, denial of unapproved sign-in, isolation between two users, record creation and update, refresh and sign-out behavior, suppression, CSV export, and mobile layout.

Deploy to a new Netlify pilot site using `pilot` as the base folder. Do not change the existing Netlify site, Apps Script Command Centre, production branch or DNS. Report the pilot URL, exact Firebase project ID, completed checks and any remaining issues. Never claim account setup, a deployment or a test succeeded without checking the result.
