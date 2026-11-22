// Paste the values from Firebase Console > Project settings > Your apps > Web app.
// These web keys are public identifiers, NOT secrets. Security comes from firestore.rules, storage.rules and App Check.
// NEVER paste service-account JSON or private keys here.
export default {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  // App Check (reCAPTCHA v3 site key). Leave "" until you register it.
  appCheckSiteKey: ""
};
