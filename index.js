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

// Mobile Menu Functionality - Updated for merged header
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    // Create mobile navigation if it doesn't exist
    let mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) {
        mobileNav = createMobileNavigation();
        document.body.appendChild(mobileNav);
    }
    
    // Create mobile menu overlay
    let overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 9998;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(overlay);
    }

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            const isActive = mobileNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Show/hide overlay
            if (isActive) {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            } else {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
            
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

        // Close mobile menu when clicking overlay
        overlay.addEventListener('click', function() {
            closeMobileMenu();
        });
        
        // Handle dropdown menus in mobile navigation
        const dropdownLinks = document.querySelectorAll('.mobile-nav .dropdown > .nav-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.parentElement;
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                
                // Close other dropdowns first
                document.querySelectorAll('.mobile-nav .dropdown.active').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                        const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.style.maxHeight = '0';
                            otherMenu.style.opacity = '0';
                        }
                    }
                });
                
                // Toggle current dropdown
                const isActive = dropdown.classList.toggle('active');
                
                if (dropdownMenu) {
                    if (isActive) {
                        const targetHeight = dropdownMenu.scrollHeight;
                        dropdownMenu.style.maxHeight = (targetHeight + 32) + 'px';
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.visibility = 'visible';
                    } else {
                        dropdownMenu.style.maxHeight = '0';
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                    }
                }
            });
        });
        
        function closeMobileMenu() {
            mobileNav.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
            document.body.style.overflow = '';
            
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
            
            // Close all dropdowns
            document.querySelectorAll('.mobile-nav .dropdown.active').forEach(dropdown => {
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.maxHeight = '0';
                    dropdownMenu.style.opacity = '0';
                    setTimeout(() => {
                        dropdown.classList.remove('active');
                    }, 300);
                } else {
                    dropdown.classList.remove('active');
                }
            });
        }

        // Close mobile menu when clicking on nav links (except dropdowns)
        const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close if it's a dropdown toggle
                if (!link.parentElement.classList.contains('dropdown')) {
                    closeMobileMenu();
                }
            });
        });
        
        // Close mobile menu when clicking dropdown menu items
        const dropdownItems = document.querySelectorAll('.mobile-nav .dropdown-menu a');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }
    
    function createMobileNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';
        nav.innerHTML = `
            <div class="mobile-menu-header">
                <img src="assets/unisri logo.png" alt="Logo UNISRI" class="logo">
                <div class="logo-text">
                    <h3>Universitas Slamet Riyadi</h3>
                    <p>Surakarta</p>
                </div>
            </div>
            <div class="mobile-menu-items">
                <ul class="nav-menu">
                    <li><a href="#" class="nav-link active">Beranda</a></li>
                    <li class="dropdown">
                        <a href="#" class="nav-link">Profil <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="#">Sejarah</a>
                            <a href="#">Visi & Misi</a>
                            <a href="#">Struktur Organisasi</a>
                        </div>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="nav-link">Fakultas <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="#">Fakultas Hukum</a>
                            <a href="#">Fakultas Ekonomi dan Bisnis</a>
                            <a href="#">Fakultas Ilmu Sosial dan Ilmu Politik</a>
                            <a href="#">Fakultas Keguruan dan Ilmu Pendidikan</a>
                            <a href="#">Fakultas Pertanian</a>
                            <a href="#">Fakultas Teknologi Pangan</a>
                        </div>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="nav-link">Akademik <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="#">Program Sarjana</a>
                            <a href="#">Program Pascasarjana</a>
                            <a href="#">Kalender Akademik</a>
                            <a href="#">Portal Akademik</a>
                        </div>
                    </li>
                    <li><a href="#" class="nav-link">Penelitian</a></li>
                    <li><a href="#" class="nav-link">Pengabdian</a></li>
                    <li><a href="#" class="nav-link">Kemahasiswaan</a></li>
                    <li><a href="#" class="nav-link">Berita</a></li>
                    <li><a href="#" class="nav-link">Kontak</a></li>
                </ul>
            </div>
        `;
        return nav;
    }
}

