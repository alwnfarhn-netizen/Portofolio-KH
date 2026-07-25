// ==========================================
// Defensive Security Engine & XSS Sanitization
// ==========================================
function escapeHTML(str) {
  if (typeof str !== 'string') return str === null || str === undefined ? '' : String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeURL(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  return 'https://' + trimmed.replace(/^(javascript|vbscript|data):/i, '');
}

// Passcode Gatekeeper
const DEFAULT_PIN = '123456';

function getAdminPIN() {
  return localStorage.getItem('portfolio_admin_pin') || DEFAULT_PIN;
}

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('portfolio_admin_auth') === 'true';
  const lockOverlay = document.getElementById('cms-lock-screen');
  if (!lockOverlay) return;

  if (isAuth) {
    lockOverlay.style.display = 'none';
  } else {
    lockOverlay.style.display = 'flex';
  }
}

function verifyAdminPIN() {
  const pinInput = document.getElementById('admin-pin-input');
  const errorMsg = document.getElementById('admin-pin-error');
  if (!pinInput) return;

  const enteredPIN = pinInput.value.trim();
  const currentPIN = getAdminPIN();

  if (enteredPIN === currentPIN) {
    sessionStorage.setItem('portfolio_admin_auth', 'true');
    const lockOverlay = document.getElementById('cms-lock-screen');
    if (lockOverlay) lockOverlay.style.display = 'none';
    pinInput.value = '';
    if (errorMsg) errorMsg.style.display = 'none';
  } else {
    if (errorMsg) {
      errorMsg.textContent = '❌ PIN Sandi Salah! Silakan coba lagi.';
      errorMsg.style.display = 'block';
    }
    pinInput.value = '';
    pinInput.focus();
  }
}

async function saveAdminPIN(e) {
  e.preventDefault();
  const oldPin = document.getElementById('pin-old').value.trim();
  const newPin = document.getElementById('pin-new').value.trim();
  const confirmPin = document.getElementById('pin-confirm').value.trim();

  if (oldPin !== getAdminPIN()) {
    await cmsAlert('PIN lama yang Anda masukkan salah!', 'danger');
    return;
  }

  if (newPin.length < 4) {
    await cmsAlert('PIN baru minimal harus 4 digit!', 'danger');
    return;
  }

  if (newPin !== confirmPin) {
    await cmsAlert('Konfirmasi PIN baru tidak cocok!', 'danger');
    return;
  }

  localStorage.setItem('portfolio_admin_pin', newPin);
  document.getElementById('pin-old').value = '';
  document.getElementById('pin-new').value = '';
  document.getElementById('pin-confirm').value = '';

  await cmsAlert('🔐 PIN Keamanan Admin berhasil diperbarui!', 'success');
}

function logoutAdmin() {
  sessionStorage.removeItem('portfolio_admin_auth');
  checkAdminAuth();
}

let cmsData = {
  profile: {},
  stats: {},
  video: {},
  research: [],
  publications: [],
  blog: [],
  gallery: []
};

// ==========================================
// Custom CMS Modal System (replaces browser confirm/alert)
// ==========================================
function cmsModal({ icon, title, body, changes = null, isDanger = false, confirmLabel = 'Ya, Simpan', cancelLabel = 'Batal' }) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('cms-confirm-modal');
    if (!overlay) { resolve(true); return; }

    overlay.className = 'cms-modal-overlay show' + (isDanger ? ' cms-modal-danger' : '');
    document.getElementById('modal-icon').textContent  = icon;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent  = body;

    const changesBox = document.getElementById('modal-changes');
    if (changes && changes.length > 0) {
      changesBox.style.display = 'block';
      changesBox.innerHTML = '<strong style="display:block;margin-bottom:0.4rem;">Ringkasan perubahan:</strong><ul>' +
        changes.map(c => `<li>${escapeHTML(c)}</li>`).join('') + '</ul>';
    } else {
      changesBox.style.display = 'none';
      changesBox.innerHTML = '';
    }

    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn  = document.getElementById('modal-cancel-btn');
    confirmBtn.textContent = confirmLabel;
    cancelBtn.textContent  = cancelLabel;

    if (isDanger) {
      confirmBtn.className = 'btn btn-danger';
      confirmBtn.style.minWidth = '110px';
    } else {
      confirmBtn.className = 'btn btn-success';
      confirmBtn.style.minWidth = '110px';
    }

    function cleanup(result) {
      overlay.className = 'cms-modal-overlay';
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      resolve(result);
    }
    const onConfirm = () => cleanup(true);
    const onCancel  = () => cleanup(false);
    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
  });
}

