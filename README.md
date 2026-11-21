# Alok — Weighing Scale Expert (portfolio + installable PWA)

Static site (HTML/CSS/JS, no build step) for GitHub Pages, with an optional Firebase backend for bookings and an admin dashboard.

## Structure
- `index.html`, `offline.html`, `404.html` — public pages
- `assets/css/style.css`, `assets/js/main.js` (page + booking), `assets/js/fb.js` (loads Firebase only when enabled)
- `assets/images/alok-hero.jpg` — **hero photo. To change it, replace this file with another JPG of the same name.**
- `admin/` — admin dashboard (sign-in required, not indexed)
- `config/site-config.js` — WhatsApp number, **demo email**, feature switches, optional EmailJS keys
- `config/firebase-config.example.js` — copy to `firebase-config.js`
- `firebase/firestore.rules`, `firebase/storage.rules` — paste into Firebase Console
- `manifest.webmanifest`, `sw.js`, `assets/icons/` — PWA

## What works without any setup
Full public site, WhatsApp buttons (+91 86605 81728, pre-filled message), call/email links, install-to-home-screen, offline page. The booking form validates, and “Send via WhatsApp” works. “Submit enquiry” says honestly that online saving is not set up until you finish `FIREBASE-SETUP.md`.

## Still needs you
1. Replace `hello@example.com` in `config/site-config.js` and set `emailIsDemo: false`.
2. Create a new Firebase project (FIREBASE-SETUP.md).
3. Optional: EmailJS keys for email alerts; App Check key.
4. Publish real field-work projects and customer logos (with permission) from the admin.

## PWA notes
- Needs HTTPS (GitHub Pages provides it). On Android Chrome: menu ⋮ → **Install app** (or the “Install app” button on the site).
- After changing files, edit `VERSION` in `sw.js` (v1 → v2) so visitors get the update.
- Private data is never cached: the service worker ignores `/admin/` and all Firebase/EmailJS requests.
- Troubleshooting: if changes don’t appear, bump `VERSION`, then close and reopen the app. If “Install” is missing, check you are on HTTPS and the icons load.
- Push notifications are **not** implemented.
