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
    initCommandPalette();

    // Ensure desktop/mobile nav states do not clash when resizing
    setupResponsiveNavSync();
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

// Sync nav state when crossing responsive breakpoints to avoid CSS/JS conflict
function setupResponsiveNavSync() {
    const BREAKPOINT = 1024;

    const sync = () => {
        const isDesktop = window.innerWidth > BREAKPOINT;
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        // Reset dropdown states and inline styles that mobile JS may have set
        const dropdowns = document.querySelectorAll('.dropdown');
        const menus = document.querySelectorAll('.dropdown-menu');

        if (isDesktop) {
            dropdowns.forEach(d => {
                d.classList.remove('active');
                d.classList.remove('open');
            });
            menus.forEach(m => {
                // Remove all inline styles that could override desktop CSS
                m.removeAttribute('style');
                // Force reflow so CSS desktop takes effect immediately
                void m.getBoundingClientRect();
            });

            // Close mobile panel if open
            if (navMenu) navMenu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
                mobileToggle.querySelectorAll('span').forEach(s => {
                    s.style.transform = 'none';
                    s.style.opacity = '1';
                });
            }
        } else {
            // Moving to mobile: ensure hover-opened desktop menus are closed
            dropdowns.forEach(d => d.classList.remove('open'));
            menus.forEach(m => {
                // Clear visibility-related inline styles; keep others to default
                m.style.opacity = '';
                m.style.visibility = '';
                m.style.transform = '';
            });
        }
    };

    // Initial sync and on resize/orientation changes (debounced)
    const debouncedSync = debounce(sync, 150);
    window.addEventListener('resize', debouncedSync);
    window.addEventListener('orientationchange', debouncedSync);
    // Run once on load
    sync();
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

