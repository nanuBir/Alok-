// Bump VERSION when you change files, so visitors get the update.
const VERSION = 'v1';
const CACHE = 'alok-' + VERSION;
const SHELL = ['./','index.html','offline.html','404.html','manifest.webmanifest',
  'assets/css/style.css','assets/js/main.js','config/site-config.js',
  'assets/images/alok-hero.jpg','assets/icons/icon-192.png','assets/icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('alok-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  // Only same-origin GETs. Firebase / EmailJS / admin pages are never cached (private data stays out).
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.includes('/admin/')) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('offline.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {
    if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })));
});
