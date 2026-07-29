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
    
    if (cancelLabel) {
      cancelBtn.style.display = 'inline-flex';
      cancelBtn.textContent = cancelLabel;
    } else {
      cancelBtn.style.display = 'none';
    }

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
  updateGitHubStatusUI();
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
// GitHub REST API Direct Auto-Publish Engine
// ==========================================
function getGitHubConfig() {
  return {
    token: localStorage.getItem('portfolio_github_token') || '',
    repo: localStorage.getItem('portfolio_github_repo') || 'alwnfarhn-netizen/Portofolio-KH',
    branch: localStorage.getItem('portfolio_github_branch') || 'main',
    path: localStorage.getItem('portfolio_github_path') || 'data/content.json'
  };
}

function saveGitHubConfigForm(e) {
  if (e) e.preventDefault();
  const token = document.getElementById('gh-token')?.value.trim() || '';
  const repo = document.getElementById('gh-repo')?.value.trim() || 'alwnfarhn-netizen/Portofolio-KH';
  const branch = document.getElementById('gh-branch')?.value.trim() || 'main';
  const path = document.getElementById('gh-path')?.value.trim() || 'data/content.json';

  localStorage.setItem('portfolio_github_token', token);
  localStorage.setItem('portfolio_github_repo', repo);
  localStorage.setItem('portfolio_github_branch', branch);
  localStorage.setItem('portfolio_github_path', path);

  updateGitHubStatusUI();
  cmsAlert('🔐 Pengaturan GitHub Auto-Publish berhasil disimpan!', 'success');
}

function updateGitHubStatusUI() {
  const config = getGitHubConfig();
  const badge = document.getElementById('gh-status-badge');
  const topBadge = document.getElementById('top-status-badge');
  const tokenInput = document.getElementById('gh-token');
  const repoInput = document.getElementById('gh-repo');
  const branchInput = document.getElementById('gh-branch');
  const pathInput = document.getElementById('gh-path');

  if (tokenInput) tokenInput.value = config.token;
  if (repoInput) repoInput.value = config.repo;
  if (branchInput) branchInput.value = config.branch;
  if (pathInput) pathInput.value = config.path;

  const isConnected = Boolean(config.token && config.token.trim());

  if (badge) {
    if (isConnected) {
      badge.className = 'badge-live';
      badge.style.background = '#ecfdf5';
      badge.style.color = '#047857';
      badge.style.borderColor = '#a7f3d0';
      badge.innerText = '🟢 GitHub Auto-Publish Terhubung';
    } else {
      badge.className = 'badge-live';
      badge.style.background = '#fff7ed';
      badge.style.color = '#c2410c';
      badge.style.borderColor = '#fed7aa';
      badge.innerText = '⚪ Mode Manual (Download content.json)';
    }
  }

  if (topBadge) {
    if (isConnected) {
      topBadge.className = 'badge-live';
      topBadge.style.background = '#ecfdf5';
      topBadge.style.color = '#047857';
      topBadge.style.borderColor = '#a7f3d0';
      topBadge.innerText = '🟢 GitHub Auto-Publish Aktif (Update Otomatis ke khofia.vercel.app)';
    } else {
      topBadge.className = 'badge-live';
      topBadge.style.background = '#fff7ed';
      topBadge.style.color = '#c2410c';
      topBadge.style.borderColor = '#fed7aa';
      topBadge.innerText = '🟠 Mode Preview Lokal (Token GitHub Belum Diisi)';
    }
  }
}

async function syncToGitHubCloud() {
  const config = getGitHubConfig();
  if (!config.token) return { success: false, reason: 'no_token' };

  try {
    const targetPath = config.path || 'data/content.json';
    const apiUrl = `https://api.github.com/repos/${config.repo}/contents/${targetPath}`;
    
    // 1. Get existing file SHA if file exists on repo
    let sha = '';
    const getRes = await fetch(`${apiUrl}?ref=${config.branch}`, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Encode JSON content to UTF-8 Base64
    const jsonString = JSON.stringify(cmsData, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

    // 3. Push commit to GitHub
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'update: publish data/content.json via Admin CMS',
        content: base64Content,
        branch: config.branch,
        ...(sha ? { sha } : {})
      })
    });

    if (putRes.ok) {
      return { success: true };
    } else {
      const errJson = await putRes.json();
      return { success: false, reason: errJson.message || 'HTTP error ' + putRes.status };
    }
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

function loadDefaultJSON() {
  fetchLocalContentJSON();
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

function notifyCrossTabUpdate() {
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('portfolio_cms_sync');
      channel.postMessage({ type: 'DATA_UPDATED', payload: cmsData });
    } catch (e) {}
  }
}