// Command Palette
function initCommandPalette() {
    const overlay = document.querySelector('.cmdk-overlay');
    const panel = document.querySelector('.cmdk');
    const input = document.getElementById('cmdk-input');
    const closeBtn = document.querySelector('.cmdk-close');
    const list = document.getElementById('cmdk-list');
    const trigger = document.querySelector('.search-trigger');

    if (!overlay || !panel || !input || !closeBtn || !list) return;

    const items = [
        { icon: 'fa-house', label: 'Beranda', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { icon: 'fa-graduation-cap', label: 'Penerimaan Mahasiswa Baru', action: () => scrollToSection('.quick-info') },
        { icon: 'fa-layer-group', label: 'Program Unggulan', action: () => scrollToSection('.programs') },
        { icon: 'fa-newspaper', label: 'Berita & Pengumuman', action: () => scrollToSection('.news-section') },
        { icon: 'fa-chart-column', label: 'Statistik UNISRI', action: () => scrollToSection('.stats-section') },
        { icon: 'fa-video', label: 'Video Profil', action: () => scrollToSection('.video-section') },
        { icon: 'fa-building', label: 'Fasilitas & Layanan', action: () => scrollToSection('.facilities') },
        { icon: 'fa-language', label: 'Ganti Bahasa ke Indonesia', action: () => setLang('id') },
        { icon: 'fa-language', label: 'Switch Language to English', action: () => setLang('en') },
        { icon: 'fa-magnifying-glass', label: 'Cari di halaman (Ctrl+F)', action: () => { close(); setTimeout(() => document.activeElement.blur(), 0); } },
    ];

    function setLang(lang) {
        const htmlEl = document.documentElement;
        const currentSpan = document.querySelector('.current-lang');
        const searchInput = document.querySelector('.search-box input');
        htmlEl.setAttribute('lang', lang);
        localStorage.setItem('site_lang', lang);
        if (currentSpan) currentSpan.textContent = lang.toUpperCase();
        if (searchInput) searchInput.setAttribute('placeholder', lang === 'en' ? 'Search...' : 'Cari...');
    }

    function scrollToSection(sel) {
        const el = document.querySelector(sel);
        if (!el) return;
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const offset = headerHeight + navbarHeight;
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        close();
    }

    function render(filtered) {
        list.innerHTML = '';
        (filtered || items).forEach((it, idx) => {
            const li = document.createElement('li');
            li.className = 'cmdk-item';
            li.setAttribute('role', 'option');
            li.dataset.index = String(idx);
            li.innerHTML = `<i class="fas ${it.icon}"></i><span>${it.label}</span>`;
            li.addEventListener('click', () => {
                it.action();
                close();
            });
            list.appendChild(li);
        });
        activeIndex = list.children.length ? 0 : -1;
        highlight();
    }

    function open() {
        overlay.classList.add('active');
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        setTimeout(() => input.focus(), 10);
        input.select();
        render();
    }

    function close() {
        overlay.classList.remove('active');
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        input.value = '';
    }

    let activeIndex = -1;
    function highlight() {
        Array.from(list.children).forEach((el, i) => {
            el.classList.toggle('active', i === activeIndex);
        });
    }

    function filter(query) {
        const q = query.trim().toLowerCase();
        if (!q) { render(items); return; }
        const filtered = items.filter(it => it.label.toLowerCase().includes(q));
        render(filtered);
    }

    // Event wiring
    if (trigger) trigger.addEventListener('click', open);
    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    input.addEventListener('input', (e) => filter(e.target.value));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const isCtrlK = (e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k');
        if (isCtrlK) {
            e.preventDefault();
            if (panel.classList.contains('active')) close(); else open();
            return;
        }

        if (!panel.classList.contains('active')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            close();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (list.children.length) { activeIndex = (activeIndex + 1) % list.children.length; highlight(); }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (list.children.length) { activeIndex = (activeIndex - 1 + list.children.length) % list.children.length; highlight(); }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0) { list.children[activeIndex].click(); }
        }
    });
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
    
    // Create mobile menu overlay
    let overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            overlay.classList.toggle('active', isActive);
            
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
        
        // Handle dropdown menus in mobile
        const dropdownLinks = document.querySelectorAll('.dropdown > .nav-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    const dropdown = this.parentElement;
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    
                    // Close other dropdowns first
                    document.querySelectorAll('.dropdown.active').forEach(otherDropdown => {
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
                            // Ensure it's measured correctly
                            dropdownMenu.style.display = 'block';
                            const targetHeight = dropdownMenu.scrollHeight;
                            dropdownMenu.style.maxHeight = (targetHeight + 32) + 'px';
                            dropdownMenu.style.opacity = '1';
                            dropdownMenu.style.visibility = 'visible';
                            dropdownMenu.style.transform = 'translateY(0)';
                        } else {
                            dropdownMenu.style.maxHeight = '0';
                            dropdownMenu.style.opacity = '0';
                            dropdownMenu.style.visibility = 'hidden';
                            dropdownMenu.style.transform = 'translateY(0)';
                            // Allow CSS to reset display after transition
                            setTimeout(() => { dropdownMenu.style.display = 'block'; }, 300);
                        }
                    }
                }
            });
        });
        
        function closeMobileMenu() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
            
            // Close all dropdowns with smooth animation
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
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
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close if it's a dropdown toggle
                if (!link.parentElement.classList.contains('dropdown')) {
                    closeMobileMenu();
                }
            });
        });
        
        // Close mobile menu when clicking dropdown menu items
        const dropdownMenuLinks = document.querySelectorAll('.dropdown-menu a');
        dropdownMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
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
                // In hover mode, ensure no leftover inline styles/classes from mobile
                dropdown.classList.remove('active');
                dropdown.classList.remove('open');
                if (menu) {
                    menu.removeAttribute('style');
                    // Force reflow so CSS hover takes over immediately
                    void menu.getBoundingClientRect();
                }
                // Rely on CSS for showing; nothing else to do
                return;
            }
            if (isDesktop && DESKTOP_DROPDOWN_TRIGGER === 'click' && dropdown.classList.contains('open')) {
                // if already open via click, do nothing
                return;
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            const isDesktop = window.innerWidth > 1024;
            if (isDesktop && DESKTOP_DROPDOWN_TRIGGER === 'hover') {
                // CSS handles hide on hover-out; do nothing
                return;
            }
            if (isDesktop && DESKTOP_DROPDOWN_TRIGGER === 'click') {
                // In click mode: biarkan tetap terbuka hingga klik di luar
                if (dropdown.classList.contains('open')) return;
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