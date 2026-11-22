const STORAGE_KEYS = {
  HISTORY: 'alok_service_history_v1',
  BOOKINGS: 'alok_service_bookings_v1'
};

const DEFAULT_DATA = {
  engineer: {
    name: 'Alok',
    role: 'Field Service Engineer',
    availability: 'Available for Service Bookings',
    bio: 'Hands-on technical diagnostics, equipment setup, preventive maintenance, and on-site support.',
    phone: '',
    whatsapp: '',
    email: '',
    location: 'On-Site & Local Service Area',
    portfolioUrl: 'https://nanubir.github.io/Alok-/#reviews',
    heroImage: 'hero.jpg'
  },
  services: [
    {
      id: 'diag-01',
      name: 'On-Site Technical Inspection & Diagnostics',
      rate: 'Visit / Inspection',
      eta: 'Same-day slot',
      description: 'Complete root-cause fault finding, testing, and clear repair/replacement estimate.'
    },
    {
      id: 'inst-02',
      name: 'Installation & System Setup',
      rate: 'Service Quote',
      eta: 'Scheduled slot',
      description: 'Clean installation, configuration, calibration, and post-setup functionality check.'
    },
    {
      id: 'maint-03',
      name: 'Preventive Maintenance & Servicing',
      rate: 'Service Plan',
      eta: 'Flexible timing',
      description: 'Routine tuning, cleaning, wear checks, and performance optimization to prevent breakdowns.'
    },
    {
      id: 'repair-04',
      name: 'Troubleshooting & Urgent Repair',
      rate: 'Priority Support',
      eta: 'Fast response',
      description: 'Targeted fault resolution, component testing, and operational recovery.'
    }
  ],
  reviews: [
    {
      author: 'Verified Client',
      rating: 5,
      comment: 'Prompt response, clear explanation of the technical issue, and neat on-site work.'
    },
    {
      author: 'Local Customer',
      rating: 5,
      comment: 'Dependable service support and straightforward booking process.'
    }
  ]
};

let appData = structuredClone(DEFAULT_DATA);

const drawer = document.getElementById('sideDrawer');
const backdrop = document.getElementById('drawerBackdrop');
const openDrawerBtn = document.getElementById('openDrawerBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const newBookingSessionBtn = document.getElementById('newBookingSessionBtn');
const historyList = document.getElementById('historyList');
const navTabs = document.querySelectorAll('.nav-tab');
const tabViews = document.querySelectorAll('.tab-view');
const headerTitle = document.getElementById('headerTitle');

function switchTab(tabId, customTitle) {
  tabViews.forEach(view => {
    view.classList.toggle('active', view.id === tabId);
  });

  navTabs.forEach(tab => {
    const isMatch = tab.dataset.tab === tabId;
    tab.classList.toggle('active', isMatch);
    if (isMatch && !customTitle) {
      headerTitle.textContent = tab.dataset.title || `${appData.engineer.name} • Service Desk`;
    }
  });

  if (customTitle) {
    headerTitle.textContent = customTitle;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openDrawer() {
  drawer.classList.add('open');
  backdrop.classList.add('open');
}

function closeDrawer() {
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
}

openDrawerBtn.addEventListener('click', openDrawer);
closeDrawerBtn.addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.dataset.tab);
  });
});

document.getElementById('quickBookHeaderBtn').addEventListener('click', () => {
  switchTab('tab-book', `Book Service • ${appData.engineer.name}`);
});

document.getElementById('heroBookBtn').addEventListener('click', () => {
  switchTab('tab-book', `Book Service • ${appData.engineer.name}`);
});

document.getElementById('heroServicesBtn').addEventListener('click', () => {
  switchTab('tab-services', `Services • ${appData.engineer.name}`);
});

newBookingSessionBtn.addEventListener('click', () => {
  closeDrawer();
  document.getElementById('bookingForm').reset();
  document.getElementById('bookingReceipt').classList.remove('show');
  switchTab('tab-book', `New Booking • ${appData.engineer.name}`);
});

function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return [
    { id: 'h1', label: 'Engineer Profile & Overview', tab: 'tab-home' },
    { id: 'h2', label: 'Available Services & Rates', tab: 'tab-services' },
    { id: 'h3', label: 'Service Booking Request Form', tab: 'tab-book' },
    { id: 'h4', label: 'Client Reviews & Contact', tab: 'tab-reviews' }
  ];
}

