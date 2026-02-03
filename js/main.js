// main.js - Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNavIndicator();
  initHamburger();
  initCarousel();
  initScrollAnimations();
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

  // Animate skill bars on scroll
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillFills = entry.target.querySelectorAll('.skill-fill');
        skillFills.forEach(fill => {
          const width = fill.style.width;
          fill.style.animation = `fillBar 1s ease-out forwards`;
          
          // Trigger the animation by resetting and applying
          fill.style.width = '0';
          setTimeout(() => {
            fill.style.width = width;
          }, 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelector('#competences')?.forEach(el => skillObserver.observe(el));
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

// Reduced motion support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty('--transition', 'none');
}

console.log('%c✨ Portfolio loaded successfully!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
