// =========================================
// INVEST 2026 - Main JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================
    // NAVIGATION
    // =========================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // =========================================
    // SMOOTH SCROLLING
    // =========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // =========================================
    // IDEAS FILTER
    // =========================================
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const ideaCards = document.querySelectorAll('.idea-card');
    const visibleCountEl = document.getElementById('visibleCount');
    
    function filterIdeas(category) {
        let visibleCount = 0;
        
        ideaCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.4s ease forwards';
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Update count
        if (visibleCountEl) {
            visibleCountEl.textContent = visibleCount;
        }
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter ideas
            const filter = this.dataset.filter;
            filterIdeas(filter);
        });
    });
    
    // Footer filter links
    document.querySelectorAll('[data-filter-link]').forEach(link => {
        link.addEventListener('click', function(e) {
            const filter = this.dataset.filterLink;
            
            // Find and click the corresponding filter button
            filterBtns.forEach(btn => {
                if (btn.dataset.filter === filter) {
                    btn.click();
                }
            });
        });
    });
    
    // =========================================
    // SCROLL ANIMATIONS (Simple AOS alternative)
    // =========================================
    
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    function checkElementsInView() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.85;
        
        animatedElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            
            if (elementTop < triggerPoint) {
                el.classList.add('aos-animate');
            }
        });
    }
    
    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            checkElementsInView();
        });
    });
    
    // Check on load
    checkElementsInView();
    
    // =========================================
    // VISION CARDS ANIMATION
    // =========================================
    
    const visionCardStack = document.querySelector('.vision-card-stack');
    
    if (visionCardStack) {
        // Add subtle floating animation on mouse move
        visionCardStack.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const vCards = this.querySelectorAll('.v-card');
            vCards.forEach((card, index) => {
                const factor = (index + 1) * 0.02;
                card.style.transform = `
                    rotate(${card.dataset.rotation || 0}deg) 
                    translateX(${x * factor}px) 
                    translateY(${y * factor}px)
                `;
            });
        });
        
        visionCardStack.addEventListener('mouseleave', function() {
            const vCards = this.querySelectorAll('.v-card');
            vCards.forEach(card => {
                card.style.transform = '';
            });
        });
    }
    
    // =========================================
    // COUNTER ANIMATION FOR STATS
    // =========================================
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Animate stat numbers when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                
                if (number && !el.dataset.animated) {
                    el.dataset.animated = 'true';
                    
                    // Handle special cases
                    if (text.includes('+')) {
                        animateCounter(el, number, 1500);
                        setTimeout(() => {
                            el.textContent = number + '+';
                        }, 1600);
                    } else if (text.includes('%')) {
                        animateCounter(el, number, 1500);
                        setTimeout(() => {
                            el.textContent = number + '%';
                        }, 1600);
                    }
                }
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });
    
    // =========================================
    // BUCKET CARDS TILT EFFECT
    // =========================================
    
    const buckets = document.querySelectorAll('.bucket');
    
    buckets.forEach(bucket => {
        bucket.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        bucket.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // =========================================
    // IDEA CARDS HOVER EFFECTS
    // =========================================
    
    ideaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // =========================================
    // KEYBOARD NAVIGATION
    // =========================================
    
    // Allow keyboard navigation for filter buttons
    filterBtns.forEach((btn, index) => {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' && filterBtns[index + 1]) {
                filterBtns[index + 1].focus();
            } else if (e.key === 'ArrowLeft' && filterBtns[index - 1]) {
                filterBtns[index - 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // =========================================
    // LAZY LOADING IMAGES (if any are added)
    // =========================================
    
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // =========================================
    // SCROLL PROGRESS INDICATOR (Optional)
    // =========================================
    
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #10b981, #34d399);
        z-index: 9999;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateProgress);
    
    // =========================================
    // PRINT FUNCTIONALITY
    // =========================================
    
    // Add print-friendly styles when printing
    window.addEventListener('beforeprint', function() {
        document.querySelectorAll('.idea-card').forEach(card => {
            card.classList.remove('hidden');
        });
    });
    
    // =========================================
    // ERROR HANDLING
    // =========================================
    
    window.addEventListener('error', function(e) {
        console.error('An error occurred:', e.message);
    });
    
    // =========================================
    // PERFORMANCE OPTIMIZATION
    // =========================================
    
    // Debounce function for resize events
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
    
    // Handle resize events efficiently
    window.addEventListener('resize', debounce(function() {
        // Recalculate any dimension-dependent values
        checkElementsInView();
    }, 250));
    
    // =========================================
    // ACCESSIBILITY ENHANCEMENTS
    // =========================================
    
    // Focus trap for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
            
            if (e.key === 'Escape') {
                navToggle.click();
            }
        });
    }
    
    if (navMenu) {
        trapFocus(navMenu);
    }
    
    // Announce filter changes to screen readers
    function announceChange(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Add screen reader only styles
    const srOnlyStyles = document.createElement('style');
    srOnlyStyles.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(srOnlyStyles);
    
    // =========================================
    // INITIALIZATION COMPLETE
    // =========================================
    
    console.log('Invest 2026 website initialized successfully');
    
});