async function saveAllChanges(silent = false) {
  localStorage.setItem('portfolio_cms_data', JSON.stringify(cmsData));
  updateLastSaved();
  updateJSONPreview();
  notifyCrossTabUpdate();

  const ghConfig = getGitHubConfig();
  if (ghConfig.token) {
    if (!silent) {
      cmsAlert('⌛ Menyimpan lokal & mengirim pembaruan langsung ke GitHub Vercel...', 'info');
    }
    const result = await syncToGitHubCloud();
    if (result.success) {
      if (!silent) {
        cmsAlert('🚀 Sukses Publish Live!\n\nPerubahan berhasil di-push ke GitHub (' + ghConfig.repo + '). Vercel sedang memperbarui khofia.vercel.app (otomatis aktif dalam 10-15 detik)!', 'success');
      }
    } else {
      if (!silent) {
        cmsAlert('⚠️ Perubahan tersimpan di browser ini (preview lokal aktif), tetapi gagal publish ke GitHub:\n\n' + result.reason + '\n\nAnda dapat mengunduh berkas content.json dan mengunggahnya manual ke GitHub.', 'danger');
      }
    }
  } else {
    if (!silent) {
      cmsAlert('💾 Perubahan tersimpan di browser ini (preview lokal aktif)!\n\n💡 Catatan untuk update website utama (khofia.vercel.app):\n1. Masukkan Token GitHub pada tab "Simpan & Export" untuk Auto-Publish ke Vercel, ATAU\n2. Klik "Download content.json Terbaru" dan unggah file ke GitHub repo (alwnfarhn-netizen/Portofolio-KH).', 'success');
    }
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

// 0. Profile & Bio Management
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
  if (document.getElementById('prof-badge')) document.getElementById('prof-badge').value = p.badgeText || 'Fakultas Ilmu Pendidikan · UNESA';
  if (document.getElementById('prof-doc-degree')) document.getElementById('prof-doc-degree').value = p.doctorDegree || 'Gelar Doktor (Ph.D.)';
  if (document.getElementById('prof-doc-univ')) document.getElementById('prof-doc-univ').value = p.doctorUniv || 'Pedagogical Univ. of Cracow';
  
  if (document.getElementById('prof-bio1')) document.getElementById('prof-bio1').value = p.aboutBio1 || '';
  if (document.getElementById('prof-bio2')) document.getElementById('prof-bio2').value = p.aboutBio2 || '';
  if (document.getElementById('prof-skills')) document.getElementById('prof-skills').value = Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || '');

  if (document.getElementById('prof-scholar')) document.getElementById('prof-scholar').value = p.scholar || '';
  if (document.getElementById('prof-rg')) document.getElementById('prof-rg').value = p.researchgate || '';
  if (document.getElementById('prof-scopus')) document.getElementById('prof-scopus').value = p.scopus || '';

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
  const newBadge = document.getElementById('prof-badge').value;
  const newDocDegree = document.getElementById('prof-doc-degree').value;
  const newDocUniv = document.getElementById('prof-doc-univ').value;
  const newBio1 = document.getElementById('prof-bio1').value;
  const newBio2 = document.getElementById('prof-bio2').value;
  const newSkills = document.getElementById('prof-skills').value;
  const newScholar = document.getElementById('prof-scholar').value;
  const newRg = document.getElementById('prof-rg').value;
  const newScopus = document.getElementById('prof-scopus').value;

  const newAvatar = document.getElementById('prof-avatar').value;
  const newPubs = document.getElementById('stat-pubs').value;
  const newCitations = document.getElementById('stat-citations').value;
  const newYears = document.getElementById('stat-years').value;
  const newCountries = document.getElementById('stat-countries').value;

  const ok = await cmsModal({
    icon: '🛡️',
    title: 'Konfirmasi Simpan Profil & Bio',
    body: 'Apakah Anda yakin ingin memperbarui informasi profil utama & biodata akademik?',
    confirmLabel: 'Ya, Simpan Profil'
  });

  if (!ok) return;

  cmsData.profile.name = newName;
  cmsData.profile.subtitle = newSubtitle;
  cmsData.profile.institution = newInstitution;
  cmsData.profile.email = newEmail;
  cmsData.profile.tagline = newTagline;
  cmsData.profile.badgeText = newBadge;
  cmsData.profile.doctorDegree = newDocDegree;
  cmsData.profile.doctorUniv = newDocUniv;
  cmsData.profile.aboutBio1 = newBio1;
  cmsData.profile.aboutBio2 = newBio2;
  cmsData.profile.skills = newSkills;
  cmsData.profile.scholar = newScholar;
  cmsData.profile.researchgate = newRg;
  cmsData.profile.scopus = newScopus;

  cmsData.profile.avatar = newAvatar;
  cmsData.stats.publications = newPubs;
  cmsData.stats.citations = newCitations;
  cmsData.stats.years = newYears;
  cmsData.stats.countries = newCountries;

  saveAllChanges();
}

