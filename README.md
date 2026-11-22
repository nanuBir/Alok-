# Alok — Weighing Scale Expert & Technical Consultant

A responsive personal portfolio and installable PWA, designed using the modular, mobile-first spirit of the supplied Nanu Cart project: separate HTML, CSS and JavaScript, a glassy sticky header, rounded cards, clear section hierarchy and a mobile quick-action bar. The visual identity is deliberately distinct: midnight navy, technical blue, warm white and restrained brass accents.

## Included
- `index.html` — public portfolio and service enquiry form.
- `style.css` — complete responsive visual theme.
- `app.js` — navigation, WhatsApp enquiry hand-off and install prompt.
- `alok-portrait.png` — supplied real portrait.
- `manifest.webmanifest`, `sw.js`, `offline.html` — PWA installation and offline shell.
- `admin.html` — Firebase email/password sign-in, booking list/status changes and text project publishing controls.
- `` — Firestore and Storage rules.
- `firebase-config.example.js` — Firebase configuration template.

## Deploy on GitHub Pages (Android-friendly)
1. Extract the ZIP on your phone.
2. Create a new GitHub repository, for example `alok-portfolio`.
3. Upload the **contents** of the `alok-portfolio` folder to the repository root (so `index.html` is at the root, not nested one folder deeper).
4. In repository Settings → Pages, choose Deploy from a branch, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish. Open the HTTPS URL.
6. In Android Chrome, open the site menu and choose **Install app** or **Add to Home screen** when offered.

The manifest and service-worker use relative paths and `./` scope so a GitHub Pages project subpath can work. If you rename the repository or deploy under a different path, retest the manifest and offline caching.

## Firebase
Read `FIREBASE-SETUP.md` before enabling the admin dashboard. It must use a brand-new Firebase project separate from Nanu Cart. The Firebase config file is included with placeholders; replace them with the web config from your new project. Never commit private service-account keys.

## Important current limitations
- The public form currently creates a WhatsApp message; it does not claim to persist the enquiry to Firebase. Follow the Firebase setup guide to wire a secure Firestore write and App Check.
- The admin starter supports email/password login, booking status updates and text-only project entries. Photo upload UI, email automation and automatic WhatsApp notifications are not configured.
- `hello@example.com` is not displayed as a working contact email. No email was supplied.
- The service project gallery is intentionally empty until real, approved work is added.
- No fake client logos, testimonials, certifications or project records are included.
- Contech Scale Company is mentioned only as current employment, with a personal-portfolio disclaimer. This is not an official company website or endorsement.

## Change details
- WhatsApp number and hero copy: `index.html` and `app.js`.
- Hero photo: replace `alok-portrait.png` while keeping the same filename, or update its path in `index.html` and `sw.js`.
- Colours and complete theme: `style.css`.