function cmsAlert(message, type = 'success') {
  const icon = type === 'success' ? '✅' : (type === 'danger' ? '❌' : 'ℹ️');
  return cmsModal({
    icon,
    title: type === 'success' ? 'Berhasil!' : (type === 'danger' ? 'Terjadi Masalah' : 'Informasi'),
    body: message,
    confirmLabel: 'Tutup',
    cancelLabel: ''
  }).then(() => {});
}

function updateLastSaved() {
  const el = document.getElementById('last-saved-label');
  if (el) {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    el.textContent = `Terakhir disimpan: ${time}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  const localSaved = localStorage.getItem('portfolio_cms_data');
  if (localSaved) {
    try {
      cmsData = JSON.parse(localSaved);
      renderAll();
    } catch (e) {
      loadDefaultJSON();
    }
  } else {
    loadDefaultJSON();
  }
});

// ==========================================
// Supabase Cloud Live Sync Credentials
// ==========================================
const SUPABASE_URL = 'https://uksp6rxubbaxca1fcaax.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ukSp6RxUBBAXca1fcAAx_Q_ovbddB6h';
const PORTFOLIO_SLUG = 'khofia';

async function syncToSupabaseCloud() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/portfolios`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        slug: PORTFOLIO_SLUG,
        content: cmsData,
        updated_at: new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn('Supabase cloud sync:', err);
  }
}

function loadDefaultJSON() {
  if (SUPABASE_URL && SUPABASE_KEY) {
    fetch(`${SUPABASE_URL}/rest/v1/portfolios?slug=eq.${PORTFOLIO_SLUG}&select=content`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    .then(res => res.json())
    .then(rows => {
      if (rows && rows.length > 0 && rows[0].content) {
        cmsData = rows[0].content;
        renderAll();
        return;
      }
      fetchLocalContentJSON();
    })
    .catch(() => fetchLocalContentJSON());
  } else {
    fetchLocalContentJSON();
  }
}

function fetchLocalContentJSON() {
  fetch('data/content.json')
    .then(res => res.json())
    .then(data => {
      cmsData = data;
      renderAll();
    })
    .catch(err => {
      console.log('Error loading content.json data');
      renderAll();
    });
}

function saveAllChanges(silent = false) {
  localStorage.setItem('portfolio_cms_data', JSON.stringify(cmsData));
  updateLastSaved();
  updateJSONPreview();

  // Async sync to Supabase Cloud DB
  syncToSupabaseCloud();

  if (!silent) {
    cmsAlert('Perubahan Anda telah disimpan dan langsung aktif terhubung live di seluruh dunia!', 'success');
  }
}

async function resetToDefaultData() {
  const ok = await cmsModal({
    icon: '⚠️',
    title: 'Reset Semua Data?',
    body: 'Seluruh data akan dikembalikan ke pengaturan awal dari content.json. Perubahan yang belum di-download akan terhapus permanen.',
    isDanger: true,
    confirmLabel: 'Ya, Reset Sekarang',
    cancelLabel: 'Batal'
  });
  if (ok) {
    localStorage.removeItem('portfolio_cms_data');
    loadDefaultJSON();
    cmsAlert('Data telah dikembalikan ke kondisi awal.', 'success');
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.admin-tab-btn, .sidebar-tab-btn').forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(`tab-${tabName}`);
  if (targetTab) targetTab.style.display = 'block';

  if (event && (event.currentTarget || event.target)) {
    const target = event.currentTarget || event.target;
    if (target && target.classList) target.classList.add('active');
  }

  if (tabName === 'export') {
    updateJSONPreview();
  }
}

function renderAll() {
  renderProfile();
  renderPubs();
  renderResearch();
  renderBlog();
  renderGallery();
  renderVideo();
  updateJSONPreview();
}

// 🖼️ IMAGE FILE UPLOADER ENGINE (Converts selected image to Data URL for instant live preview)
function uploadImageFile(fileInput, targetInputId, previewImgId) {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) targetInput.value = dataUrl;

      if (previewImgId) {
        const prevImg = document.getElementById(previewImgId);
        if (prevImg) prevImg.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }
}

function uploadResearchFile(fileInput, index) {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      if (cmsData.research[index]) {
        cmsData.research[index].image = dataUrl;
        const prevImg = document.getElementById(`prev-res-img-${index}`);
        if (prevImg) prevImg.src = dataUrl;
        const inputTxt = document.getElementById(`input-res-img-${index}`);
        if (inputTxt) inputTxt.value = dataUrl;
        saveAllChanges(true);
      }
    };
    reader.readAsDataURL(file);
  }
}

