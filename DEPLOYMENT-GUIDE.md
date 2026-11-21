# Deploy to GitHub Pages (Android phone friendly)
1. Install/open Chrome, sign in at github.com → **+ → New repository** (e.g. `alok-portfolio`, Public) → Create.
2. Unzip the project on your phone (Files app → long-press the ZIP → Extract).
3. In the repository tap **Add file → Upload files**, then choose the extracted files and folders. (If folders won’t upload, switch Chrome to “Desktop site”, or use the GitHub mobile app / a free app like Termux.) Make sure `index.html` is at the top level. Tap **Commit changes**.
4. **Settings → Pages → Source: Deploy from a branch → main / (root) → Save.**
5. After about a minute the site is at `https://YOUR-USERNAME.github.io/alok-portfolio/`. Admin: `.../alok-portfolio/admin/`.
6. All paths are relative, so the repository subpath works. Add the site address to Firebase authorized domains.
7. Install on Android: open the site in Chrome → ⋮ → **Install app**.