function addHistoryEntry(label, tab = 'tab-book') {
  const current = getHistory().filter(item => item.label !== label);
  current.unshift({ id: String(Date.now()), label, tab });
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(current.slice(0, 15)));
  renderHistory();
}

function renderHistory() {
  const items = getHistory();
  historyList.innerHTML = '';
  items.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `history-item ${idx === 0 ? 'active' : ''}`;
    btn.innerHTML = `<span>💬</span><span>${escapeHtml(item.label)}</span>`;
    btn.addEventListener('click', () => {
      closeDrawer();
      switchTab(item.tab, item.label);
    });
    historyList.appendChild(btn);
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderServices() {
  const homeGrid = document.getElementById('homeServicesGrid');
  const allGrid = document.getElementById('allServicesGrid');
  const select = document.getElementById('serviceSelect');

  homeGrid.innerHTML = '';
  allGrid.innerHTML = '';
  select.innerHTML = '';

  appData.services.forEach((srv, idx) => {
    const opt = document.createElement('option');
    opt.value = srv.name;
    opt.textContent = `${srv.name} (${srv.rate})`;
    select.appendChild(opt);

    const cardHtml = `
      <article class="service-card">
        <div>
          <div class="service-top">
            <h3 class="service-name">${escapeHtml(srv.name)}</h3>
            <span class="service-rate">${escapeHtml(srv.rate)}</span>
          </div>
          <p class="service-desc" style="margin-top: 6px;">${escapeHtml(srv.description)}</p>
        </div>
        <div class="service-actions">
          <span class="service-eta">${escapeHtml(srv.eta || 'Available')}</span>
          <button type="button" class="book-mini-btn" data-service="${escapeHtml(srv.name)}">Book Now</button>
        </div>
      </article>
    `;

    allGrid.insertAdjacentHTML('beforeend', cardHtml);
    if (idx < 2) {
      homeGrid.insertAdjacentHTML('beforeend', cardHtml);
    }
  });

  document.querySelectorAll('.book-mini-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const srvName = btn.dataset.service;
      select.value = srvName;
      addHistoryEntry(`Booking: ${srvName}`, 'tab-book');
      switchTab('tab-book', `Book • ${srvName}`);
    });
  });
}

function renderReviewsAndContact() {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const contactContainer = document.getElementById('contactContainer');
  const ratingSummary = document.getElementById('ratingSummary');

  reviewsContainer.innerHTML = '';
  if (appData.reviews.length > 0) {
    const avg = (
      appData.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
      appData.reviews.length
    ).toFixed(1);
    ratingSummary.textContent = `★ ${avg} / 5.0 (${appData.reviews.length})`;
  }

  appData.reviews.forEach(rev => {
    const stars = '★'.repeat(Math.max(1, Math.min(5, Number(rev.rating) || 5)));
    reviewsContainer.insertAdjacentHTML(
      'beforeend',
      `
      <div class="review-card">
        <div class="review-top">
          <span class="review-author">${escapeHtml(rev.author)}</span>
          <span class="review-stars">${stars}</span>
        </div>
        <p class="review-text">${escapeHtml(rev.comment)}</p>
      </div>
      `
    );
  });

  const eng = appData.engineer;
  const phoneRow = eng.phone
    ? `<div class="contact-row"><span>Phone</span><a href="tel:${escapeHtml(eng.phone)}" style="color:#93c5fd;">${escapeHtml(eng.phone)}</a></div>`
    : `<div class="contact-row"><span>Phone</span><span class="muted-note">Edit engineer.json to add phone</span></div>`;

  const waClean = (eng.whatsapp || eng.phone || '').replace(/[^0-9]/g, '');
  const waRow = waClean
    ? `<div class="contact-row"><span>WhatsApp</span><a href="https://wa.me/${waClean}" target="_blank" rel="noopener" style="color:#6ee7b7;">Chat on WhatsApp</a></div>`
    : `<div class="contact-row"><span>WhatsApp</span><span class="muted-note">Edit engineer.json to add WhatsApp</span></div>`;

  const refLink = eng.portfolioUrl
    ? `<div class="contact-row"><span>Reference Profile</span><a href="${escapeHtml(eng.portfolioUrl)}" target="_blank" rel="noopener" style="color:#93c5fd;">Open Alok Profile</a></div>`
    : '';

  contactContainer.innerHTML = `
    <div class="contact-row"><span>Service Engineer</span><strong>${escapeHtml(eng.name)} (${escapeHtml(eng.role)})</strong></div>
    ${phoneRow}
    ${waRow}
    <div class="contact-row"><span>Service Area</span><span>${escapeHtml(eng.location || 'On-Site')}</span></div>
    ${refLink}
  `;
}

