// main.js - Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNavIndicator();
  initHamburger();
  initNavHide();
  initCarousel();
  initScrollAnimations();
  initRssModal();
  initPdfModal();
  initEmailCopy();
  initTpAccordion();
  initGalleryModal();
});

// ===== NAV INDICATOR =====
function initNavIndicator() {
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const indicator = document.querySelector('.nav-indicator');
  
  if (!indicator || !navLinksContainer) return;

  function moveIndicator(link) {
    const linkRect = link.getBoundingClientRect();
    const containerRect = navLinksContainer.getBoundingClientRect();
    
    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;
    
    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
    
    // Change color based on position (gradient from orange to green)
    const index = Array.from(navLinks).indexOf(link);
    const totalLinks = navLinks.length;
    const hue = 35 + (index / (totalLinks - 1)) * 105; // 35 (orange) to 140 (green)
    indicator.style.background = `hsl(${hue}, 85%, 50%)`;
  }

  // Initialize indicator on active link
  const activeLink = document.querySelector('.nav-link.active') || navLinks[0];
  if (activeLink) {
    moveIndicator(activeLink);
  }

  // Move indicator on hover
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      moveIndicator(link);
    });
  });

  // Return to active link when leaving nav
  navLinksContainer.addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
      moveIndicator(activeLink);
    }
  });

  // Update indicator when active link changes
  const observer = new MutationObserver(() => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink && !navLinksContainer.matches(':hover')) {
      moveIndicator(activeLink);
    }
  });

  navLinks.forEach(link => {
    observer.observe(link, { attributes: true, attributeFilter: ['class'] });
  });

  // Handle resize
  window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav-link.active') || navLinks[0];
    if (activeLink) {
      moveIndicator(activeLink);
    }
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('[id]');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    // Add scrolled class for background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll on link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Close mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.getElementById('main-nav');
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  });
}

// ===== NAV HIDE =====
function initNavHide() {
  const btn = document.getElementById('nav-hide-btn');
  const navbar = document.querySelector('.navbar');

  btn.addEventListener('click', () => {
    const hidden = navbar.classList.toggle('nav-hidden');
    btn.setAttribute('aria-label', hidden ? 'Afficher la navigation' : 'Masquer la navigation');
    btn.setAttribute('title', hidden ? 'Afficher la navigation' : 'Masquer la navigation');
  });
}

// ===== HAMBURGER MENU =====
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('main-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== CAROUSEL =====
function initCarousel() {
  const carouselPrev = document.querySelector('.carousel-prev');
  const carouselNext = document.querySelector('.carousel-next');
  const projectsTrack = document.querySelector('.projects-track');
  const projectCards = document.querySelectorAll('.project-card');
  const carouselContainer = document.querySelector('.carousel-container');

  if (!carouselPrev || !carouselNext || !projectsTrack || projectCards.length === 0) return;

  let currentIndex = 0;
  
  function getVisibleCards() {
    const containerWidth = carouselContainer.offsetWidth;
    const cardWidth = projectCards[0].offsetWidth + 25; // card width + gap
    return Math.floor(containerWidth / cardWidth) || 1;
  }
  
  function getMaxIndex() {
    const visibleCards = getVisibleCards();
    return Math.max(0, projectCards.length - visibleCards);
  }

  function updateCarousel() {
    const cardWidth = projectCards[0].offsetWidth + 25; // Include gap
    const offset = -currentIndex * cardWidth;
    projectsTrack.style.transform = `translateX(${offset}px)`;
    
    // Update button states
    carouselPrev.style.opacity = currentIndex === 0 ? '0.5' : '1';
    carouselNext.style.opacity = currentIndex >= getMaxIndex() ? '0.5' : '1';
  }

  carouselNext.addEventListener('click', () => {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  carouselPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      updateCarousel();
    }, 100);
  });

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;
  
  projectsTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  projectsTrack.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const maxIndex = getMaxIndex();

    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentIndex < maxIndex) {
        currentIndex++;
      } else if (diffX < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
    }
  });
  
  // Initial update
  updateCarousel();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll('.about-card, .experience-card, .skill-category, .project-card, .contact-card').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('#competences').forEach(el => observer.observe(el));
}

// ===== RSS MODAL =====
function initRssModal() {
  initRssModalInstance({
    btnId:      'rss-btn',
    modalId:    'rss-modal',
    containerId:'rss-articles',
    rssUrl:     'https://news.google.com/rss/search?q=bioinformatique+OR+bioinformatics&hl=fr&gl=FR&ceid=FR:fr'
  });

  initRssModalInstance({
    btnId:      'rss-btn-claude',
    modalId:    'rss-modal-claude',
    containerId:'rss-articles-claude',
    rssUrl:     'https://news.google.com/rss/search?q=Claude+Code+Anthropic+IA+développement&hl=fr&gl=FR&ceid=FR:fr'
  });
}

