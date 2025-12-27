// Enhanced Smooth Scrolling and Animations for LifePrint
// This file provides Next.js-like scrolling experience across all pages

(function() {
    'use strict';

    // Loading Screen Handler
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    });

    // Scroll Progress Bar
    function updateScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            scrollProgress.style.width = scrolled + '%';
        }

        // Hide scroll indicator after scrolling
        const scrollIndicator = document.getElementById('scrollIndicator');
        if (scrollIndicator) {
            if (window.scrollY > 200) {
                scrollIndicator.classList.remove('show');
            } else {
                scrollIndicator.classList.add('show');
            }
        }
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Enhanced Navbar Scroll Effect with velocity detection
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastScrollTime = Date.now();
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const currentTime = Date.now();
        const timeDelta = currentTime - lastScrollTime;
        
        // Calculate scroll velocity
        if (timeDelta > 0) {
            scrollVelocity = Math.abs(currentScrollY - lastScrollY) / timeDelta;
        }
        
        // Add scrolled class with smooth transition
        if (navbar) {
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar based on direction and velocity
            if (currentScrollY > lastScrollY && currentScrollY > 200 && scrollVelocity > 0.5) {
                navbar.classList.add('hidden');
            } else if (currentScrollY < lastScrollY || scrollVelocity > 1) {
                navbar.classList.remove('hidden');
            }
        }
        
        // Add visual feedback based on scroll speed
        if (scrollVelocity > 2) {
            document.body.style.setProperty('--scroll-speed', 'fast');
        } else if (scrollVelocity > 1) {
            document.body.style.setProperty('--scroll-speed', 'medium');
        } else {
            document.body.style.setProperty('--scroll-speed', 'slow');
        }
        
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
    });

    // Custom Smooth Scroll Function with enhanced easing
    function smoothScrollTo(targetPosition, duration = 1000) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
            return;
        }

        // Enhanced easing function for ultra-smooth deceleration
        function easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        }

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuart(progress);
            
            window.scrollTo({
                top: startPosition + (distance * ease),
                behavior: 'auto' // We handle the animation ourselves
            });
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Enhanced smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                
                // Adjust duration based on distance
                const distance = Math.abs(targetPosition - window.scrollY);
                const duration = Math.min(Math.max(distance / 2, 600), 1200);
                
                smoothScrollTo(targetPosition, duration);
            }
        });
    });

    // Click scroll indicator to scroll to next section
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator && navbar) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('.section');
            if (firstSection) {
                const targetPosition = firstSection.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
                smoothScrollTo(targetPosition, 1500);
            }
        });
        scrollIndicator.style.cursor = 'pointer';
        scrollIndicator.style.pointerEvents = 'all';
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        document.querySelectorAll('.section-header').forEach(header => {
            observer.observe(header);
        });

        document.querySelectorAll('.testimonial-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        document.querySelectorAll('.news-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        document.querySelectorAll('.faq-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(item);
        });

        document.querySelectorAll('.contact-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        document.querySelectorAll('.team-member').forEach((member, index) => {
            member.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(member);
        });

        document.querySelectorAll('.story-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    });

    // Enhanced Parallax Effect with Multiple Layers
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Hero parallax
        const hero = document.querySelector('.hero');
        if (hero && scrolled < windowHeight) {
            const parallaxSpeed = scrolled * 0.5;
            hero.style.transform = `translateY(${parallaxSpeed}px)`;
            hero.style.opacity = 1 - (scrolled / windowHeight) * 0.5;
        }

        // Section parallax and scale effects
        document.querySelectorAll('.section').forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const sectionMiddle = sectionTop + sectionHeight / 2;
            const windowMiddle = windowHeight / 2;
            const distanceFromCenter = Math.abs(sectionMiddle - windowMiddle);
            const maxDistance = windowHeight;
            
            // Scale and translate based on scroll position
            if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
                const progress = 1 - (distanceFromCenter / maxDistance);
                const scale = 0.95 + (progress * 0.05);
                const translateY = (distanceFromCenter / maxDistance) * 20;
                
                section.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                section.style.opacity = 0.8 + (progress * 0.2);
                
                if (progress > 0.5) {
                    section.classList.add('in-view');
                } else {
                    section.classList.remove('in-view');
                    section.classList.add('out-of-view');
                }
            }
        });

        // Card parallax on scroll
        document.querySelectorAll('.card, .testimonial-card, .news-card, .contact-card, .team-member, .story-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollPercent = (windowHeight - rect.top) / windowHeight;
                const translateY = (1 - scrollPercent) * 50;
                if (card.classList.contains('visible')) {
                    card.style.transform = `translateY(${translateY}px)`;
                }
            }
        });

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxUpdate);
    window.addEventListener('resize', requestParallaxUpdate);
    
    // Initial call
    setTimeout(updateParallax, 100);

    // Add smooth entrance animations to footer links
    setTimeout(() => {
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-20px)';
            link.style.transition = 'all 0.3s ease';
            link.style.transitionDelay = `${index * 0.02}s`;
            
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 100);
        });
    }, 100);

    // Enhanced Mouse Wheel Control for Smoother Scrolling
    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('wheel', () => {
        if (!isScrolling) {
            document.body.style.transition = 'filter 0.3s ease';
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }, { passive: true });

    // Add keyboard navigation for smoother experience
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const currentScroll = window.scrollY;
                const viewportHeight = window.innerHeight;
                smoothScrollTo(currentScroll + viewportHeight, 1200);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const currentScroll = window.scrollY;
                const viewportHeight = window.innerHeight;
                smoothScrollTo(Math.max(0, currentScroll - viewportHeight), 1200);
            }
        } else if (e.key === 'Home') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                smoothScrollTo(0, 1500);
            }
        } else if (e.key === 'End') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                smoothScrollTo(document.documentElement.scrollHeight, 1500);
            }
        }
    });

    // Add touch gesture support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        if (Math.abs(swipeDistance) > 50) {
            // Add haptic feedback feel through animation
            document.body.style.transition = 'transform 0.1s ease';
            document.body.style.transform = `translateY(${-swipeDistance * 0.02}px)`;
            setTimeout(() => {
                document.body.style.transform = 'translateY(0)';
            }, 100);
        }
    }

})();
