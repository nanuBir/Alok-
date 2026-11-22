// Bump VERSION when you change files, so visitors get the update.
const VERSION = 'v2';
const CACHE = 'alok-' + VERSION;
const SHELL = ['./','index.html','offline.html','404.html','manifest.webmanifest',
  'style.css','main.js','site-config.js',
  'alok-hero.jpg','icon-192.png','icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(x => c.add(x).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('alok-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  // Only same-origin GETs. Firebase / EmailJS / admin pages are never cached (private data stays out).
  if (r.method !== 'GET' || u.origin !== location.origin || /admin\.(html|js)$/.test(u.pathname)) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('offline.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {
    if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })));
});