function initRssModalInstance({ btnId, modalId, containerId, rssUrl }) {
  const btn      = document.getElementById(btnId);
  const modal    = document.getElementById(modalId);
  const closeBtn = modal?.querySelector('.rss-modal-close');

  if (!btn || !modal || !closeBtn) return;

  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`;
  let loaded = false;

  btn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!loaded) loadArticles();
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function loadArticles() {
    const container = document.getElementById(containerId);

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('network');
        return res.json();
      })
      .then(data => {
        if (data.status !== 'ok' || !data.items || !data.items.length) {
          throw new Error('no items');
        }
        loaded = true;
        container.innerHTML = data.items.map(item => {
          const date = item.pubDate
            ? new Date(item.pubDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
            : '';
          const desc = item.description
            ? item.description.replace(/<[^>]*>/g, '').trim().slice(0, 160) + '…'
            : '';
          return `
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="rss-article">
              <div class="rss-article-content">
                <h4>${item.title}</h4>
                ${desc ? `<p>${desc}</p>` : ''}
                ${date ? `<span class="rss-article-date">${date}</span>` : ''}
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" class="rss-arrow" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17"></path>
              </svg>
            </a>`;
        }).join('');
      })
      .catch(() => {
        container.innerHTML = '<p class="rss-error">Impossible de charger les articles pour le moment.</p>';
      });
  }
}

// ===== UTILITY FUNCTIONS =====

// Smooth scroll helper
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Add class on scroll
function addClassOnScroll(selector, className = 'visible', threshold = 0.1) {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(className);
      }
    });
  }, { threshold });

  elements.forEach(el => observer.observe(el));
}

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  
  // Add stagger animation to nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link, index) => {
    link.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
    link.style.opacity = '0';
  });
});

// ===== ACCESSIBILITY =====

// Skip to main content
const skipLink = document.querySelector('.skip-to-main');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('main').focus();
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Escape key closes mobile menu
  if (e.key === 'Escape') {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('main-nav');
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  }
});

// ===== PERFORMANCE =====

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== PDF MODAL =====
function initPdfModal() {
  const overlay = document.getElementById('pdf-modal');
  const list = document.getElementById('pdf-modal-list');
  const closeBtn = overlay.querySelector('.pdf-modal-close');

  function openModal(pdfs) {
    list.innerHTML = '';
    pdfs.forEach(({ name, url }) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${url}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="15" y2="17"></line>
          </svg>
          ${name}
        </a>`;
      list.appendChild(li);
    });
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
  }

  function closeModal() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
  }

  document.querySelectorAll('.project-link.pdf').forEach(btn => {
    btn.addEventListener('click', () => {
      const pdfs = JSON.parse(btn.dataset.pdfs);
      if (pdfs.length === 1) {
        window.open(pdfs[0].url, '_blank', 'noopener');
      } else {
        openModal(pdfs);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// ===== EMAIL COPY =====
function initEmailCopy() {
  document.querySelectorAll('.email-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.email;
      navigator.clipboard.writeText(email).then(() => {
        btn.classList.add('copied');
        btn.querySelector('.copy-icon').style.display = 'none';
        btn.querySelector('.check-icon').style.display = '';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.querySelector('.copy-icon').style.display = '';
          btn.querySelector('.check-icon').style.display = 'none';
        }, 2000);
      });
    });
  });
}

// ===== TP ACCORDION =====
function initTpAccordion() {
  const accordion = document.querySelector('.tp-accordion');
  if (!accordion) return;

  const btn = accordion.querySelector('.tp-accordion-header');
  const wrapper = accordion.querySelector('.tp-grid-wrapper');
  const cards = accordion.querySelectorAll('.tp-card');

  btn.addEventListener('click', () => {
    const isOpen = accordion.classList.contains('open');

    if (isOpen) {
      // Fermeture
      wrapper.style.height = wrapper.scrollHeight + 'px';
      requestAnimationFrame(() => {
        wrapper.style.height = '0';
      });
      accordion.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      // Ouverture
      accordion.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      wrapper.style.height = wrapper.scrollHeight + 'px';

      // Stagger des cartes
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
      });

      wrapper.addEventListener('transitionend', function handler() {
        wrapper.style.height = 'auto';
        wrapper.removeEventListener('transitionend', handler);
      });
    }
  });

  // Reset delays après fermeture
  wrapper.addEventListener('transitionend', () => {
    if (!accordion.classList.contains('open')) {
      cards.forEach(card => {
        card.style.transitionDelay = '0s';
      });
    }
  });
}

// ===== GALLERY MODAL =====
function initGalleryModal() {
  const images = [
    "images/CVVENSCREEN/cvven-1.png",
    "images/CVVENSCREEN/cvven-3.png",
    "images/CVVENSCREEN/cvven-4.png",
    "images/CVVENSCREEN/cvven-5.png",
    "images/CVVENSCREEN/cvven-6.png",
    "images/CVVENSCREEN/cvven-7.png",
    "images/CVVENSCREEN/cvven-8.png",
    "images/CVVENSCREEN/cvven-9.png",
    "images/CVVENSCREEN/cvven-10.png",
    "images/CVVENSCREEN/cvven-11.png"
  ];

  const btn = document.getElementById('cvven-gallery-btn');
  const overlay = document.getElementById('gallery-modal');
  const img = document.getElementById('gallery-img');
  const counter = document.getElementById('gallery-counter');
  const thumbsContainer = document.getElementById('gallery-thumbs');
  const closeBtn = overlay.querySelector('.gallery-modal-close');
  const prevBtn = overlay.querySelector('.gallery-prev');
  const nextBtn = overlay.querySelector('.gallery-next');

  let current = 0;

  // Build thumbnails
  images.forEach((src, i) => {
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.className = 'gallery-thumb';
    thumb.alt = `Capture ${i + 1}`;
    thumb.addEventListener('click', () => goTo(i));
    thumbsContainer.appendChild(thumb);
  });

  function goTo(index) {
    current = index;
    img.src = images[current];
    counter.textContent = `${current + 1} / ${images.length}`;
    thumbsContainer.querySelectorAll('.gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === current);
    });
  }

  function openModal() {
    goTo(0);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  prevBtn.addEventListener('click', () => goTo((current - 1 + images.length) % images.length));
  nextBtn.addEventListener('click', () => goTo((current + 1) % images.length));

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goTo((current - 1 + images.length) % images.length);
    if (e.key === 'ArrowRight') goTo((current + 1) % images.length);
  });
}

// Reduced motion support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty('--transition', 'none');
}

console.log('%c✨ Portfolio loaded successfully!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