function applyEngineerData(data) {
  appData = {
    engineer: { ...DEFAULT_DATA.engineer, ...(data.engineer || {}) },
    services: Array.isArray(data.services) ? data.services : DEFAULT_DATA.services,
    reviews: Array.isArray(data.reviews) ? data.reviews : DEFAULT_DATA.reviews
  };

  const eng = appData.engineer;
  document.title = `${eng.name} — ${eng.role}`;
  headerTitle.textContent = `${eng.name} • Service Desk`;
  document.getElementById('heroName').textContent = `${eng.name} — ${eng.role}`;
  document.getElementById('heroBio').textContent = eng.bio;
  document.getElementById('heroAvailability').textContent = eng.availability;
  document.getElementById('drawerEngineerName').textContent = eng.name;
  document.getElementById('drawerEngineerRole').textContent = eng.role;

  renderServices();
  renderReviewsAndContact();
}

function collectBookingPayload() {
  return {
    name: document.getElementById('clientName').value.trim(),
    phone: document.getElementById('clientPhone').value.trim(),
    service: document.getElementById('serviceSelect').value,
    date: document.getElementById('preferredDate').value,
    location: document.getElementById('clientLocation').value.trim(),
    details: document.getElementById('issueDetails').value.trim(),
    createdAt: new Date().toLocaleString()
  };
}

document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const payload = collectBookingPayload();
  if (!payload.name || !payload.phone) return;

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  existing.unshift(payload);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(existing.slice(0, 30)));

  addHistoryEntry(`Booked: ${payload.service} (${payload.name})`, 'tab-book');

  const receipt = document.getElementById('bookingReceipt');
  receipt.innerHTML = `
    <strong>Booking Request Saved</strong><br/>
    Service: ${escapeHtml(payload.service)}<br/>
    Client: ${escapeHtml(payload.name)} (${escapeHtml(payload.phone)})<br/>
    ${payload.date ? `Preferred Slot: ${escapeHtml(payload.date)}<br/>` : ''}
    ${payload.location ? `Location: ${escapeHtml(payload.location)}<br/>` : ''}
    <span class="muted-note">Saved locally in this app session & added to left drawer history.</span>
  `;
  receipt.classList.add('show');
});

document.getElementById('sendWhatsAppBtn').addEventListener('click', () => {
  const payload = collectBookingPayload();
  const targetNum = (appData.engineer.whatsapp || appData.engineer.phone || '').replace(/[^0-9]/g, '');

  const message = [
    `Hello ${appData.engineer.name}, I would like to book a service:`,
    `• Service: ${payload.service || 'General Service'}`,
    payload.name ? `• Name: ${payload.name}` : '',
    payload.phone ? `• Phone: ${payload.phone}` : '',
    payload.date ? `• Preferred Time: ${payload.date}` : '',
    payload.location ? `• Location: ${payload.location}` : '',
    payload.details ? `• Details: ${payload.details}` : ''
  ]
    .filter(Boolean)
    .join('\n');

  const waUrl = targetNum
    ? `https://wa.me/${targetNum}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  if (payload.name || payload.service) {
    addHistoryEntry(`WhatsApp Request: ${payload.service || 'Service'}`, 'tab-book');
  }
  window.open(waUrl, '_blank', 'noopener');
});

async function initApp() {
  renderHistory();
  applyEngineerData(DEFAULT_DATA);

  try {
    const res = await fetch('engineer.json', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      applyEngineerData(json);
      document.getElementById('syncStatus').textContent = 'Synced from engineer.json';
    }
  } catch (_) {
    document.getElementById('syncStatus').textContent = 'Ready';
  }
}

initApp();
