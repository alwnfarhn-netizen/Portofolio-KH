document.addEventListener('DOMContentLoaded', () => {
  let appData = { profile: {}, stats: {}, video: {}, publications: [], blog: [], gallery: [], research: [] };

  // ==========================================
  // Bilingual i18n Translation Engine (ID | EN)
  // ==========================================
  const i18nData = {
    id: {
      nav_about: "Tentang",
      nav_research: "Fokus Riset",
      nav_pubs: "Publikasi",
      nav_blog: "Blog & Catatan",
      nav_gallery: "Galeri",
      nav_profiles: "Profil Akademik",
      nav_contact: "Kontak",
      hero_badge: "Fakultas Ilmu Pendidikan · UNESA",
      hero_subtitle: "Kepala Prodi & Dosen Pendidikan Luar Biasa",
      hero_tagline: "Peneliti Pendidikan Inklusif & Pendidikan Luar Biasa. Berfokus pada intervensi komunikasi (Signalong Indonesia), sikap guru lintas budaya, dan hak disabilitas.",
      hero_btn_pub: "Lihat Publikasi Terpilih →",
      stat_pubs: "Publikasi Riset",
      stat_citations: "Sitasi Google Scholar",
      stat_years: "Tahun Mengajar",
      stat_countries: "Negara Kolaborasi",
      about_subtitle: "Profil Ringkas",
      about_title: "Tentang Saya",
      about_bio_title: "Biografi Akademik",
      about_skills_title: "Bidang Keahlian & Minat Riset",
      timeline_edu: "Riwayat Pendidikan",
      timeline_exp: "Karier & Jabatan",
      research_subtitle: "Pilar Akademik",
      research_title: "Bidang Riset Utama",
      research_desc: "Fokus riset dedikatif untuk mendorong aksesibilitas dan kesetaraan hak pendidikan bagi anak berkebutuhan khusus.",
      video_tag: "DOKUMENTASI RISET & INOVASI",
      video_title: "Signalong Indonesia",
      video_sub: "@ FIP UNESA, Surabaya",
      video_small: "Riset & Pengabdian 2026",
      video_btn: "PUTAR VIDEO",
      pub_subtitle: "Karya Ilmiah",
      pub_title: "Publikasi & Jurnal Terpilih",
      pub_desc: "Gunakan filter kategori dan pencarian langsung untuk menjelajahi 45+ artikel ilmiah bereputasi internasional.",
      pub_search_placeholder: "Cari kata kunci judul paper atau jurnal...",
      pub_cta_btn: "Lihat Semua 45+ Publikasi di ResearchGate →",
      filter_all: "Semua",
      filter_scopus: "Scopus & Bereputasi",
      filter_inclusive: "Pendidikan Inklusif",
      filter_signalong: "Signalong Indonesia",
      paper_view_link: "Lihat Paper ↗",
      blog_subtitle: "Catatan & Opini Riset",
      blog_title: "Blog Akademik",
      blog_desc: "Artikel ringkas mengenai perkembangan riset pendidikan inklusif, pengabdian masyarakat, dan catatan kepakaran.",
      blog_read_btn: "Baca Selengkapnya →",
      gallery_subtitle: "Dokumentasi Lapangan",
      gallery_title: "Galeri Kegiatan & Pengabdian",
      gallery_desc: "Dokumentasi riset lapangan, pengabdian masyarakat, dan kegiatan akademik internasional.",
      profiles_subtitle: "Jaringan Akademik",
      profiles_title: "Profil & Database Riset",
      profiles_desc: "Tautan langsung ke berbagai indeksasi riset dan direktori profil publik akademis.",
      profile_visit_btn: "Kunjungi Profil →",
      contact_subtitle: "Kolaborasi & Diskusi",
      contact_title: "Tertarik Berkolaborasi Riset?",
      contact_desc: "Terbuka untuk kolaborasi riset antar perguruan tinggi, pembicara seminar, proyek intervensi inklusi, dan diskusi akademik seputar pendidikan luar biasa.",
      contact_btn: "Kirim Email Sekarang",
      contact_dept: "Departemen Pendidikan Luar Biasa",
      contact_fac: "Fakultas Ilmu Pendidikan (FIP) UNESA",
      contact_loc: "Surabaya, Jawa Timur, Indonesia",
      footer_copy: "All rights reserved."
    },
    en: {
      nav_about: "About",
      nav_research: "Research Focus",
      nav_pubs: "Publications",
      nav_blog: "Blog & Notes",
      nav_gallery: "Gallery",
      nav_profiles: "Academic Profiles",
      nav_contact: "Contact",
      hero_badge: "Faculty of Educational Sciences · UNESA",
      hero_subtitle: "Head of Department & Senior Lecturer in Special Education",
      hero_tagline: "Researcher in Inclusive Education & Special Needs Education. Focusing on Keyword Sign Systems (Signalong Indonesia), Cross-Cultural Teacher Attitudes, and Disability Rights.",
      hero_btn_pub: "View Featured Publications →",
      stat_pubs: "Research Publications",
      stat_citations: "Google Scholar Citations",
      stat_years: "Years Teaching",
      stat_countries: "Collaboration Countries",
      about_subtitle: "Brief Profile",
      about_title: "About Me",
      about_bio_title: "Academic Biography",
      about_skills_title: "Areas of Expertise & Research Interests",
      timeline_edu: "Educational Background",
      timeline_exp: "Career & Leadership",
      research_subtitle: "Academic Pillars",
      research_title: "Main Research Areas",
      research_desc: "Dedicated research focus to promote accessibility and equal rights to education for children with special needs.",
      video_tag: "RESEARCH & INNOVATION DOCUMENTARY",
      video_title: "Signalong Indonesia",
      video_sub: "@ FIP UNESA, Surabaya",
      video_small: "Research & Community Outreach 2026",
      video_btn: "PLAY VIDEO",
      pub_subtitle: "Scholarly Works",
      pub_title: "Featured Publications & Journals",
      pub_desc: "Use category filters and live search to explore 45+ internationally reputable scientific papers.",
      pub_search_placeholder: "Search paper title or journal keywords...",
      pub_cta_btn: "View All 45+ Publications on ResearchGate →",
      filter_all: "All",
      filter_scopus: "Scopus & Reputable",
      filter_inclusive: "Inclusive Education",
      filter_signalong: "Signalong Indonesia",
      paper_view_link: "View Paper ↗",
      blog_subtitle: "Notes & Research Insights",
      blog_title: "Academic Blog",
      blog_desc: "Concise articles on inclusive education research developments, community service, and expert insights.",
      blog_read_btn: "Read Full Article →",
      gallery_subtitle: "Field Documentation",
      gallery_title: "Activities & Community Outreach",
      gallery_desc: "Documentation of field research, community service, and international academic activities.",
      profiles_subtitle: "Academic Networks",
      profiles_title: "Profiles & Research Databases",
      profiles_desc: "Direct links to various research indexings and academic public profile directories.",
      profile_visit_btn: "Visit Profile →",
      contact_subtitle: "Collaboration & Inquiries",
      contact_title: "Interested in Research Collaboration?",
      contact_desc: "Open for inter-university research collaborations, keynote speaking, inclusive intervention projects, and academic inquiries regarding special education.",
      contact_btn: "Send Email Now",
      contact_dept: "Department of Special Education",
      contact_fac: "Faculty of Educational Sciences (FIP) UNESA",
      contact_loc: "Surabaya, East Java, Indonesia",
      footer_copy: "All rights reserved."
    }
  };

  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('pref_lang') || 'id';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pref_lang', lang);

    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18nData[lang] && i18nData[lang][key]) {
        el.innerText = i18nData[lang][key];
      }
    });

    const searchInput = document.getElementById('pub-search-input');
    if (searchInput && i18nData[lang]['pub_search_placeholder']) {
      searchInput.placeholder = i18nData[lang]['pub_search_placeholder'];
    }

    // Dynamic buttons translation
    if (i18nData[lang]) {
      document.querySelectorAll('.paper-link').forEach(el => el.innerText = i18nData[lang].paper_view_link);
      document.querySelectorAll('.profile-btn').forEach(el => el.innerText = i18nData[lang].profile_visit_btn);
      document.querySelectorAll('.blog-read-btn').forEach(el => el.innerText = i18nData[lang].blog_read_btn);
    }
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      applyLanguage(selectedLang);
    });
  });

  applyLanguage(currentLang);

  // ==========================================
  // Mobile Hamburger Menu Controller
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const drawerClose = document.getElementById('drawer-close');

  function openMobileMenu() {
    hamburgerBtn?.classList.add('is-open');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.classList.add('is-open');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Show overlay
    if (mobileOverlay) {
      mobileOverlay.style.display = 'block';
      requestAnimationFrame(() => mobileOverlay.classList.add('is-visible'));
    }
  }

  function closeMobileMenu() {
    hamburgerBtn?.classList.remove('is-open');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.classList.remove('is-open');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (mobileOverlay) {
      mobileOverlay.classList.remove('is-visible');
      setTimeout(() => { mobileOverlay.style.display = 'none'; }, 300);
    }
  }

  hamburgerBtn?.addEventListener('click', (e) => { e.stopPropagation(); openMobileMenu(); });
  drawerClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Close drawer when any drawer link is clicked
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // Sync lang buttons in drawer with main lang switcher
  document.querySelectorAll('.mobile-drawer .lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
      });
      applyLanguage(lang);
      localStorage.setItem('portfolio_lang', lang);
    });
  });

  // ==========================================
  // Cross-Tab Live Sync & Data Engine
  // ==========================================
  
  // Instant Cross-Tab Live Sync Listener (Updates main page without page refresh)
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('portfolio_cms_sync');
      channel.onmessage = (event) => {
        if (event.data && event.data.payload) {
          appData = event.data.payload;
          renderAllDynamicContent(appData);
        }
      };
    } catch(e) {}
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio_cms_data' && e.newValue) {
      try {
        appData = JSON.parse(e.newValue);
        renderAllDynamicContent(appData);
      } catch (err) {}
    }
  });

  // 1. Data Loader & Dynamic Renderer Engine
  loadAppData();

  async function loadAppData() {
    // A. Check LocalStorage first for instant local rendering (admin preview)
    const localSaved = localStorage.getItem('portfolio_cms_data');
    if (localSaved) {
      try {
        appData = JSON.parse(localSaved);
        renderAllDynamicContent(appData);
      } catch (e) {}
    }

    // B. Fetch fresh data/content.json with cache busting to get published production content
    try {
      const res = await fetch(`data/content.json?v=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // If user has no local override, apply published content
        if (!localSaved) {
          appData = data;
          renderAllDynamicContent(data);
        }
      }
    } catch (err) {
      console.log('Using fallback content');
    }
  }

  function renderAllDynamicContent(data) {
    if (data.profile) renderProfileInfo(data.profile);
    if (data.stats) renderStatsInfo(data.stats);
    if (data.timelines) renderTimelines(data.timelines);
    if (data.video) renderVideoInfo(data.video);
    if (data.research && data.research.length > 0) renderResearchCards(data.research);
    if (data.publications && data.publications.length > 0) renderPublicationCards(data.publications);
    if (data.blog && data.blog.length > 0) renderBlogCards(data.blog);
    if (data.gallery && data.gallery.length > 0) renderGalleryCards(data.gallery);
    if (data.academicProfiles && data.academicProfiles.length > 0) renderAcademicProfiles(data.academicProfiles);
    if (data.contact) renderContactInfo(data.contact);
  }

  function renderProfileInfo(p) {
    if (p.name) {
      const el = document.querySelector('.hero-title');
      if (el) el.innerText = p.name;
    }
    if (p.subtitle) {
      if (i18nData.id) i18nData.id.hero_subtitle = p.subtitle;
      const el = document.querySelector('.hero-subtitle');
      if (el) el.innerText = p.subtitle;
    }
    if (p.institution) {
      const el = document.querySelector('.hero-institution');
      if (el) el.innerText = p.institution;
    }
    if (p.tagline) {
      if (i18nData.id) i18nData.id.hero_tagline = p.tagline;
      const el = document.querySelector('.hero-tagline');
      if (el) el.innerText = p.tagline;
    }
    if (p.badgeText) {
      const el = document.querySelector('.hero-badge');
      if (el) {
        const svg = el.querySelector('svg');
        el.innerHTML = '';
        if (svg) el.appendChild(svg);
        el.appendChild(document.createTextNode(' ' + p.badgeText));
      }
    }
    if (p.doctorDegree) {
      const el = document.querySelector('.doctor-badge-text p');
      if (el) el.innerText = p.doctorDegree;
    }
    if (p.doctorUniv) {
      const el = document.querySelector('.doctor-badge-text h4');
      if (el) el.innerText = p.doctorUniv;
    }
    if (p.avatar) {
      const img = document.querySelector('.hero-image-card img');
      if (img) img.src = p.avatar;
    }
    if (p.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.href = `mailto:${p.email}`);
    }

    // Bio Paragraphs
    const bioTexts = document.querySelectorAll('.bio-card .bio-text');
    if (bioTexts.length >= 1 && p.aboutBio1) bioTexts[0].innerText = p.aboutBio1;
    if (bioTexts.length >= 2 && p.aboutBio2) bioTexts[1].innerText = p.aboutBio2;

    // Skills Chips
    if (p.skills) {
      const wrapper = document.querySelector('.skills-wrapper');
      if (wrapper) {
        wrapper.innerHTML = '';
        const skillsArr = Array.isArray(p.skills) ? p.skills : p.skills.split(',');
        skillsArr.forEach(skill => {
          const s = skill.trim();
          if (s) {
            const chip = document.createElement('span');
            chip.className = 'skill-chip';
            chip.innerText = s;
            wrapper.appendChild(chip);
          }
        });
      }
    }

    // Social Links
    if (p.scholar) {
      document.querySelectorAll('a[title="Google Scholar"]').forEach(a => a.href = p.scholar);
    }
    if (p.researchgate) {
      document.querySelectorAll('a[title="ResearchGate"]').forEach(a => a.href = p.researchgate);
    }
    if (p.scopus) {
      document.querySelectorAll('a[title="Scopus ID"]').forEach(a => a.href = p.scopus);
    }
  }

  function renderTimelines(t) {
    if (!t) return;

    // Education Timeline
    if (t.education && t.education.length > 0) {
      const eduContainer = document.querySelector('.timeline-card .timeline-group:first-child .timeline-list');
      if (eduContainer) {
        eduContainer.innerHTML = '';
        t.education.forEach(item => {
          const div = document.createElement('div');
          div.className = 'timeline-item';
          div.innerHTML = `
            <div class="timeline-period">${item.period || ''}</div>
            <div class="timeline-degree">${item.degree || ''}</div>
            <div class="timeline-institution">${item.institution || ''}</div>
            ${item.detail ? `<div class="timeline-detail">${item.detail}</div>` : ''}
          `;
          eduContainer.appendChild(div);
        });
      }
    }

    // Career Timeline
    if (t.career && t.career.length > 0) {
      const carContainer = document.querySelector('.timeline-card .timeline-group:last-child .timeline-list');
      if (carContainer) {
        carContainer.innerHTML = '';
        t.career.forEach(item => {
          const div = document.createElement('div');
          div.className = 'timeline-item';
          div.innerHTML = `
            <div class="timeline-period">${item.period || ''}</div>
            <div class="timeline-degree">${item.role || item.degree || ''}</div>
            <div class="timeline-institution">${item.institution || ''}</div>
          `;
          carContainer.appendChild(div);
        });
      }
    }
  }

  function renderAcademicProfiles(profiles) {
    const container = document.querySelector('.profiles-grid');
    if (!container || !profiles || profiles.length === 0) return;
    
    container.innerHTML = '';
    profiles.forEach(p => {
      const card = document.createElement('div');
      card.className = 'profile-card';
      if (p.color) card.style.setProperty('--platform-color', p.color);
      card.innerHTML = `
        <div>
          <div class="profile-header">
            <div class="profile-icon-box">${p.code || 'PR'}</div>
            <h3 class="profile-name">${p.name || ''}</h3>
          </div>
          <p class="profile-stat">${p.stat || ''}</p>
        </div>
        <a href="${p.url || '#'}" target="_blank" rel="noopener noreferrer" class="profile-btn">Kunjungi Profil →</a>
      `;
      container.appendChild(card);
    });
  }

  function renderContactInfo(c) {
    if (!c) return;
    if (c.title) {
      const el = document.querySelector('#contact .contact-box h2');
      if (el) el.innerText = c.title;
    }
    if (c.description) {
      const el = document.querySelector('#contact .contact-box p');
      if (el) el.innerText = c.description;
    }
    if (c.email) {
      document.querySelectorAll('#contact a[href^="mailto:"]').forEach(a => a.href = `mailto:${c.email}`);
    }
    if (c.footerText) {
      const el = document.querySelector('.site-footer p');
      if (el) {
        el.innerHTML = `${c.footerText} · Dibuat oleh <a href="https://portify-sepia.vercel.app/" target="_blank" rel="noopener noreferrer">Portify.id</a>`;
      }
    }
  }

  function renderVideoInfo(v) {
    if (!v) return;
    if (v.title) {
      if (i18nData.id) i18nData.id.video_title = v.title;
      const el = document.querySelector('.video-card-title, .video-showcase-title');
      if (el) el.innerText = v.title;
    }
    if (v.sub) {
      if (i18nData.id) i18nData.id.video_sub = v.sub;
      const el = document.querySelector('.video-card-sub, .video-showcase-sub');
      if (el) el.innerText = v.sub;
    }
    if (v.small) {
      if (i18nData.id) i18nData.id.video_small = v.small;
      const el = document.querySelector('.video-card-tag, .video-showcase-small');
      if (el) el.innerText = v.small;
    }
    if (v.image) {
      const img = document.querySelector('.video-cover-img, .video-thumbnail-wrapper img');
      if (img) img.src = v.image;
    }
  }

  function renderStatsInfo(s) {
    const statItems = document.querySelectorAll('.stats-grid .stat-number');
    if (statItems.length >= 4) {
      if (s.publications) statItems[0].setAttribute('data-target', s.publications);
      if (s.citations) statItems[1].setAttribute('data-target', s.citations);
      if (s.years) statItems[2].setAttribute('data-target', s.years);
      if (s.countries) statItems[3].setAttribute('data-target', s.countries);
    }
  }

  // ==========================================
  // UI GreenMetric Style Animated Counter Engine
  // ==========================================
  function initStatsCounterAnimation() {
    const statsSection = document.getElementById('stats');
    const statCards = document.querySelectorAll('.stat-item, .stat-card');
    if (!statsSection || !statCards.length) return;

    // Set initial 0 display for all stat numbers before scroll
    statCards.forEach(card => {
      const numEl = card.querySelector('.stat-number');
      if (!numEl) return;
      const targetRaw = numEl.getAttribute('data-target') || numEl.innerText.trim();
      numEl.setAttribute('data-target', targetRaw);
      const suffix = targetRaw.replace(/\d+/g, '') || (targetRaw.includes('+') ? '+' : '');
      numEl.innerText = '0' + suffix;
    });

    let hasAnimated = false;

    function runCounterAnimation() {
      if (hasAnimated) return;
      hasAnimated = true;

      statCards.forEach((card, index) => {
        const numEl = card.querySelector('.stat-number');
        if (!numEl) return;

        const targetRaw = numEl.getAttribute('data-target') || numEl.innerText.trim();
        const match = targetRaw.match(/(\d+)/);
        if (!match) return;

        const targetVal = parseInt(match[0], 10);
        const suffix = targetRaw.replace(match[0], '');

        // Reveal card with staggered delay
        setTimeout(() => {
          card.classList.add('reveal-visible');
        }, index * 100);

        // Count up animation
        const duration = 1800; // ms
        let startTimestamp = null;

        function step(timestamp) {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Ease-out cubic curve for smooth slowing down
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentCount = Math.floor(easeOut * targetVal);

          numEl.innerText = currentCount.toLocaleString('id-ID') + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            numEl.innerText = targetVal.toLocaleString('id-ID') + suffix;
          }
        }

        setTimeout(() => {
          requestAnimationFrame(step);
        }, index * 100);
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounterAnimation();
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: "0px 0px -30px 0px"
    });

    observer.observe(statsSection);
  }

  initStatsCounterAnimation();

  function renderVideoInfo(v) {
    if (v.title) {
      const el = document.querySelector('.full-video-title');
      if (el) {
        el.innerHTML = `${v.title}<br><span>${v.sub || ''}</span><br><small>${v.small || ''}</small>`;
      }
    }
    if (v.image) {
      const img = document.querySelector('.full-thumb-img');
      if (img) img.src = v.image;
    }
  }

  function renderResearchCards(researchList) {
    const container = document.getElementById('research-grid-container');
    if (!container || !researchList || researchList.length === 0) return;
    
    container.innerHTML = '';
    researchList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'research-card';
      card.innerHTML = `
        <img src="${item.image || 'assets/foto-profil.jpg'}" alt="${item.title}" class="research-bg-img">
        <div class="research-bg-overlay"></div>
        <div class="research-card-content">
          <h3 class="research-title">${item.title}</h3>
          <p class="research-desc">${item.description}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderPublicationCards(pubList) {
    const container = document.getElementById('publications-grid-container');
    if (!container || !pubList || pubList.length === 0) return;

    container.innerHTML = '';
    pubList.forEach(pub => {
      const card = document.createElement('div');
      card.className = 'paper-card';
      card.setAttribute('data-type', pub.type || 'scopus');

      const eraClass = pub.year >= 2025 ? 'era-latest' : (pub.year >= 2023 ? 'era-mid' : 'era-older');

      card.innerHTML = `
        <div>
          <div class="paper-meta">
            <span class="year-badge ${eraClass}">${pub.year}</span>
            <span class="journal-name">${pub.journal}</span>
          </div>
          <h3 class="paper-title">${pub.title}</h3>
        </div>
        <div class="paper-footer">
          <span style="font-size: 0.8rem; color: var(--ink-3);">${pub.type.toUpperCase()} Article</span>
          <a href="${pub.url || '#'}" target="_blank" rel="noopener noreferrer" class="paper-link">Lihat Paper ↗</a>
        </div>
      `;
      container.appendChild(card);
    });

    filterPublications();
  }

  function renderBlogCards(blogList) {
    const container = document.getElementById('blog-grid-container');
    if (!container || !blogList || blogList.length === 0) return;

    container.innerHTML = '';
    blogList.forEach(post => {
      const article = document.createElement('article');
      article.className = 'blog-card';
      article.innerHTML = `
        <div>
          <div class="blog-meta">
            <span class="badge">${post.category}</span>
            <span>${post.date}</span>
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-summary">${post.summary}</p>
        </div>
        <button class="blog-read-btn" data-id="${post.id}">Baca Selengkapnya →</button>
      `;
      container.appendChild(article);
    });

    bindBlogModalTriggers();
  }

  function renderGalleryCards(galleryList) {
    const container = document.getElementById('gallery-grid-container');
    if (!container || !galleryList || galleryList.length === 0) return;
    
    container.innerHTML = '';
    galleryList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <div class="gallery-img-wrapper">
          <img src="${item.image || 'assets/foto-profil.jpg'}" alt="${item.title}" class="gallery-card-img">
        </div>
        <div class="gallery-card-body">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `;
      container.appendChild(card);
    });

    if (typeof buildGalleryDots === 'function') {
      buildGalleryDots();
    }
  }

  // 2. Interactive Live Search & Category Filtering for Publications
  const searchInput = document.getElementById('pub-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPublications();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterPublications);
  }

  function filterPublications() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const selectedFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const cards = document.querySelectorAll('.publications-grid .paper-card');
    cards.forEach(card => {
      const type = card.getAttribute('data-type') || '';
      const text = card.innerText.toLowerCase();

      const matchesCategory = (selectedFilter === 'all') || (type === selectedFilter);
      const matchesSearch = !query || text.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 3. Blog Modal Reader Overlay Logic
  const modal = document.getElementById('blog-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  function bindBlogModalTriggers() {
    document.querySelectorAll('.blog-read-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.getAttribute('data-id');
        const postCard = btn.closest('.blog-card');

        let title = postCard ? postCard.querySelector('.blog-title').innerText : 'Artikel Blog';
        let category = postCard ? postCard.querySelector('.badge').innerText : 'Riset';
        let date = postCard ? postCard.querySelector('.blog-meta span:last-child').innerText : '';
        let content = postCard ? postCard.querySelector('.blog-summary').innerText : '';

        if (appData.blog && appData.blog.length > 0) {
          const jsonPost = appData.blog.find(p => p.id === postId);
          if (jsonPost) {
            title = jsonPost.title;
            category = jsonPost.category;
            date = `${jsonPost.date} · ${jsonPost.readTime || ''}`;
            content = jsonPost.content;
          }
        }

        openModal(title, category, date, content);
      });
    });
  }

  function openModal(title, category, date, content) {
    if (!modal) return;
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-category').innerText = category;
    document.getElementById('modal-date').innerText = date;
    document.getElementById('modal-body').innerText = content;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // 4. Video Modal Player Trigger Logic
  const videoThumbTrigger = document.getElementById('video-play-trigger');
  const videoBtnTrigger = document.getElementById('video-btn-trigger');
  const videoModal = document.getElementById('video-modal');
  const videoCloseBtn = document.getElementById('video-modal-close');
  const iframe = document.getElementById('youtube-iframe');

  function openVideoModal() {
    let videoUrl = '';
    if (appData.video && appData.video.youtubeUrl && appData.video.youtubeUrl.trim()) {
      videoUrl = appData.video.youtubeUrl.includes('?') 
        ? `${appData.video.youtubeUrl}&autoplay=1` 
        : `${appData.video.youtubeUrl}?autoplay=1`;
    }

    if (iframe) {
      iframe.src = videoUrl;
    }
    if (videoModal) {
      videoModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  if (videoThumbTrigger) videoThumbTrigger.addEventListener('click', openVideoModal);
  if (videoBtnTrigger) videoBtnTrigger.addEventListener('click', openVideoModal);

  if (videoCloseBtn) {
    videoCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  function closeVideoModal() {
    if (!videoModal) return;
    if (iframe) iframe.src = '';
    videoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // 5. Native Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 6. Gallery Landscape Slider & Animated Dots Controller
  const slider = document.getElementById('gallery-grid-container');
  const prevBtn = document.getElementById('gal-prev');
  const nextBtn = document.getElementById('gal-next');
  const dotsContainer = document.getElementById('gallery-dots');

  window.buildGalleryDots = function() {
    if (!slider || !dotsContainer) return;
    const cards = slider.querySelectorAll('.gallery-card');
    if (!cards.length) {
      dotsContainer.innerHTML = '';
      return;
    }

    const cardWidth = cards[0].offsetWidth + 24;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (maxScroll <= 10) {
      dotsContainer.style.display = 'none';
      return;
    }
    dotsContainer.style.display = 'flex';

    const totalPages = Math.max(1, Math.round(maxScroll / cardWidth) + 1);
    dotsContainer.innerHTML = '';

    for (let idx = 0; idx < totalPages; idx++) {
      const dot = document.createElement('span');
      dot.className = idx === 0 ? 'gallery-dot active' : 'gallery-dot';
      dot.setAttribute('data-index', idx);
      dotsContainer.appendChild(dot);
    }
    updateActiveDot();
  };

  function updateActiveDot() {
    if (!slider || !dotsContainer) return;
    const cards = slider.querySelectorAll('.gallery-card');
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    if (!cards.length || !dots.length) return;

    const cardWidth = cards[0].offsetWidth + 24;
    const activeIndex = Math.max(0, Math.min(Math.round(slider.scrollLeft / cardWidth), dots.length - 1));

    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.buildGalleryDots) window.buildGalleryDots();
  });

  if (slider) {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const cards = slider.querySelectorAll('.gallery-card');
        const cardWidth = cards.length ? cards[0].offsetWidth + 24 : 340;
        slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const cards = slider.querySelectorAll('.gallery-card');
        const cardWidth = cards.length ? cards[0].offsetWidth + 24 : 340;
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }

    slider.addEventListener('scroll', updateActiveDot);

    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-dot')) {
          const index = parseInt(e.target.getAttribute('data-index'), 10);
          const cards = slider.querySelectorAll('.gallery-card');
          if (cards[index]) {
            const cardWidth = cards[0].offsetWidth + 24;
            slider.scrollTo({
              left: index * cardWidth,
              behavior: 'smooth'
            });
          }
        }
      });
    }

    window.buildGalleryDots();
  }
});