// 0.5. Timelines (Pendidikan & Karier) Management
function renderTimelines() {
  if (!cmsData.timelines) cmsData.timelines = { education: [], career: [] };
  const eduTbody = document.getElementById('table-edu-body');
  const carTbody = document.getElementById('table-car-body');

  if (eduTbody) {
    eduTbody.innerHTML = '';
    (cmsData.timelines.education || []).forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge-tag">${escapeHTML(item.period)}</span></td>
        <td><strong>${escapeHTML(item.degree)}</strong></td>
        <td>${escapeHTML(item.institution)}</td>
        <td>${escapeHTML(item.detail || '-')}</td>
        <td>
          <button class="btn-warning btn-sm" onclick="editEduItem(${index})" style="margin-right: 4px;">✏️ Edit</button>
          <button class="btn-danger btn-sm" onclick="removeEduItem(${index})">🗑️ Hapus</button>
        </td>
      `;
      eduTbody.appendChild(tr);
    });
  }

  if (carTbody) {
    carTbody.innerHTML = '';
    (cmsData.timelines.career || []).forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge-tag">${escapeHTML(item.period)}</span></td>
        <td><strong>${escapeHTML(item.role || item.degree)}</strong></td>
        <td>${escapeHTML(item.institution)}</td>
        <td>
          <button class="btn-warning btn-sm" onclick="editCarItem(${index})" style="margin-right: 4px;">✏️ Edit</button>
          <button class="btn-danger btn-sm" onclick="removeCarItem(${index})">🗑️ Hapus</button>
        </td>
      `;
      carTbody.appendChild(tr);
    });
  }
}

async function saveEducationForm(e) {
  e.preventDefault();
  if (!cmsData.timelines) cmsData.timelines = { education: [], career: [] };
  if (!cmsData.timelines.education) cmsData.timelines.education = [];

  const editIndex = parseInt(document.getElementById('edu-edit-index').value);
  const period = document.getElementById('edu-period').value;
  const degree = document.getElementById('edu-degree').value;
  const institution = document.getElementById('edu-institution').value;
  const detail = document.getElementById('edu-detail').value;

  const itemObj = {
    id: editIndex >= 0 ? cmsData.timelines.education[editIndex].id : `edu-${Date.now()}`,
    period, degree, institution, detail
  };

  const isEdit = editIndex >= 0;
  if (isEdit) {
    cmsData.timelines.education[editIndex] = itemObj;
  } else {
    cmsData.timelines.education.push(itemObj);
  }

  resetEduForm();
  renderTimelines();
  saveAllChanges();
}

function editEduItem(index) {
  const item = cmsData.timelines.education[index];
  if (!item) return;

  document.getElementById('edu-edit-index').value = index;
  document.getElementById('edu-period').value = item.period;
  document.getElementById('edu-degree').value = item.degree;
  document.getElementById('edu-institution').value = item.institution;
  document.getElementById('edu-detail').value = item.detail || '';

  document.getElementById('edu-form-title').innerText = '✏️ Edit Riwayat Pendidikan';
  document.getElementById('btn-save-edu').innerText = '💾 Simpan Perubahan';
  document.getElementById('btn-cancel-edu').style.display = 'inline-block';
}

function resetEduForm() {
  document.getElementById('edu-edit-index').value = "-1";
  document.getElementById('form-edu').reset();
  document.getElementById('edu-form-title').innerText = '➕ Tambah Riwayat Pendidikan';
  document.getElementById('btn-save-edu').innerText = '➕ Tambah ke Riwayat';
  document.getElementById('btn-cancel-edu').style.display = 'none';
}

async function removeEduItem(index) {
  const item = cmsData.timelines.education[index];
  if (!item) return;
  const ok = await cmsModal({
    icon: '🗑️', title: 'Hapus Riwayat Pendidikan?',
    body: `Apakah Anda yakin ingin menghapus "${item.degree} (${item.period})"?`,
    isDanger: true, confirmLabel: 'Ya, Hapus'
  });
  if (ok) {
    cmsData.timelines.education.splice(index, 1);
    renderTimelines();
    saveAllChanges();
  }
}

async function saveCareerForm(e) {
  e.preventDefault();
  if (!cmsData.timelines) cmsData.timelines = { education: [], career: [] };
  if (!cmsData.timelines.career) cmsData.timelines.career = [];

  const editIndex = parseInt(document.getElementById('car-edit-index').value);
  const period = document.getElementById('car-period').value;
  const role = document.getElementById('car-role').value;
  const institution = document.getElementById('car-institution').value;

  const itemObj = {
    id: editIndex >= 0 ? cmsData.timelines.career[editIndex].id : `car-${Date.now()}`,
    period, role, institution
  };

  const isEdit = editIndex >= 0;
  if (isEdit) {
    cmsData.timelines.career[editIndex] = itemObj;
  } else {
    cmsData.timelines.career.push(itemObj);
  }

  resetCarForm();
  renderTimelines();
  saveAllChanges();
}

