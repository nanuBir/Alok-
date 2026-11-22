const $ = (s, root=document) => root.querySelector(s);
$('#year').textContent = new Date().getFullYear();
const toggle = $('#menuToggle'), nav = $('#mainNav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));

const form=$('#bookingForm'), status=$('#formStatus');
form.addEventListener('submit',async e=>{
  e.preventDefault(); if(!form.reportValidity())return;
  const d=Object.fromEntries(new FormData(form).entries());
  const msg=[`Hello Alok, I would like to enquire about weighing scale service.`,`Name: ${d.name}`,`Phone: ${d.phone}`,d.company?`Company: ${d.company}`:'',`Location: ${d.location}`,`Equipment: ${d.equipment}`,d.model?`Brand / Model: ${d.model}`:'',d.date?`Preferred date: ${d.date}`:'',`Issue: ${d.issue}`].filter(Boolean).join('\n');
  let saved=false;
  try {
    const {firebaseConfig}=await import('./firebase-config.js');
    if(firebaseConfig.projectId&&!firebaseConfig.projectId.includes('YOUR_')){
      const [{initializeApp,getApps},{getFirestore,collection,addDoc,serverTimestamp}]=await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
      ]);
      const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
      const db=getFirestore(app);
      await addDoc(collection(db,'bookings'),{name:d.name,phone:d.phone,company:d.company||'',location:d.location,equipment:d.equipment,model:d.model||'',date:d.date||'',issue:d.issue,status:'New',createdAt:serverTimestamp()});
      saved=true;
    }
  } catch(err) { console.error('Booking save did not complete; WhatsApp hand-off remains available.',err); }
  status.textContent=saved?'Enquiry saved. Opening WhatsApp so you can send Alok the details…':'Opening WhatsApp with your enquiry. Review the details and tap Send…';
  window.open(`https://wa.me/918660581728?text=${encodeURIComponent(msg)}`,'_blank','noopener');
});

async function loadPublishedProjects(){
  try{
    const {firebaseConfig}=await import('./firebase-config.js');
    if(!firebaseConfig.projectId||firebaseConfig.projectId.includes('YOUR_'))return;
    const [{initializeApp,getApps},{getFirestore,collection,getDocs,query,where}]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]);
    const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),db=getFirestore(app);
    const snap=await getDocs(query(collection(db,'projects'),where('published','==',true)));
    if(snap.empty)return;
    const host=$('.empty-project');
    host.innerHTML=snap.docs.map(doc=>{const p=doc.data();return `<article class="published-project">${p.imageUrl?`<img src="${safe(p.imageUrl)}" alt="${safe(p.title||'Service project')}" loading="lazy">`:''}<small>${safe(p.location||'FIELD PROJECT')} · ${safe(p.equipment||'WEIGHING EQUIPMENT')}</small><b>${safe(p.title||'Service project')}</b><p>${safe(p.summary||'')}</p></article>`}).join('');
  }catch(err){console.info('Published project feed is unavailable until Firebase is configured.',err)}
}
function safe(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
loadPublishedProjects();

let installPrompt;const installBtn=$('#installButton');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;installBtn.hidden=false});installBtn.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installBtn.hidden=true});window.addEventListener('appinstalled',()=>{installBtn.hidden=true});
if('serviceWorker' in navigator && location.protocol.startsWith('http')){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('PWA service worker registration failed',err)));}
