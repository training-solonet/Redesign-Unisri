// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeroSlider();
    initMobileMenu();
    initScrollAnimations();
    initSearchFunctionality();
    initSmoothScrolling();
    initLanguageSwitcher();
    initScrollProgressBar();
});

// Hero Slider Functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;

    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide
    function startAutoSlide() {
        if (slideInterval) return; // guard against multiple intervals
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide
        });
    });

    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }

    // Start auto slide
    startAutoSlide();
}

// Language Switcher
function initLanguageSwitcher() {
    const switcher = document.querySelector('.language-switcher');
    const toggleBtn = document.querySelector('.lang-toggle');
    const menu = document.querySelector('.lang-menu');
    const currentSpan = document.querySelector('.current-lang');
    const htmlEl = document.documentElement;
    const searchInput = document.querySelector('.search-box input');

    if (!switcher || !toggleBtn || !menu || !currentSpan) return;

    // Apply saved language
    const saved = localStorage.getItem('site_lang') || htmlEl.lang || 'id';
    applyLanguage(saved);

    // Toggle menu
    toggleBtn.addEventListener('click', () => {
        const isOpen = switcher.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Select language
    menu.querySelectorAll('li[role="option"]').forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.getAttribute('data-lang');
            applyLanguage(lang);
            // close
            switcher.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) {
            switcher.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });

    function applyLanguage(lang) {
        htmlEl.setAttribute('lang', lang);
        localStorage.setItem('site_lang', lang);
        currentSpan.textContent = lang.toUpperCase();

        // Mark selection in menu
        menu.querySelectorAll('li[role="option"]').forEach(li => {
            const isSelected = li.getAttribute('data-lang') === lang;
            li.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });

        // Minimal copy changes for demo
        if (searchInput) {
            searchInput.setAttribute('placeholder', lang === 'en' ? 'Search...' : 'Cari...');
        }
    }
}

// Scroll Progress Bar
function initScrollProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const update = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${percent}%`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const backdrop = document.querySelector('.nav-backdrop');
    const mobileClose = document.querySelector('.mobile-close');

    function closeMenu() {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            if (backdrop) backdrop.classList.toggle('active', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
            
            // Animate hamburger menu
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (mobileToggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Close button in mobile menu
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMenu);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                closeMenu();
            }
        });

        // Close when clicking backdrop
        if (backdrop) {
            backdrop.addEventListener('click', closeMenu);
        }

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('dropdown-toggle')) {
                    closeMenu();
                } else {
                    // Handle dropdown toggle
                    const dropdown = link.closest('.dropdown');
                    dropdown.classList.toggle('open');
                }
            });
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.info-card, .program-card, .news-card, .facility-card, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with + if original had it
        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');
        const hasComma = target >= 1000;
        
        let displayValue = Math.floor(current);
        if (hasComma) {
            displayValue = displayValue.toLocaleString();
        }
        if (hasPlus) {
            displayValue += '+';
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // In a real implementation, this would perform actual search
            alert(`Mencari: "${query}"\n\nFitur pencarian akan diimplementasikan dengan backend.`);
            searchInput.value = '';
        }
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offset = headerHeight + navbarHeight;
                
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        if (navbar) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    } else {
        header.classList.remove('scrolled');
        if (navbar) {
            navbar.style.boxShadow = 'none';
        }
    }
});

// Dropdown Menu Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeout;
        
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            menu.style.display = 'block';
            setTimeout(() => {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            }, 10);
        });
        
        dropdown.addEventListener('mouseleave', () => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
            
            timeout = setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        });
    });
});

// Form Validation (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Loading State Management
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Optimization
const optimizedScroll = throttle(() => {
    // Scroll-based animations or effects can be added here
}, 16); // 60 FPS

window.addEventListener('scroll', optimizedScroll);

// Accessibility Enhancements
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    }
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Console Welcome Message
console.log(`
🎓 Universitas Slamet Riyadi Surakarta
🌐 Website Re-design
📧 Contact: info@unisri.ac.id
🔧 Developed with modern web technologies
`);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHeroSlider,
        initMobileMenu,
        initScrollAnimations,
        validateForm,
        showLoading,
        hideLoading,
        debounce,
        throttle
    };
}