function editCarItem(index) {
  const item = cmsData.timelines.career[index];
  if (!item) return;

  document.getElementById('car-edit-index').value = index;
  document.getElementById('car-period').value = item.period;
  document.getElementById('car-role').value = item.role || item.degree;
  document.getElementById('car-institution').value = item.institution;

  document.getElementById('car-form-title').innerText = '✏️ Edit Riwayat Karier';
  document.getElementById('btn-save-car').innerText = '💾 Simpan Perubahan';
  document.getElementById('btn-cancel-car').style.display = 'inline-block';
}

function resetCarForm() {
  document.getElementById('car-edit-index').value = "-1";
  document.getElementById('form-car').reset();
  document.getElementById('car-form-title').innerText = '➕ Tambah Riwayat Karier';
  document.getElementById('btn-save-car').innerText = '➕ Tambah ke Karier';
  document.getElementById('btn-cancel-car').style.display = 'none';
}

async function removeCarItem(index) {
  const item = cmsData.timelines.career[index];
  if (!item) return;
  const ok = await cmsModal({
    icon: '🗑️', title: 'Hapus Riwayat Karier?',
    body: `Apakah Anda yakin ingin menghapus "${item.role || item.degree} (${item.period})"?`,
    isDanger: true, confirmLabel: 'Ya, Hapus'
  });
  if (ok) {
    cmsData.timelines.career.splice(index, 1);
    renderTimelines();
    saveAllChanges();
  }
}

// 0.6. Academic Profiles Management
function renderAcademicProfiles() {
  const tbody = document.getElementById('table-academic-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!cmsData.academicProfiles) cmsData.academicProfiles = [];

  cmsData.academicProfiles.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge-tag" style="background:${item.color || '#2563eb'}; color:#fff;">${escapeHTML(item.code || 'PR')}</span></td>
      <td><strong>${escapeHTML(item.name)}</strong></td>
      <td>${escapeHTML(item.stat)}</td>
      <td><a href="${escapeHTML(item.url)}" target="_blank" style="color:#2563eb; font-size:0.85rem;">Tautan ↗</a></td>
      <td>
        <button class="btn-warning btn-sm" onclick="editAcademicProfile(${index})" style="margin-right: 4px;">✏️ Edit</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editAcademicProfile(index) {
  const item = cmsData.academicProfiles[index];
  if (!item) return;

  document.getElementById('acad-edit-index').value = index;
  document.getElementById('acad-name').value = item.name;
  document.getElementById('acad-stat').value = item.stat;
  document.getElementById('acad-url').value = item.url;
  document.getElementById('acad-code').value = item.code || '';
  document.getElementById('acad-color').value = item.color || '#2563eb';

  document.getElementById('acad-form-title').innerText = `✏️ Edit Kartu ${item.name}`;
  document.getElementById('btn-save-acad').innerText = '💾 Simpan Perubahan Profil';
  window.scrollTo({ top: 100, behavior: 'smooth' });
}

async function saveAcademicProfileForm(e) {
  e.preventDefault();
  const index = parseInt(document.getElementById('acad-edit-index').value);
  if (index >= 0 && cmsData.academicProfiles[index]) {
    cmsData.academicProfiles[index].name = document.getElementById('acad-name').value;
    cmsData.academicProfiles[index].stat = document.getElementById('acad-stat').value;
    cmsData.academicProfiles[index].url = document.getElementById('acad-url').value;
    cmsData.academicProfiles[index].code = document.getElementById('acad-code').value;
    cmsData.academicProfiles[index].color = document.getElementById('acad-color').value;

    renderAcademicProfiles();
    saveAllChanges();
  }
}

// 0.7. Contact & Footer Management
function renderContact() {
  if (!cmsData.contact) cmsData.contact = {};
  const c = cmsData.contact;

  if (document.getElementById('contact-title')) document.getElementById('contact-title').value = c.title || '';
  if (document.getElementById('contact-desc')) document.getElementById('contact-desc').value = c.description || '';
  if (document.getElementById('contact-email')) document.getElementById('contact-email').value = c.email || '';
  if (document.getElementById('contact-footer')) document.getElementById('contact-footer').value = c.footerText || '';
}

async function saveContactForm(e) {
  e.preventDefault();
  if (!cmsData.contact) cmsData.contact = {};

  cmsData.contact.title = document.getElementById('contact-title').value;
  cmsData.contact.description = document.getElementById('contact-desc').value;
  cmsData.contact.email = document.getElementById('contact-email').value;
  cmsData.contact.footerText = document.getElementById('contact-footer').value;

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
