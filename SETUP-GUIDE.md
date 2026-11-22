# Alok Portfolio — Simple Guide (Hindi/Hinglish)

Is ZIP ko extract karne par saari files ek hi folder mein aati hain. Koi subfolder nahi hai.

## 1. GitHub par daalna (mobile se)
1. github.com par login karein → **+ → New repository** → naam `alok-portfolio`, **Public** → Create.
2. Phone mein ZIP extract karein (Files app → ZIP par long-press → Extract).
3. Repository mein **Add file → Upload files** → extract hui **saari files select** karein → **Commit changes**.
   `index.html` sabse upar (main page) par dikhna chahiye, kisi folder ke andar nahi.
4. **Settings → Pages → Source: Deploy from a branch → main / (root) → Save.**
5. 1–2 minute baad site: `https://aapka-username.github.io/alok-portfolio/`
6. Admin page: `.../alok-portfolio/admin.html`

## 2. PWA (App ki tarah install)
- Chrome mein site kholein. Kuch second baad neeche **“Install app”** wala bar apne aap aayega. Na aaye to Chrome ⋮ → **Install app**.
- iPhone: Safari → Share → **Add to Home Screen**.
- Sirf HTTPS par chalta hai (GitHub Pages par automatic).
- File badalne ke baad `sw.js` mein `VERSION` (v2 → v3) badal dein, tab hi update dikhega.

## 3. Pehle bina Firebase ke kya chalta hai
Poori site, WhatsApp button (+91 86605 81728), call, install. Booking form aur review form ko save karne ke liye Firebase chahiye.

## 4. Firebase setup (naya project banayein)
1. console.firebase.google.com → **Add project**.
2. Authentication → Email/Password **Enable**.
3. Firestore Database → Create (production mode, Mumbai region).
4. Storage → Get started (photo ke liye; Blaze plan maang sakta hai, free limit milti hai).
5. Project settings → Web app (</>) register → config copy karke **firebase-config.js** mein paste karein.
6. Pehla admin: Authentication → Users → Add user (email + strong password). Uska **UID** copy karein. Firestore mein collection `admins` → document ID = wo UID → koi bhi ek field (jaise `role` = `owner`).
7. Firestore → Rules mein **firestore.rules** paste → Publish. Storage → Rules mein **storage.rules** paste → Publish.
8. Authentication → Settings → Authorized domains → `aapka-username.github.io` add karein.
9. **site-config.js** mein `firebaseEnabled: true` karein, aur `email` asli email se badlein (`emailIsDemo: false`).
10. `admin.html` kholein, sign in karein.

## 5. Customer review kaise lein
Site par **Reviews** section mein customer apne saamne form bharta hai. Review pehle “Waiting” rehta hai. Admin → **Reviews** → **Approve** dabate hi site par dikhta hai.

## 6. Dhyan dein
- Firebase keys `firebase-config.js` mein public hoti hain, suraksha rules se aati hai. Koi private key/password yahan na daalein.
- Customer ka naam/logo/photo uski permission ke baad hi dikhayein.
- Photo badalni ho to `alok-hero.jpg` ko usi naam ki nayi photo se replace karein.
- Push notification abhi nahi hai.
