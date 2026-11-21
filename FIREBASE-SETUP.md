# Firebase setup (use a NEW project, not Nanu Cart’s)
1. console.firebase.google.com → **Add project** (new name, e.g. alok-portfolio).
2. **Build → Authentication → Get started → Email/Password → Enable.**
3. **Build → Firestore Database → Create** (production mode, choose a region such as Mumbai asia-south1).
4. **Build → Storage → Get started** (same region). Storage may require the Blaze plan; if so, bookings still work without photos only if you remove the photo field — otherwise enable Blaze (free tier applies).
5. **Project settings → Your apps → Web (</>)** → register → copy the config. Copy `config/firebase-config.example.js` to `config/firebase-config.js` and paste the values.
6. **Create the first admin securely:** Authentication → Users → **Add user** (your email + strong password). Copy that user’s **UID**. In Firestore, create collection `admins`, document ID = the UID, with any one field (e.g. `role: "owner"`). There is no public sign-up page, and the web can never write to `admins`.
7. Firestore → **Rules** → paste `firebase/firestore.rules` → Publish. Storage → **Rules** → paste `firebase/storage.rules` → Publish.
8. Authentication → Settings → **Authorized domains** → add `YOUR-USERNAME.github.io`.
9. **App Check (recommended anti-abuse):** Build → App Check → register your web app with reCAPTCHA v3, put the site key in `appCheckSiteKey`, then enforce for Firestore and Storage after testing.
10. In `config/site-config.js` set `firebaseEnabled: true`. Open `/admin/` and sign in.

Optional email alerts: create an EmailJS account/template, then fill `emailjs` in `site-config.js` (public keys only; never SMTP passwords).