// 0. Profile & Stats Management
function renderProfile() {
  if (!cmsData.profile) cmsData.profile = {};
  if (!cmsData.stats) cmsData.stats = {};

  const p = cmsData.profile;
  const s = cmsData.stats;

  if (document.getElementById('prof-name')) document.getElementById('prof-name').value = p.name || '';
  if (document.getElementById('prof-subtitle')) document.getElementById('prof-subtitle').value = p.subtitle || '';
  if (document.getElementById('prof-institution')) document.getElementById('prof-institution').value = p.institution || '';
  if (document.getElementById('prof-email')) document.getElementById('prof-email').value = p.email || '';
  if (document.getElementById('prof-tagline')) document.getElementById('prof-tagline').value = p.tagline || '';
  
  if (document.getElementById('prof-avatar')) {
    document.getElementById('prof-avatar').value = p.avatar || 'assets/foto-profil-nobg.png';
  }
  if (document.getElementById('prev-prof-avatar')) {
    document.getElementById('prev-prof-avatar').src = p.avatar || 'assets/foto-profil-nobg.png';
  }

  if (document.getElementById('stat-pubs')) document.getElementById('stat-pubs').value = s.publications || '';
  if (document.getElementById('stat-citations')) document.getElementById('stat-citations').value = s.citations || '';
  if (document.getElementById('stat-years')) document.getElementById('stat-years').value = s.years || '';
  if (document.getElementById('stat-countries')) document.getElementById('stat-countries').value = s.countries || '';
}

async function saveProfileForm(e) {
  e.preventDefault();
  if (!cmsData.profile) cmsData.profile = {};
  if (!cmsData.stats) cmsData.stats = {};

  const newName = document.getElementById('prof-name').value;
  const newSubtitle = document.getElementById('prof-subtitle').value;
  const newInstitution = document.getElementById('prof-institution').value;
  const newEmail = document.getElementById('prof-email').value;
  const newTagline = document.getElementById('prof-tagline').value;
  const newAvatar = document.getElementById('prof-avatar').value;
  const newPubs = document.getElementById('stat-pubs').value;
  const newCitations = document.getElementById('stat-citations').value;
  const newYears = document.getElementById('stat-years').value;
  const newCountries = document.getElementById('stat-countries').value;

  const changes = [];
  if (newName !== cmsData.profile.name) changes.push(`Nama: "${cmsData.profile.name || '-'}" → "${newName}"`);
  if (newSubtitle !== cmsData.profile.subtitle) changes.push(`Jabatan: "${cmsData.profile.subtitle || '-'}" → "${newSubtitle}"`);
  if (newInstitution !== cmsData.profile.institution) changes.push(`Institusi: "${cmsData.profile.institution || '-'}" → "${newInstitution}"`);
  if (newEmail !== cmsData.profile.email) changes.push(`Email: ${newEmail}`);
  if (newTagline !== cmsData.profile.tagline) changes.push('Tagline diperbarui');
  if (newAvatar !== cmsData.profile.avatar) changes.push('Foto profil diperbarui');
  if (newPubs !== cmsData.stats.publications) changes.push(`Publikasi: ${newPubs}`);
  if (newCitations !== cmsData.stats.citations) changes.push(`Sitasi: ${newCitations}`);

  if (changes.length === 0) {
    await cmsAlert('Tidak ada perubahan yang terdeteksi.', 'info');
    return;
  }

  const ok = await cmsModal({
    icon: '🛡️',
    title: 'Konfirmasi Simpan Profil',
    body: 'Periksa ringkasan perubahan berikut sebelum diterapkan ke website:',
    changes,
    confirmLabel: 'Ya, Simpan Profil'
  });

  if (!ok) return;

  cmsData.profile.name = newName;
  cmsData.profile.subtitle = newSubtitle;
  cmsData.profile.institution = newInstitution;
  cmsData.profile.email = newEmail;
  cmsData.profile.tagline = newTagline;
  cmsData.profile.avatar = newAvatar;
  cmsData.stats.publications = newPubs;
  cmsData.stats.citations = newCitations;
  cmsData.stats.years = newYears;
  cmsData.stats.countries = newCountries;

  saveAllChanges();
}

