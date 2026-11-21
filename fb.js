// Loads Firebase only when SITE.firebaseEnabled is true and config/firebase-config.js exists.
const V = '10.12.2', CDN = `https://www.gstatic.com/firebasejs/${V}/`;
let cached;
export async function getFirebase() {
  if (cached) return cached;
  cached = (async () => {
    const cfg = (await import('../../config/firebase-config.js')).default;
    const app = await import(CDN + 'firebase-app.js');
    const fs = await import(CDN + 'firebase-firestore.js');
    const st = await import(CDN + 'firebase-storage.js');
    const au = await import(CDN + 'firebase-auth.js');
    const a = app.initializeApp(cfg);
    if (cfg.appCheckSiteKey) {
      const ac = await import(CDN + 'firebase-app-check.js');
      ac.initializeAppCheck(a, { provider: new ac.ReCaptchaV3Provider(cfg.appCheckSiteKey), isTokenAutoRefreshEnabled: true });
    }
    return { fs, st, au, db: fs.getFirestore(a), storage: st.getStorage(a), auth: au.getAuth(a) };
  })();
  return cached;
}
