import { getFirebase } from './fb.js';
const S = window.SITE, $ = (s, r = document) => r.querySelector(s);
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const EQUIP = [
  ['Jewellery & Gold Weighing Scales', 'Readability down to 1 mg', 'i-bal'], ['Precision Balances', 'Fine-resolution laboratory and workshop use', 'i-bal'],
  ['Analytical Balances', 'Draught-shielded, high-accuracy weighing', 'i-bal'], ['Retail & Commercial Weighing Scales', 'Shops, counters and billing scales', 'i-top'],
  ['Platform Scales', 'Floor-standing platforms for goods and parcels', 'i-plat'], ['Industrial Weighing Scales', 'Production-floor and process weighing', 'i-plat'],
  ['Heavy-Duty & Ton-Capacity Scales', 'High-capacity scales for heavy loads', 'i-plat'], ['Tabletop Scales', 'Compact bench scales', 'i-top'],
  ['Crane Scales', 'Hanging scales for lifted loads', 'i-crane'], ['Load Cells & Indicators', 'Sensors and displays, tested and replaced', 'i-cell'],
  ['Electronic Weighbridges', 'Vehicle weighing systems', 'i-bridge']];
const SVC = [
  ['Troubleshooting & Fault Diagnosis', 'Finding the real cause of drift, errors and dead displays.'], ['Calibration & Accuracy Adjustment', 'Adjusting your scale so readings match known test weights.'],
  ['Installation & Commissioning', 'Correct set-up, levelling and first-use checks.'], ['Preventive Maintenance', 'Regular inspection that catches problems before breakdowns.'],
  ['Electronic Circuit / PCB Repair', 'Component-level repair of scale circuit boards.'], ['Load Cell Testing & Replacement', 'Testing load cells and replacing faulty ones.'],
  ['Display & Keypad Repair', 'Fixing unreadable displays and unresponsive keys.'], ['Power Supply & Wiring Issues', 'Adapters, batteries, cabling and connectors.'],
  ['Sensor & Component Replacement', 'Replacing worn or damaged parts.'], ['Annual Maintenance Contracts (AMC)', 'Scheduled service for businesses with several scales.'],
  ['Software / Firmware Configuration', 'Settings, parameters and indicator set-up.'], ['On-site Emergency Breakdown Service', 'Priority visits when a scale stops work.']];
const IND = ['Jewellery Showrooms', 'Gold Manufacturing', 'Pharmaceutical Companies', 'Manufacturing Industries', 'Retail Chains', 'Laboratories', 'Logistics Companies'];