// 1. Research Focus Management
function renderResearch() {
  const container = document.getElementById('research-cards-edit-container');
  if (!container) return;
  container.innerHTML = '';

  if (!cmsData.research || cmsData.research.length === 0) {
    cmsData.research = [
      { id: "res-1", title: "Signalong Indonesia", image: "assets/foto-profil.jpg", description: "Pengembangan sistem komunikasi berbasis kata kunci..." },
      { id: "res-2", title: "Pendidikan Inklusif", image: "assets/foto-profil.jpg", description: "Riset komparatif lintas budaya..." },
      { id: "res-3", title: "Pendidikan Tunarungu", image: "assets/foto-profil.jpg", description: "Strategi literasi & media visual..." },
      { id: "res-4", title: "Anak Berkebutuhan Khusus", image: "assets/foto-profil.jpg", description: "Intervensi berbasis bukti..." }
    ];
  }

  cmsData.research.forEach((res, index) => {
    const card = document.createElement('div');
    card.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; padding: 1.25rem; border-radius: 12px;';
    card.innerHTML = `
      <h4 style="color: #2563eb; margin-bottom: 0.75rem;">Kartu ${index + 1}: ${res.title}</h4>
      <div class="form-group">
        <label>Judul Riset</label>
        <input type="text" class="form-control" value="${res.title}" onchange="updateResearchItem(${index}, 'title', this.value)">
      </div>
      <div class="form-group">
        <label>🖼️ Gambar Sampul Cover Kartu</label>
        <div style="display: flex; gap: 0.75rem; align-items: center; background: #f8fafc; padding: 0.6rem; border-radius: 8px; border: 1px dashed #cbd5e1;">
          <img id="prev-res-img-${index}" src="${res.image}" style="width: 65px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;" onerror="this.src='assets/foto-profil.jpg';">
          <div style="flex: 1;">
            <input type="file" accept="image/*" class="form-control" style="margin-bottom: 0.3rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;" onchange="uploadResearchFile(this, ${index})">
            <input type="text" id="input-res-img-${index}" class="form-control" style="font-size: 0.85rem;" value="${res.image}" onchange="updateResearchItem(${index}, 'image', this.value)">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Deskripsi Ringkas Kartu</label>
        <textarea class="form-control" style="min-height: 70px;" onchange="updateResearchItem(${index}, 'description', this.value)">${res.description}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateResearchItem(index, key, val) {
  if (cmsData.research[index]) {
    cmsData.research[index][key] = val;
    saveAllChanges(true);
  }
}

// 2. Publikasi Management
function renderPubs() {
  const tbody = document.getElementById('table-pubs-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!cmsData.publications) cmsData.publications = [];

  cmsData.publications.forEach((pub, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge-tag">${escapeHTML(pub.year)}</span></td>
      <td><strong>${escapeHTML(pub.title)}</strong></td>
      <td>${escapeHTML(pub.journal)}</td>
      <td><code style="color: #2563eb; font-weight: 600;">${escapeHTML(pub.type)}</code></td>
      <td>
        <button class="btn-warning btn-sm" onclick="editPublication(${index})" style="margin-right: 4px;">✏️ Edit</button>
        <button class="btn-danger btn-sm" onclick="removePublication(${index})">🗑️ Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function savePublication(e) {
  e.preventDefault();
  const editIndex = parseInt(document.getElementById('pub-edit-index').value);
  const year = document.getElementById('pub-year').value;
  const type = document.getElementById('pub-type').value;
  const journal = document.getElementById('pub-journal').value;
  const title = document.getElementById('pub-title').value;
  const rawUrl = document.getElementById('pub-url').value;
  const url = sanitizeURL(rawUrl);

  const pubObj = {
    id: editIndex >= 0 ? cmsData.publications[editIndex].id : `pub-${Date.now()}`,
    title, journal, year: parseInt(year) || 2026, type, url
  };

  const isEdit = editIndex >= 0;
  const changes = [
    `${isEdit ? 'Edit' : 'Tambah'} publikasi: "${title.slice(0, 70)}${title.length > 70 ? '...' : ''}"`,
    `Jurnal: ${journal}`, `Tahun: ${year}`, `Kategori: ${type}`
  ];

  const ok = await cmsModal({
    icon: '📝',
    title: isEdit ? 'Konfirmasi Edit Publikasi' : 'Konfirmasi Tambah Publikasi',
    body: 'Periksa ringkasan publikasi yang akan disimpan:',
    changes,
    confirmLabel: isEdit ? 'Ya, Simpan Perubahan' : 'Ya, Tambahkan'
  });

  if (!ok) return;

  if (isEdit) {
    cmsData.publications[editIndex] = pubObj;
  } else {
    cmsData.publications.unshift(pubObj);
  }

  resetPubForm();
  renderPubs();
  saveAllChanges();
}

function editPublication(index) {
  const pub = cmsData.publications[index];
  if (!pub) return;

  document.getElementById('pub-edit-index').value = index;
  document.getElementById('pub-year').value = pub.year;
  document.getElementById('pub-type').value = pub.type;
  document.getElementById('pub-journal').value = pub.journal;
  document.getElementById('pub-title').value = pub.title;
  document.getElementById('pub-url').value = pub.url;

  document.getElementById('pub-form-title').innerText = '✏️ Edit Data Publikasi';
  document.getElementById('btn-save-pub').innerText = '💾 Simpan Perubahan Publikasi';
  document.getElementById('btn-cancel-pub').style.display = 'inline-block';

  window.scrollTo({ top: 100, behavior: 'smooth' });
}

function resetPubForm() {
  document.getElementById('pub-edit-index').value = "-1";
  document.getElementById('form-pub').reset();
  document.getElementById('pub-form-title').innerText = '➕ Tambah Publikasi Baru';
  document.getElementById('btn-save-pub').innerText = '➕ Simpan Publikasi ke CMS';
  document.getElementById('btn-cancel-pub').style.display = 'none';
}

async function removePublication(index) {
  const pub = cmsData.publications[index];
  if (!pub) return;
  const ok = await cmsModal({
    icon: '🗑️',
    title: 'Hapus Publikasi?',
    body: 'Publikasi berikut akan dihapus permanen dan tidak dapat dikembalikan.',
    changes: [`"${pub.title.slice(0, 70)}${pub.title.length > 70 ? '...' : ''}"`, `Jurnal: ${pub.journal} (${pub.year})`],
    isDanger: true,
    confirmLabel: 'Ya, Hapus Permanen'
  });
  if (ok) {
    cmsData.publications.splice(index, 1);
    renderPubs();
    saveAllChanges();
  }
}

// 3. Blog Management
function renderBlog() {
  const tbody = document.getElementById('table-blog-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!cmsData.blog) cmsData.blog = [];

  cmsData.blog.forEach((post, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${escapeHTML(post.id)}</code></td>
      <td><strong>${escapeHTML(post.title)}</strong></td>
      <td><span class="badge-tag">${escapeHTML(post.category)}</span></td>
      <td>${escapeHTML(post.date)}</td>
      <td>
        <button class="btn-warning btn-sm" onclick="editBlogPost(${index})" style="margin-right: 4px;">✏️ Edit</button>
        <button class="btn-danger btn-sm" onclick="removeBlogPost(${index})">🗑️ Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveBlogPost(e) {
  e.preventDefault();
  const editIndex = parseInt(document.getElementById('blog-edit-index').value);
  const id = document.getElementById('blog-id').value;
  const category = document.getElementById('blog-category').value;
  const date = document.getElementById('blog-date').value;
  const title = document.getElementById('blog-title').value;
  const summary = document.getElementById('blog-summary').value;
  const content = document.getElementById('blog-content').value;

  const postObj = {
    id: id || `post-${Date.now()}`,
    title, category, date, readTime: '5 min baca', summary, content
  };

  const isEdit = editIndex >= 0;
  const ok = await cmsModal({
    icon: '✏️',
    title: isEdit ? 'Konfirmasi Edit Artikel' : 'Konfirmasi Tambah Artikel',
    body: 'Artikel blog berikut akan disimpan ke website:',
    changes: [`Judul: "${title}"`, `Kategori: ${category}`, `Tanggal: ${date}`],
    confirmLabel: isEdit ? 'Ya, Simpan Perubahan' : 'Ya, Publikasikan'
  });
  if (!ok) return;

  if (isEdit) {
    cmsData.blog[editIndex] = postObj;
  } else {
    cmsData.blog.unshift(postObj);
  }
  resetBlogForm();
  renderBlog();
  saveAllChanges();
}

function editBlogPost(index) {
  const post = cmsData.blog[index];
  if (!post) return;

  document.getElementById('blog-edit-index').value = index;
  document.getElementById('blog-id').value = post.id;
  document.getElementById('blog-category').value = post.category;
  document.getElementById('blog-date').value = post.date;
  document.getElementById('blog-title').value = post.title;
  document.getElementById('blog-summary').value = post.summary;
  document.getElementById('blog-content').value = post.content;

  document.getElementById('blog-form-title').innerText = '✏️ Edit Artikel Blog';
  document.getElementById('btn-save-blog').innerText = '💾 Simpan Perubahan Artikel';
  document.getElementById('btn-cancel-blog').style.display = 'inline-block';

  window.scrollTo({ top: 100, behavior: 'smooth' });
}

function resetBlogForm() {
  document.getElementById('blog-edit-index').value = "-1";
  document.getElementById('form-blog').reset();
  document.getElementById('blog-form-title').innerText = '➕ Tambah Artikel Blog Baru';
  document.getElementById('btn-save-blog').innerText = '➕ Simpan Artikel Blog';
  document.getElementById('btn-cancel-blog').style.display = 'none';
}

async function removeBlogPost(index) {
  const post = cmsData.blog[index];
  if (!post) return;
  const ok = await cmsModal({
    icon: '🗑️',
    title: 'Hapus Artikel Blog?',
    body: 'Artikel berikut akan dihapus permanen.',
    changes: [`"${post.title}"`, `Kategori: ${post.category}`, `Tanggal: ${post.date}`],
    isDanger: true,
    confirmLabel: 'Ya, Hapus Artikel'
  });
  if (ok) {
    cmsData.blog.splice(index, 1);
    renderBlog();
    saveAllChanges();
  }
}

// 4. Galeri Management
function renderGallery() {
  const tbody = document.getElementById('table-gallery-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!cmsData.gallery) cmsData.gallery = [];

  cmsData.gallery.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.image || 'assets/foto-profil.jpg'}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;" onerror="this.src='assets/foto-profil.jpg';"></td>
      <td><strong>${item.title}</strong></td>
      <td>${item.description}</td>
      <td>
        <button class="btn-warning btn-sm" onclick="editGalleryItem(${index})" style="margin-right: 4px;">✏️ Edit</button>
        <button class="btn-danger btn-sm" onclick="removeGalleryItem(${index})">🗑️ Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveGalleryItem(e) {
  e.preventDefault();
  const editIndex = parseInt(document.getElementById('gal-edit-index').value);
  const title = document.getElementById('gal-title').value;
  const image = document.getElementById('gal-image').value || 'assets/foto-profil.jpg';
  const description = document.getElementById('gal-desc').value;

  const galObj = {
    id: editIndex >= 0 ? cmsData.gallery[editIndex].id : `gal-${Date.now()}`,
    image, title, description
  };

  const isEdit = editIndex >= 0;
  const ok = await cmsModal({
    icon: '🖼️',
    title: isEdit ? 'Konfirmasi Edit Galeri' : 'Konfirmasi Tambah Galeri',
    body: 'Item galeri berikut akan disimpan:',
    changes: [`Judul: "${title}"`, `Keterangan: "${description.slice(0, 60)}${description.length > 60 ? '...' : ''}"`, `Foto: ${image.startsWith('data:') ? '[File yang diupload]' : image}`],
    confirmLabel: isEdit ? 'Ya, Simpan Perubahan' : 'Ya, Tambah ke Galeri'
  });
  if (!ok) return;

  if (isEdit) {
    cmsData.gallery[editIndex] = galObj;
  } else {
    cmsData.gallery.unshift(galObj);
  }
  resetGalForm();
  renderGallery();
  saveAllChanges();
}

function editGalleryItem(index) {
  const item = cmsData.gallery[index];
  if (!item) return;

  document.getElementById('gal-edit-index').value = index;
  document.getElementById('gal-title').value = item.title;
  document.getElementById('gal-image').value = item.image;
  document.getElementById('gal-desc').value = item.description;

  if (document.getElementById('prev-gal-image')) {
    document.getElementById('prev-gal-image').src = item.image || 'assets/foto-profil.jpg';
  }

  document.getElementById('gal-form-title').innerText = '✏️ Edit Item Galeri';
  document.getElementById('btn-save-gal').innerText = '💾 Simpan Perubahan Galeri';
  document.getElementById('btn-cancel-gal').style.display = 'inline-block';

  window.scrollTo({ top: 100, behavior: 'smooth' });
}

function resetGalForm() {
  document.getElementById('gal-edit-index').value = "-1";
  document.getElementById('form-gallery').reset();
  document.getElementById('gal-form-title').innerText = '➕ Tambah Dokumentasi Galeri Baru';
  document.getElementById('btn-save-gal').innerText = '➕ Simpan ke Galeri';
  document.getElementById('btn-cancel-gal').style.display = 'none';
  if (document.getElementById('prev-gal-image')) {
    document.getElementById('prev-gal-image').src = 'assets/foto-profil.jpg';
  }
}

async function removeGalleryItem(index) {
  const item = cmsData.gallery[index];
  if (!item) return;
  const ok = await cmsModal({
    icon: '🗑️',
    title: 'Hapus Item Galeri?',
    body: 'Item galeri berikut akan dihapus permanen.',
    changes: [`"${item.title}"`, `Keterangan: ${item.description}`],
    isDanger: true,
    confirmLabel: 'Ya, Hapus dari Galeri'
  });
  if (ok) {
    cmsData.gallery.splice(index, 1);
    renderGallery();
    saveAllChanges();
  }
}

// 5. Video Showcase
function renderVideo() {
  if (!cmsData.video) cmsData.video = {};
  const v = cmsData.video;

  if (document.getElementById('vid-title')) document.getElementById('vid-title').value = v.title || '';
  if (document.getElementById('vid-sub')) document.getElementById('vid-sub').value = v.sub || '';
  if (document.getElementById('vid-small')) document.getElementById('vid-small').value = v.small || '';
  if (document.getElementById('vid-url')) document.getElementById('vid-url').value = v.youtubeUrl || '';
  if (document.getElementById('vid-image')) document.getElementById('vid-image').value = v.image || 'assets/foto-profil.jpg';
  if (document.getElementById('prev-vid-image')) document.getElementById('prev-vid-image').src = v.image || 'assets/foto-profil.jpg';
}

async function saveVideoForm(e) {
  e.preventDefault();
  if (!cmsData.video) cmsData.video = {};

  const newTitle = document.getElementById('vid-title').value;
  const newSub = document.getElementById('vid-sub').value;
  const newSmall = document.getElementById('vid-small').value;
  const newUrl = document.getElementById('vid-url').value;
  const newImage = document.getElementById('vid-image').value;

  const changes = [];
  if (newTitle !== cmsData.video.title) changes.push(`Judul: "${newTitle}"`);
  if (newUrl !== cmsData.video.youtubeUrl) changes.push(`URL Video YouTube diperbarui`);
  if (newImage !== cmsData.video.image) changes.push('Foto banner video diperbarui');

  const ok = await cmsModal({
    icon: '🎥',
    title: 'Konfirmasi Simpan Video',
    body: 'Pengaturan video showcase akan diperbarui:',
    changes: changes.length > 0 ? changes : ['Tidak ada perubahan yang terdeteksi'],
    confirmLabel: 'Ya, Simpan Video'
  });
  if (!ok) return;

  cmsData.video.title = newTitle;
  cmsData.video.sub = newSub;
  cmsData.video.small = newSmall;
  cmsData.video.youtubeUrl = newUrl;
  cmsData.video.image = newImage;

  saveAllChanges();
}

// 6. JSON Export & Download
function updateJSONPreview() {
  const textarea = document.getElementById('json-preview');
  if (textarea) {
    textarea.value = JSON.stringify(cmsData, null, 2);
  }
}

async function downloadJSON() {
  updateJSONPreview();
  const jsonStr = JSON.stringify(cmsData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  await cmsAlert('Berkas content.json berhasil di-download! Simpan file ini ke dalam folder data/ pada proyek Anda untuk deployment permanen.', 'success');
}

async function copyJSON() {
  updateJSONPreview();
  const textarea = document.getElementById('json-preview');
  textarea.select();
  try {
    await navigator.clipboard.writeText(textarea.value);
  } catch(e) {
    document.execCommand('copy');
  }
  await cmsAlert('Kode JSON berhasil disalin ke Clipboard!', 'success');
}
