# Firebase setup (separate project only)

The public portfolio and WhatsApp enquiry hand-off work without Firebase. The private admin dashboard and database-backed bookings require a new Firebase project.

1. Create a NEW project at https://console.firebase.google.com/. Do not reuse Nanu Cart's Firebase project.
2. Add a Web app in the new project and copy its Firebase web configuration.
3. Enable **Authentication → Email/Password**. Create Alok's admin user from the Firebase Console (do not add public registration).
4. Enable **Cloud Firestore** and create the database.
5. In the project folder, edit `firebase-config.js` and fill in the new project's web config using `firebase-config.example.js` as a reference.
6. Deploy `firestore.rules` and `storage.rules` using Firebase CLI or paste them into the Rules tabs in Firebase Console.
7. In Firestore, create a collection named `admins`. Add a document whose document ID is exactly the administrator user's Firebase Auth UID. The document can contain `{ "role": "admin" }`. Only do this for the intended admin account.
8. Enable Firebase Storage if you later add project photo uploads. The supplied starter admin supports booking status updates and text-only project entries; image upload management is a later extension and is not falsely presented as active.
9. Configure Firebase App Check before public production use. The rules limit public writes to validated booking creation; monitor abuse and add rate limiting through a trusted server/Cloud Function for stronger protection.
10. Test with a separate non-admin account: it must not read bookings or private customer data.

**Important:** The Firebase web config is intended for browser apps; it is not a private server credential. Never upload service-account JSON or private keys to GitHub Pages. Firestore rules are the security boundary. The example config is deliberately not connected.

## Booking behaviour

Once the real web config is added, the public form attempts a validated Firestore booking create, then opens WhatsApp with the same details. If Firebase is not configured, it still opens WhatsApp. Enable App Check, test the rules and monitor public write abuse before production. For stronger rate limiting, add a trusted server-side function.