$('#equip').innerHTML = EQUIP.map(e => `<li class="card"><svg aria-hidden="true"><use href="#${e[2]}"/></svg><div><h3>${e[0]}</h3><p>${e[1]}</p></div></li>`).join('');
$('#svc').innerHTML = SVC.map(s => `<li><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join('');
$('#ind').innerHTML = IND.map(i => `<li><svg aria-hidden="true"><use href="#i-tool"/></svg>${i}</li>`).join('');
$('#eqSel').insertAdjacentHTML('beforeend', EQUIP.map(e => `<option>${esc(e[0])}</option>`).join('') + '<option>Other</option>');
$('#yr').textContent = new Date().getFullYear();

// Contact links driven by config/site-config.js
const waLink = t => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(t)}`;
document.querySelectorAll('[data-wa]').forEach(a => { a.href = waLink("Hello Alok, I'd like to enquire about a weighing scale service."); a.target = '_blank'; a.rel = 'noopener'; });
document.querySelectorAll('[data-mail]').forEach(a => { a.href = 'mailto:' + S.email; if (a.tagName === 'A' && a.textContent.includes('@')) a.textContent = S.email; });
$('#demoMail').hidden = !S.emailIsDemo;

// Menu
const burger = $('.burger'), menu = $('#menu');
burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
menu.addEventListener('click', e => { if (e.target.closest('a')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

// PWA
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
let deferred; const ib = $('#installBtn');
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; ib.hidden = false; });
ib.onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; ib.hidden = true; };
addEventListener('appinstalled', () => { ib.hidden = true; });

// Booking
const form = $('#bookForm'), fbState = $('#fbState'), err = $('#formErr'), ok = $('#formOk'), btn = $('#submitBtn');
fbState.textContent = S.firebaseEnabled ? 'Enquiries are saved for Alok to review.' : 'Online saving is not set up yet. Use “Send via WhatsApp” to reach Alok now.';
if (!S.firebaseEnabled) btn.textContent = 'Submit enquiry (setup needed)';
const data = () => Object.fromEntries([...new FormData(form)].filter(([k, v]) => k !== 'photo' && String(v).trim()).map(([k, v]) => [k, String(v).trim()]));
function validate() {
  const d = data(), bad = []; form.querySelectorAll('.bad').forEach(x => x.classList.remove('bad'));
  const need = { name: 2, phone: 1, location: 2, equipmentType: 1, problem: 5 };
  for (const k in need) if (!d[k] || d[k].length < need[k]) bad.push(k);
  if (d.phone && !/^\+?[\d\s-]{7,20}$/.test(d.phone)) bad.push('phone');
  if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) bad.push('email');
  const f = form.photo.files[0];
  if (f && (!/^image\/(jpeg|png|webp)$/.test(f.type) || f.size > 5 * 1024 * 1024)) bad.push('photo');
  bad.forEach(k => form.elements[k]?.classList.add('bad'));
  err.hidden = !bad.length; if (bad.length) { err.textContent = 'Please fix the highlighted fields: ' + [...new Set(bad)].join(', ') + '. Photos must be JPG, PNG or WebP under 5 MB.'; form.elements[bad[0]].focus(); }
  return !bad.length && d;
}
const msg = d => ['Hello Alok, service enquiry:', `Name: ${d.name}`, `Phone: ${d.phone}`, d.company && `Company: ${d.company}`, `Location: ${d.location}`, `Equipment: ${d.equipmentType}`, d.brand && `Brand: ${d.brand}`, d.model && `Model: ${d.model}`, d.capacity && `Capacity: ${d.capacity}`, `Problem: ${d.problem}`, d.preferredDate && `Preferred date: ${d.preferredDate}`, d.preferredTime && `Preferred time: ${d.preferredTime}`].filter(Boolean).join('\n');
$('#waBtn').onclick = () => { const d = validate(); if (d) window.open(waLink(msg(d)), '_blank', 'noopener'); };
form.onsubmit = async e => {
  e.preventDefault(); ok.hidden = true; const d = validate(); if (!d) return;
  if (!S.firebaseEnabled) { err.hidden = false; err.textContent = 'Online saving is not configured yet. Please use “Send via WhatsApp”.'; return; }
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const { fs, st, db, storage } = await getFirebase(), ref = fs.doc(fs.collection(db, 'bookings')), f = form.photo.files[0], rec = { ...d };
    if (f) { const p = `bookingUploads/${ref.id}/photo.${f.type.split('/')[1]}`; await st.uploadBytes(st.ref(storage, p), f, { contentType: f.type }); rec.photoPath = p; }
    await fs.setDoc(ref, { ...rec, status: 'New', createdAt: fs.serverTimestamp() });
    const m = S.emailjs; if (m?.serviceId && m.templateId && m.publicKey) fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service_id: m.serviceId, template_id: m.templateId, user_id: m.publicKey, template_params: { message: msg(d), name: d.name, phone: d.phone } }) }).catch(() => {});
    form.reset(); ok.hidden = false; ok.textContent = 'Enquiry sent. Alok will contact you soon. For urgent faults, use WhatsApp.';
  } catch (x) { console.warn(x); err.hidden = false; err.textContent = 'Could not send the enquiry. Check your connection or use WhatsApp.'; }
  btn.disabled = false; btn.textContent = 'Submit enquiry';
};

// Published projects + logos (only when Firebase is on)
if (S.firebaseEnabled) getFirebase().then(async ({ fs, db }) => {
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'projects'), fs.where('published', '==', true)));
  const ps = snap.docs.map(d => d.data()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (ps.length) $('#projects').innerHTML = ps.map(p => {
    const row = (k, v) => v ? `<dt>${k}</dt><dd>${esc(v)}</dd>` : '';
    const img = (u, l) => u && /^https:\/\//.test(u) ? `<figure><img loading="lazy" src="${esc(u)}" alt="${l} photo of ${esc(p.title)}"><figcaption>${l}</figcaption></figure>` : '';
    return `<article class="proj">${p.beforeUrl || p.afterUrl ? `<div class="ba">${img(p.beforeUrl, 'Before')}${img(p.afterUrl, 'After')}</div>` : ''}<div class="body"><h3>${esc(p.title)}</h3><dl>${row('Date', p.date)}${row('Location', p.location)}${row('Customer', p.customerPublic)}${row('Brand', p.brand)}${row('Model', p.model)}${row('Capacity', p.capacity)}${row('Problem', p.problem)}${row('Diagnosis', p.diagnosis)}${row('Work done', p.work)}${row('Notes', p.notes)}</dl></div></article>`;
  }).join('');
  const lg = await fs.getDoc(fs.doc(db, 'settings', 'logos')); const items = lg.exists() ? (lg.data().items || []) : [];
  if (items.length) $('#logos').innerHTML = items.filter(i => /^https:\/\//.test(i.url)).map(i => `<li><img loading="lazy" src="${esc(i.url)}" alt="${esc(i.name)}"></li>`).join('');
}).catch(e => console.warn('Firebase content unavailable', e));