// Search Functionality - Updated for new search toggle
function initSearchFunctionality() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input-wrapper input');
    const searchButton = document.querySelector('.search-input-wrapper button');

    if (searchToggle && searchBox && searchInput) {
        // Toggle search box
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = searchBox.classList.contains('active');
            
            if (isActive) {
                searchBox.classList.remove('active');
            } else {
                searchBox.classList.add('active');
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            }
        });

        // Close search on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchBox.classList.contains('active')) {
                searchBox.classList.remove('active');
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
                searchBox.classList.remove('active');
            }
        });

        // Search functionality
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
        
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
            searchBox.classList.remove('active');
        }
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
    
    // Desktop dropdown trigger mode
    // Options:
    //   - 'hover'  => dropdown muncul saat hover (disarankan untuk desktop)
    //   - 'click'  => dropdown toggle saat diklik dan tetap terbuka sampai klik di luar
    // Ganti nilai di bawah ini untuk memilih mode. Hanya satu yang aktif.
    const DESKTOP_DROPDOWN_TRIGGER = 'hover'; // ubah ke 'click' jika ingin mode klik
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const trigger = dropdown.querySelector('.nav-link');
        let timeout;

        // Hover behavior (desktop)
        dropdown.addEventListener('mouseenter', () => {
            const isDesktop = window.innerWidth > 1024;
            if (isDesktop && DESKTOP_DROPDOWN_TRIGGER === 'hover') {
                clearTimeout(timeout);
                menu.style.display = 'block';
                requestAnimationFrame(() => {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                });
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            const isDesktop = window.innerWidth > 1024;
            if (isDesktop) {
                // In click mode: biarkan tetap terbuka hingga klik di luar
                if (DESKTOP_DROPDOWN_TRIGGER === 'click' && dropdown.classList.contains('open')) return;
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                timeout = setTimeout(() => {
                    menu.style.display = 'none';
                }, 300);
            }
        });

        // Click to keep open (desktop only) - only attach when mode is 'click'
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                const isDesktop = window.innerWidth > 1024;
                if (isDesktop && DESKTOP_DROPDOWN_TRIGGER === 'click') {
                    e.preventDefault();

                    const willOpen = !dropdown.classList.contains('open');

                    // Close other dropdowns
                    document.querySelectorAll('.dropdown.open').forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('open');
                            const otherMenu = other.querySelector('.dropdown-menu');
                            if (otherMenu) {
                                otherMenu.style.opacity = '0';
                                otherMenu.style.visibility = 'hidden';
                                otherMenu.style.transform = 'translateY(-10px)';
                                setTimeout(() => {
                                    otherMenu.style.display = 'none';
                                }, 300);
                            }
                        }
                    });

                    if (willOpen) {
                        dropdown.classList.add('open');
                        menu.style.display = 'block';
                        requestAnimationFrame(() => {
                            menu.style.opacity = '1';
                            menu.style.visibility = 'visible';
                            menu.style.transform = 'translateY(0)';
                        });
                    } else {
                        dropdown.classList.remove('open');
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                        menu.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            menu.style.display = 'none';
                        }, 300);
                    }
                }
            });
        }
    });

    // Click outside to close (desktop, click mode only)
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 1024 && DESKTOP_DROPDOWN_TRIGGER === 'click') {
            const anyDropdown = e.target.closest && e.target.closest('.dropdown');
            if (!anyDropdown) {
                document.querySelectorAll('.dropdown.open').forEach(openDd => {
                    openDd.classList.remove('open');
                    const m = openDd.querySelector('.dropdown-menu');
                    if (m) {
                        m.style.opacity = '0';
                        m.style.visibility = 'hidden';
                        m.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            m.style.display = 'none';
                        }, 300);
                    }
                });
            }
        }
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
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
            
            // Close all dropdowns
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
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