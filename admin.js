import { getFirebase } from './fb.js';
const S = window.SITE, app = document.getElementById('app'), $ = (s, r = app) => r.querySelector(s);
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const STATUS = ['New', 'Contacted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});

if (!S.firebaseEnabled) { app.innerHTML = '<h2>Firebase is not set up yet</h2><p>Follow SETUP-GUIDE.md, create firebase-config.js, then set <code>firebaseEnabled: true</code> in site-config.js.</p>'; }
else boot().catch(e => { console.warn(e); app.innerHTML = '<h2>Could not start</h2><p>Check firebase-config.js and your connection.</p>'; });

async function boot() {
  const F = await getFirebase(), { fs, st, au, db, storage, auth } = F;
  $('#out', document).onclick = () => au.signOut(auth);
  au.onAuthStateChanged(auth, async u => {
    $('#out', document).hidden = !u;
    if (!u) return login();
    const a = await fs.getDoc(fs.doc(db, 'admins', u.uid)).catch(() => null);
    if (!a || !a.exists()) { app.innerHTML = '<h2>No access</h2><p>This account is not an administrator. See SETUP-GUIDE.md step 6.</p>'; return; }
    shell();
  });
  function login() {
    app.innerHTML = `<h2>Sign in</h2><form id="lf" style="grid-template-columns:1fr"><label>Email<input name="e" type="email" autocomplete="username" required></label><label>Password<input name="p" type="password" autocomplete="current-password" required></label><p class="err" id="le" role="alert"></p><button class="btn gold" style="color:#14100a">Sign in</button></form>`;
    $('#lf').onsubmit = async e => { e.preventDefault(); try { await au.signInWithEmailAndPassword(auth, e.target.e.value, e.target.p.value); } catch { $('#le').textContent = 'Sign-in failed. Check your email and password.'; $('#le').style.color = '#b3372a'; } };
  }
  function shell() {
    app.innerHTML = '<div class="tabs" role="tablist"></div><div id="pane"></div>';
    const tabs = { Bookings: bookings, Projects: projects, Reviews: reviews, Logos: logos }, t = $('.tabs');
    Object.keys(tabs).forEach((k, i) => { const b = document.createElement('button'); b.textContent = k; b.role = 'tab'; b.onclick = () => { t.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b)); tabs[k](); }; t.append(b); if (!i) b.click(); });
  }
  const pane = () => $('#pane'), toast = m => { const p = document.createElement('p'); p.className = 'msg'; p.textContent = m; pane().prepend(p); setTimeout(() => p.remove(), 3000); };

  async function bookings() {
    pane().innerHTML = `<div class="tools"><input id="q" type="search" placeholder="Search name, phone, brand…" aria-label="Search"><select id="fs" aria-label="Status"><option value="">All statuses</option>${STATUS.map(s => `<option>${s}</option>`).join('')}</select><input id="fd" type="date" aria-label="From date"></div><div id="bl">Loading…</div>`;
    const snap = await fs.getDocs(fs.query(fs.collection(db, 'bookings'), fs.orderBy('createdAt', 'desc')));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const draw = () => {
      const q = $('#q').value.toLowerCase(), s = $('#fs').value, fd = $('#fd').value;
      const list = all.filter(b => (!s || b.status === s) && (!fd || (b.createdAt?.toDate().toISOString().slice(0, 10) >= fd)) && (!q || JSON.stringify(b).toLowerCase().includes(q)));
      $('#bl').innerHTML = list.length ? list.map(b => `<div class="row" data-id="${b.id}"><div><span class="pill">${esc(b.status)}</span> <strong>${esc(b.name)}</strong></div><div>${esc(b.equipmentType)} · ${esc(b.location)}</div><small>${b.createdAt ? b.createdAt.toDate().toLocaleString() : ''}</small><button class="btn ghost dk small">Open</button></div>`).join('') : '<p class="empty">No bookings match.</p>';
      $('#bl').querySelectorAll('.row button').forEach(btn => btn.onclick = () => detail(all.find(x => x.id === btn.closest('.row').dataset.id)));
    };
    ['#q', '#fs', '#fd'].forEach(i => $(i).oninput = draw); draw();
  }
  async function detail(b) {
    let photo = ''; if (b.photoPath) try { photo = await st.getDownloadURL(st.ref(storage, b.photoPath)); } catch { }
    const f = [['Name', b.name], ['Phone', b.phone], ['Email', b.email], ['Company', b.company], ['Location', b.location], ['Equipment', b.equipmentType], ['Brand', b.brand], ['Model', b.model], ['Capacity', b.capacity], ['Problem', b.problem], ['Preferred', [b.preferredDate, b.preferredTime].filter(Boolean).join(' ')]];
    pane().innerHTML = `<button class="btn ghost dk small" id="bk">Back</button><h2>${esc(b.name)}</h2><dl class="proj" style="display:grid;grid-template-columns:auto 1fr;gap:6px 14px;padding:14px;background:#fff">${f.map(([k, v]) => v ? `<dt>${k}</dt><dd style="margin:0">${esc(v)}</dd>` : '').join('')}</dl>${photo ? `<p><a href="${photo}" target="_blank" rel="noopener">View customer photo</a></p>` : ''}<p><a class="btn gold small" target="_blank" rel="noopener" href="https://wa.me/${String(b.phone).replace(/\D/g, '').replace(/^(\d{10})$/, '91$1')}">WhatsApp customer</a> <a class="btn ghost dk small" href="tel:${esc(b.phone)}">Call</a></p><form id="df" style="grid-template-columns:1fr"><label>Status<select name="status">${STATUS.map(s => `<option ${s === b.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label><label>Internal notes<textarea name="notes" rows="4" maxlength="2000">${esc(b.notes)}</textarea></label><div class="cta"><button class="btn gold" style="color:#14100a">Save changes</button><button type="button" class="btn red" id="del">Delete booking</button></div></form>`;
    $('#bk').onclick = bookings;
    $('#df').onsubmit = async e => { e.preventDefault(); await fs.updateDoc(fs.doc(db, 'bookings', b.id), { status: e.target.status.value, notes: e.target.notes.value }); toast('Saved'); };
    $('#del').onclick = async () => { if (confirm('Delete this booking permanently?')) { await fs.deleteDoc(fs.doc(db, 'bookings', b.id)); bookings(); } };
  }

  async function up(file, path) { if (!file) return null; if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 8e6) throw new Error('Images must be JPG/PNG/WebP under 8 MB'); const r = st.ref(storage, path); await st.uploadBytes(r, file); return st.getDownloadURL(r); }
  async function projects(edit) {
    const snap = await fs.getDocs(fs.collection(db, 'projects')), ps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fld = (n, l, t = 'input') => `<label class="${t === 'textarea' ? 'full' : ''}">${l}${t === 'textarea' ? `<textarea name="${n}" rows="3" maxlength="2000"></textarea>` : `<input name="${n}" maxlength="200">`}</label>`;
    pane().innerHTML = `<h2>Projects</h2><div id="pl">${ps.map(p => `<div class="row"><div><span class="pill">${p.published ? 'Published' : 'Unpublished'}</span> <strong>${esc(p.title || '(untitled)')}</strong></div><div><button class="btn ghost dk small" data-e="${p.id}">Edit</button> <button class="btn ghost dk small" data-t="${p.id}">${p.published ? 'Unpublish' : 'Publish'}</button> <button class="btn red small" data-d="${p.id}">Delete</button></div></div>`).join('') || '<p class="empty">No projects yet.</p>'}</div><h3 id="ft">New project</h3><form id="pf">${fld('title', 'Title *')}${fld('date', 'Service date')}${fld('location', 'Location')}${fld('brand', 'Equipment brand')}${fld('model', 'Model')}${fld('capacity', 'Capacity')}${fld('problem', 'Reported problem', 'textarea')}${fld('diagnosis', 'Diagnosis', 'textarea')}${fld('work', 'Work completed', 'textarea')}${fld('notes', 'Additional notes', 'textarea')}${fld('customerName', 'Customer / company (private)')}<label><span>Show customer name publicly?</span><select name="showCustomer"><option value="no">No, keep private</option><option value="yes">Yes, display it</option></select></label><label>Before photo<input type="file" name="before" accept="image/*"></label><label>After photo<input type="file" name="after" accept="image/*"></label><label><span>Visibility</span><select name="published"><option value="no">Unpublished</option><option value="yes">Published</option></select></label><p class="full err" id="pe"></p><div class="full"><button class="btn gold" style="color:#14100a">Save project</button></div></form>`;
    let cur = null;
    pane().querySelectorAll('[data-e]').forEach(b => b.onclick = async () => {
      cur = ps.find(p => p.id === b.dataset.e); const pr = await fs.getDoc(fs.doc(db, 'projects', cur.id, 'private', 'details')), f = $('#pf'); $('#ft').textContent = 'Edit project';
      ['title', 'date', 'location', 'brand', 'model', 'capacity', 'problem', 'diagnosis', 'work', 'notes'].forEach(k => f[k].value = cur[k] || ''); f.customerName.value = pr.exists() ? pr.data().customerName || '' : ''; f.showCustomer.value = cur.customerPublic ? 'yes' : 'no'; f.published.value = cur.published ? 'yes' : 'no'; f.scrollIntoView();
    });
    pane().querySelectorAll('[data-t]').forEach(b => b.onclick = async () => { const p = ps.find(x => x.id === b.dataset.t); if (!p.published && !(p.title && p.problem && p.work)) return toast('Add a title, reported problem and work completed before publishing.'); await fs.updateDoc(fs.doc(db, 'projects', p.id), { published: !p.published }); projects(); });
    pane().querySelectorAll('[data-d]').forEach(b => b.onclick = async () => { if (confirm('Delete this project permanently?')) { await fs.deleteDoc(fs.doc(db, 'projects', b.dataset.d)); projects(); } });
    $('#pf').onsubmit = async e => {
      e.preventDefault(); const f = e.target, v = k => f[k].value.trim(), id = cur ? cur.id : fs.doc(fs.collection(db, 'projects')).id;
      if (!v('title')) return $('#pe').textContent = 'Title is required.';
      if (f.published.value === 'yes' && !(v('problem') && v('work'))) return $('#pe').textContent = 'To publish, fill in the reported problem and work completed.';
      try {
        const pub = { title: v('title'), date: v('date'), location: v('location'), brand: v('brand'), model: v('model'), capacity: v('capacity'), problem: v('problem'), diagnosis: v('diagnosis'), work: v('work'), notes: v('notes'), published: f.published.value === 'yes', customerPublic: f.showCustomer.value === 'yes' ? v('customerName') : '' };
        const bu = await up(f.before.files[0], `public/projects/${id}/before.jpg`), au2 = await up(f.after.files[0], `public/projects/${id}/after.jpg`);
        if (bu) pub.beforeUrl = bu; if (au2) pub.afterUrl = au2;
        await fs.setDoc(fs.doc(db, 'projects', id), pub, { merge: true });
        await fs.setDoc(fs.doc(db, 'projects', id, 'private', 'details'), { customerName: v('customerName') });
        projects();
      } catch (x) { $('#pe').textContent = x.message || 'Could not save.'; }
    };
  }
  async function reviews() {
    const snap = await fs.getDocs(fs.collection(db, 'reviews')), rs = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    pane().innerHTML = '<h2>Reviews</h2>' + (rs.map(r => `<div class="row"><div><span class="pill">${r.approved ? 'Showing' : 'Waiting'}</span> <strong>${esc(r.name)}</strong> ${'★'.repeat(r.rating)}</div><div>${esc(r.comment)}</div><div><button class="btn ghost dk small" data-a="${r.id}">${r.approved ? 'Hide' : 'Approve'}</button> <button class="btn red small" data-x="${r.id}">Delete</button></div></div>`).join('') || '<p class="empty">No reviews yet.</p>');
    pane().querySelectorAll('[data-a]').forEach(b => b.onclick = async () => { const r = rs.find(x => x.id === b.dataset.a); await fs.updateDoc(fs.doc(db, 'reviews', r.id), { approved: !r.approved }); reviews(); });
    pane().querySelectorAll('[data-x]').forEach(b => b.onclick = async () => { if (confirm('Delete this review permanently?')) { await fs.deleteDoc(fs.doc(db, 'reviews', b.dataset.x)); reviews(); } });
  }
  async function logos() {
    const ref = fs.doc(db, 'settings', 'logos'), g = await fs.getDoc(ref); let items = g.exists() ? g.data().items || [] : [];
    const draw = () => { pane().innerHTML = `<h2>Customer logos</h2><p>Add a logo only with the customer’s permission.</p>${items.map((i, n) => `<div class="row"><strong>${esc(i.name)}</strong><button class="btn red small" data-r="${n}">Remove</button></div>`).join('') || '<p class="empty">No logos yet. Public site shows empty slots.</p>'}<form id="lf2" style="grid-template-columns:1fr"><label>Customer name<input name="n" required maxlength="80"></label><label>Logo image<input name="f" type="file" accept="image/*" required></label><p class="err" id="le2"></p><button class="btn gold" style="color:#14100a">Add logo</button></form>`;
      pane().querySelectorAll('[data-r]').forEach(b => b.onclick = async () => { items.splice(+b.dataset.r, 1); await fs.setDoc(ref, { items }); draw(); });
      $('#lf2').onsubmit = async e => { e.preventDefault(); try { const u = await up(e.target.f.files[0], `public/logos/${Date.now()}.jpg`); items.push({ name: e.target.n.value.trim(), url: u }); await fs.setDoc(ref, { items }); draw(); } catch (x) { $('#le2').textContent = x.message; } }; };
    draw();
  }
}
