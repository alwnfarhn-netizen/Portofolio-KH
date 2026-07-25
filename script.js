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
      video_tag: "DOKUMENTASI RISET & INOVASI",
      video_title: "Signalong Indonesia",
      video_sub: "@ FIP UNESA, Surabaya",
      video_small: "Riset & Pengabdian 2026",
      video_btn: "PUTAR VIDEO",
      pub_subtitle: "Karya Ilmiah",
      pub_title: "Publikasi & Jurnal Terpilih",
      pub_search_placeholder: "Cari kata kunci judul paper atau jurnal...",
      pub_cta_btn: "Lihat Semua 45+ Publikasi di ResearchGate →",
      filter_all: "Semua",
      filter_scopus: "Scopus & Bereputasi",
      filter_inclusive: "Pendidikan Inklusif",
      filter_signalong: "Signalong Indonesia",
      blog_subtitle: "Catatan & Opini Riset",
      blog_title: "Blog Akademik",
      blog_read_btn: "Baca Selengkapnya →",
      gallery_subtitle: "Dokumentasi Lapangan",
      gallery_title: "Galeri Kegiatan & Pengabdian",
      profiles_subtitle: "Jaringan Akademik",
      profiles_title: "Profil & Database Riset",
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
      video_tag: "RESEARCH & INNOVATION DOCUMENTARY",
      video_title: "Signalong Indonesia",
      video_sub: "@ FIP UNESA, Surabaya",
      video_small: "Research & Community Outreach 2026",
      video_btn: "PLAY VIDEO",
      pub_subtitle: "Scholarly Works",
      pub_title: "Featured Publications & Journals",
      pub_search_placeholder: "Search paper title or journal keywords...",
      pub_cta_btn: "View All 45+ Publications on ResearchGate →",
      filter_all: "All",
      filter_scopus: "Scopus & Reputable",
      filter_inclusive: "Inclusive Education",
      filter_signalong: "Signalong Indonesia",
      blog_subtitle: "Notes & Research Insights",
      blog_title: "Academic Blog",
      blog_read_btn: "Read Full Article →",
      gallery_subtitle: "Field Documentation",
      gallery_title: "Activities & Community Outreach",
      profiles_subtitle: "Academic Networks",
      profiles_title: "Profiles & Research Databases",
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
  // Supabase Cloud Live Sync Credentials
  // ==========================================
  const SUPABASE_URL = 'https://uksp6rxubbaxca1fcaax.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_ukSp6RxUBBAXca1fcAAx_Q_ovbddB6h';
  const PORTFOLIO_SLUG = 'khofia';

  // 1. Data Loader & Dynamic Renderer Engine (Supabase Cloud Sync First)
  loadAppData();

  async function loadAppData() {
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolios?slug=eq.${PORTFOLIO_SLUG}&select=content`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        if (res.ok) {
          const rows = await res.json();
          if (rows && rows.length > 0 && rows[0].content) {
            appData = rows[0].content;
            renderAllDynamicContent(appData);
            return;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch fallback:', err);
      }
    }

    const localSaved = localStorage.getItem('portfolio_cms_data');
    if (localSaved) {
      try {
        appData = JSON.parse(localSaved);
        renderAllDynamicContent(appData);
        return;
      } catch (e) {}
    }

    loadJSONContent();
  }

  function loadJSONContent() {
    fetch('data/content.json')
      .then(res => res.json())
      .then(data => {
        appData = data;
        renderAllDynamicContent(data);
      })
      .catch(err => console.log('Using static content'));
  }

  function renderAllDynamicContent(data) {
    if (data.profile) renderProfileInfo(data.profile);
    if (data.stats) renderStatsInfo(data.stats);
    if (data.video) renderVideoInfo(data.video);
    if (data.research && data.research.length > 0) renderResearchCards(data.research);
    if (data.publications && data.publications.length > 0) renderPublicationCards(data.publications);
    if (data.blog && data.blog.length > 0) renderBlogCards(data.blog);
    if (data.gallery && data.gallery.length > 0) renderGalleryCards(data.gallery);
  }

  function renderProfileInfo(p) {
    if (p.name) {
      const el = document.querySelector('.hero-title');
      if (el) el.innerText = p.name;
    }
    if (p.subtitle) {
      const el = document.querySelector('.hero-subtitle');
      if (el) el.innerText = p.subtitle;
    }
    if (p.institution) {
      const el = document.querySelector('.hero-institution');
      if (el) el.innerText = p.institution;
    }
    if (p.tagline) {
      const el = document.querySelector('.hero-tagline');
      if (el) el.innerText = p.tagline;
    }
    if (p.avatar) {
      const img = document.querySelector('.hero-image-card img');
      if (img) img.src = p.avatar;
    }
    if (p.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.href = `mailto:${p.email}`);
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

