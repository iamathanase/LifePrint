/**
 * Premium Mobile Menu - Consistent Smooth Slide Animation
 * Inspired by domari.rw - Works on ALL pages
 * Features:
 * - Smooth right-to-left slide
 * - Sequential fade-in for menu items
 * - Dark overlay with click-to-close
 * - Hamburger animates to X
 * - Body scroll lock when open
 */

(function() {
    'use strict';

    // Initialization flag - MUST be outside function to persist
    let isInitialized = false;

    function initPremiumMobileMenu() {
        // Prevent double initialization
        if (isInitialized) {
            console.log('⚠️ Menu already initialized, skipping...');
            return;
        }

        console.log('🚀 Initializing Premium Mobile Menu...');
        
        // Get or find mobile menu button
        let mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (!mobileMenuBtn) {
            mobileMenuBtn = document.querySelector('.mobile-menu-btn, .hamburger, #hamburgerBtn');
        }

        // Get or find nav links container
        let navLinks = document.getElementById('navLinks');
        if (!navLinks) {
            navLinks = document.querySelector('.nav-links, .mobile-menu, #mobileNavMenu');
        }

        if (!mobileMenuBtn || !navLinks) {
            console.warn('⚠️ Mobile menu elements not found');
            return;
        }

        // Create overlay if it doesn't exist
        let menuOverlay = document.getElementById('menuOverlay');
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'menu-overlay';
            menuOverlay.id = 'menuOverlay';
            document.body.insertBefore(menuOverlay, document.body.firstChild);
        }

        // Ensure mobile menu button has 3 spans for animation
        if (mobileMenuBtn.querySelectorAll('span').length < 3) {
            mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        }

        // Add premium mobile menu CSS
        if (!document.getElementById('premium-mobile-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'premium-mobile-menu-styles';
            style.textContent = `
                /* ==========================================
                   PREMIUM MOBILE MENU - DOMARI.RW STYLE
                   Smooth slide from right with overlay
                   ========================================== */
                
                /* Dark Overlay Behind Menu */
                .menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.6);
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                                visibility 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 999;
                    pointer-events: none;
                }

                .menu-overlay.active {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: all;
                }

                /* Hamburger Menu Button */
                .mobile-menu-btn, 
                .hamburger,
                #hamburgerBtn,
                #mobileMenuBtn {
                    display: none;
                    flex-direction: column;
                    gap: 6px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 10px;
                    z-index: 1001;
                    position: relative;
                    transition: transform 0.3s ease;
                }

                .mobile-menu-btn:hover,
                .hamburger:hover,
                #hamburgerBtn:hover,
                #mobileMenuBtn:hover {
                    transform: scale(1.05);
                }

                .mobile-menu-btn span, 
                .hamburger span,
                #hamburgerBtn span,
                #mobileMenuBtn span {
                    width: 30px;
                    height: 3px;
                    background: #667eea;
                    border-radius: 3px;
                    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    display: block;
                    transform-origin: center;
                }

                /* Hamburger to X Animation */
                .mobile-menu-btn.active span:nth-child(1),
                .hamburger.active span:nth-child(1),
                #hamburgerBtn.active span:nth-child(1),
                #mobileMenuBtn.active span:nth-child(1) {
                    transform: rotate(45deg) translate(9px, 9px);
                    background: #764ba2;
                }

                .mobile-menu-btn.active span:nth-child(2),
                .hamburger.active span:nth-child(2),
                #hamburgerBtn.active span:nth-child(2),
                #mobileMenuBtn.active span:nth-child(2) {
                    opacity: 0;
                    transform: scale(0);
                }

                .mobile-menu-btn.active span:nth-child(3),
                .hamburger.active span:nth-child(3),
                #hamburgerBtn.active span:nth-child(3),
                #mobileMenuBtn.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(8px, -8px);
                    background: #764ba2;
                }

                /* Mobile View Only */
                @media (max-width: 768px) {
                    .mobile-menu-btn, 
                    .hamburger,
                    #hamburgerBtn,
                    #mobileMenuBtn {
                        display: flex !important;
                    }

                    /* Hide any icon elements inside button */
                    .mobile-menu-btn i, 
                    .hamburger i,
                    #hamburgerBtn i,
                    #mobileMenuBtn i {
                        display: none !important;
                    }

                    /* Navigation Links - Premium Slide Menu (Right to Left) */
                    .nav-links, 
                    #navLinks, 
                    .mobile-menu, 
                    #mobileNavMenu {
                        position: fixed !important;
                        top: 0 !important;
                        right: -100% !important;
                        height: 100vh !important;
                        width: 85% !important;
                        max-width: 380px !important;
                        background: linear-gradient(135deg, 
                                    rgba(255, 255, 255, 0.98) 0%, 
                                    rgba(255, 255, 255, 0.95) 100%) !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                        padding: 100px 2.5rem 2.5rem !important;
                        gap: 0.2rem !important;
                        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3) !important;
                        transition: right 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        z-index: 1000 !important;
                        overflow-y: auto !important;
                        overflow-x: hidden !important;
                        margin: 0 !important;
                        display: flex !important;
                        border-left: 3px solid #667eea !important;
                    }

                    /* Smooth slide in from right */
                    .nav-links.active, 
                    #navLinks.active, 
                    .mobile-menu.active, 
                    #mobileNavMenu.active {
                        right: 0 !important;
                    }

                    /* Smooth slide in from right */
                    .nav-links.active, 
                    #navLinks.active, 
                    .mobile-menu.active, 
                    #mobileNavMenu.active {
                        right: 0 !important;
                    }

                    /* Menu Items - Base Hidden State */
                    .nav-links > *, .nav-links li, 
                    #navLinks > *, #navLinks li,
                    .mobile-menu > *, .mobile-menu li, .mobile-menu ul > li,
                    #mobileNavMenu > *, #mobileNavMenu li,
                    .nav-links .account-dropdown,
                    #navLinks .account-dropdown {
                        opacity: 0 !important;
                        transform: translateX(50px) !important;
                        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                                    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        list-style: none !important;
                    }

                    /* Menu Items - Active Sequential Fade In */
                    .nav-links.active > *, .nav-links.active li,
                    #navLinks.active > *, #navLinks.active li,
                    .mobile-menu.active > *, .mobile-menu.active li, .mobile-menu.active ul > li,
                    #mobileNavMenu.active > *, #mobileNavMenu.active li,
                    .nav-links.active .account-dropdown,
                    #navLinks.active .account-dropdown {
                        opacity: 1 !important;
                        transform: translateX(0) !important;
                    }

                    /* Sequential Animation Delays - Staggered Effect */
                    .nav-links.active > *:nth-child(1), .nav-links.active li:nth-child(1),
                    #navLinks.active > *:nth-child(1), #navLinks.active li:nth-child(1),
                    .mobile-menu.active > *:nth-child(1), .mobile-menu.active ul > li:nth-child(1),
                    #mobileNavMenu.active > *:nth-child(1) { 
                        transition-delay: 0.1s !important;
                    }

                    .nav-links.active > *:nth-child(2), .nav-links.active li:nth-child(2),
                    #navLinks.active > *:nth-child(2), #navLinks.active li:nth-child(2),
                    .mobile-menu.active > *:nth-child(2), .mobile-menu.active ul > li:nth-child(2),
                    #mobileNavMenu.active > *:nth-child(2) { 
                        transition-delay: 0.18s !important;
                    }

                    .nav-links.active > *:nth-child(3), .nav-links.active li:nth-child(3),
                    #navLinks.active > *:nth-child(3), #navLinks.active li:nth-child(3),
                    .mobile-menu.active > *:nth-child(3), .mobile-menu.active ul > li:nth-child(3),
                    #mobileNavMenu.active > *:nth-child(3) { 
                        transition-delay: 0.26s !important;
                    }

                    .nav-links.active > *:nth-child(4), .nav-links.active li:nth-child(4),
                    #navLinks.active > *:nth-child(4), #navLinks.active li:nth-child(4),
                    .mobile-menu.active > *:nth-child(4), .mobile-menu.active ul > li:nth-child(4),
                    #mobileNavMenu.active > *:nth-child(4) { 
                        transition-delay: 0.34s !important;
                    }

                    .nav-links.active > *:nth-child(5), .nav-links.active li:nth-child(5),
                    #navLinks.active > *:nth-child(5), #navLinks.active li:nth-child(5),
                    .mobile-menu.active > *:nth-child(5), .mobile-menu.active ul > li:nth-child(5),
                    #mobileNavMenu.active > *:nth-child(5) { 
                        transition-delay: 0.42s !important;
                    }

                    .nav-links.active > *:nth-child(6), .nav-links.active li:nth-child(6),
                    #navLinks.active > *:nth-child(6), #navLinks.active li:nth-child(6),
                    .mobile-menu.active > *:nth-child(6), .mobile-menu.active ul > li:nth-child(6),
                    #mobileNavMenu.active > *:nth-child(6) { 
                        transition-delay: 0.5s !important;
                    }

                    .nav-links.active > *:nth-child(7), .nav-links.active li:nth-child(7),
                    #navLinks.active > *:nth-child(7), #navLinks.active li:nth-child(7),
                    .mobile-menu.active > *:nth-child(7), .mobile-menu.active ul > li:nth-child(7),
                    #mobileNavMenu.active > *:nth-child(7) { 
                        transition-delay: 0.58s !important;
                    }

                    .nav-links.active > *:nth-child(8), .nav-links.active li:nth-child(8),
                    #navLinks.active > *:nth-child(8), #navLinks.active li:nth-child(8),
                    .mobile-menu.active > *:nth-child(8), .mobile-menu.active ul > li:nth-child(8),
                    #mobileNavMenu.active > *:nth-child(8) { 
                        transition-delay: 0.66s !important;
                    }

                    .nav-links.active > *:nth-child(9), .nav-links.active li:nth-child(9),
                    #navLinks.active > *:nth-child(9), #navLinks.active li:nth-child(9),
                    .mobile-menu.active > *:nth-child(9), .mobile-menu.active ul > li:nth-child(9),
                    #mobileNavMenu.active > *:nth-child(9) { 
                        transition-delay: 0.74s !important;
                    }

                    .nav-links.active > *:nth-child(10), .nav-links.active li:nth-child(10),
                    #navLinks.active > *:nth-child(10), #navLinks.active li:nth-child(10),
                    .mobile-menu.active > *:nth-child(10), .mobile-menu.active ul > li:nth-child(10),
                    #mobileNavMenu.active > *:nth-child(10) { 
                        transition-delay: 0.82s !important;
                    }

                    /* Links Styling - Premium Design */
                    .nav-link, .nav-links a, #navLinks a,
                    .mobile-menu a, #mobileNavMenu a,
                    .account-btn, .account-dropdown {
                        width: 100% !important;
                        text-align: left !important;
                        padding: 1.1rem 1.5rem !important;
                        font-size: 1.05rem !important;
                        font-weight: 500 !important;
                        border-radius: 12px !important;
                        margin: 0 0 0.3rem 0 !important;
                        display: block !important;
                        color: #2d3748 !important;
                        text-decoration: none !important;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        position: relative !important;
                        overflow: hidden !important;
                    }

                    /* Hover Effect with Gradient */
                    .nav-link:hover, .nav-links a:hover, #navLinks a:hover,
                    .mobile-menu a:hover, #mobileNavMenu a:hover,
                    .account-btn:hover {
                        background: linear-gradient(135deg, 
                                    rgba(102, 126, 234, 0.1) 0%, 
                                    rgba(118, 75, 162, 0.1) 100%) !important;
                        color: #667eea !important;
                        transform: translateX(8px) !important;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15) !important;
                    }

                    /* Active/CTA Link */
                    .nav-link.cta, .nav-links a.cta, #navLinks a.cta {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        color: white !important;
                        font-weight: 600 !important;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
                    }

                    .nav-link.cta:hover, .nav-links a.cta:hover, #navLinks a.cta:hover {
                        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
                        transform: translateX(8px) scale(1.02) !important;
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
                    }

                    /* Account Dropdown in Mobile */
                    .dropdown-menu {
                        position: static !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        transform: none !important;
                        box-shadow: none !important;
                        background: transparent !important;
                        margin-top: 0.5rem !important;
                        padding-left: 1rem !important;
                    }

                    .dropdown-menu a {
                        padding: 0.8rem 1rem !important;
                        font-size: 0.95rem !important;
                        border-left: 2px solid rgba(102, 126, 234, 0.2) !important;
                    }
                }

                /* Body Scroll Lock */
                body.menu-open {
                    overflow: hidden !important;
                    position: fixed !important;
                    width: 100% !important;
                    height: 100vh !important;
                }

                /* Smooth Scrollbar for Menu */
                .nav-links::-webkit-scrollbar,
                #navLinks::-webkit-scrollbar,
                .mobile-menu::-webkit-scrollbar,
                #mobileNavMenu::-webkit-scrollbar {
                    width: 6px;
                }

                .nav-links::-webkit-scrollbar-track,
                #navLinks::-webkit-scrollbar-track,
                .mobile-menu::-webkit-scrollbar-track,
                #mobileNavMenu::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }

                .nav-links::-webkit-scrollbar-thumb,
                #navLinks::-webkit-scrollbar-thumb,
                .mobile-menu::-webkit-scrollbar-thumb,
                #mobileNavMenu::-webkit-scrollbar-thumb {
                    background: rgba(102, 126, 234, 0.3);
                    border-radius: 10px;
                }

                .nav-links::-webkit-scrollbar-thumb:hover,
                #navLinks::-webkit-scrollbar-thumb:hover,
                .mobile-menu::-webkit-scrollbar-thumb:hover,
                #mobileNavMenu::-webkit-scrollbar-thumb:hover {
                    background: rgba(102, 126, 234, 0.5);
                }
            `;
            document.head.appendChild(style);
        }

        // Toggle menu function
        function toggleMenu(e) {
            console.log('🔄 Toggle menu clicked, isInitialized:', isInitialized);
            
            if (!isInitialized) {
                console.warn('⚠️ Menu not initialized yet');
                return;
            }
            
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            const isActive = navLinks.classList.contains('active');
            console.log('Current menu state - isActive:', isActive);
            
            // Toggle classes
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Open menu function
        function openMenu() {
            if (!isInitialized) {
                console.warn('⚠️ Cannot open - not initialized');
                return;
            }
            
            console.log('📂 Opening menu...');
            mobileMenuBtn.classList.add('active');
            navLinks.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            console.log('✅ Menu opened - Classes added');
            
            // Debug: check if classes were actually added
            setTimeout(() => {
                console.log('Debug after 100ms:');
                console.log('- navLinks has active class:', navLinks.classList.contains('active'));
                console.log('- navLinks right position:', window.getComputedStyle(navLinks).right);
                console.log('- overlay opacity:', window.getComputedStyle(menuOverlay).opacity);
            }, 100);
        }

        // Close menu function
        function closeMenu() {
            if (!isInitialized) {
                console.warn('⚠️ Cannot close - not initialized');
                return;
            }
            
            console.log('📁 Closing menu...');
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            console.log('✅ Menu closed - Classes removed');
        }

        // Event listeners - Remove any existing listeners first
        console.log('📌 Attaching event listeners...');
        
        // Clone and replace button to remove all existing listeners
        const newBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
        mobileMenuBtn = newBtn;
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Hamburger button clicked!');
            toggleMenu(e);
        });
        
        menuOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Overlay clicked!');
            closeMenu();
        });
        console.log('✓ Click listeners attached to button and overlay');

        // Close menu when clicking a link - IMMEDIATE navigation
        navLinks.addEventListener('click', function(e) {
            // Check if it's a link element
            const link = e.target.closest('a');
            
            if (link) {
                const href = link.getAttribute('href');
                console.log('🔗 Link clicked:', href);
                console.log('🔗 Link element:', link);
                console.log('🔗 Menu is active:', navLinks.classList.contains('active'));
                
                // Always close menu when clicking a link
                console.log('📁 Closing menu NOW...');
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
                console.log('✅ Menu closed - all classes removed');
                
                // Handle navigation based on link type
                if (href && href.startsWith('#')) {
                    // Anchor link - prevent default and scroll
                    e.preventDefault();
                    console.log('📍 Anchor link - scrolling to:', href);
                    
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                            const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                            const targetPosition = target.offsetTop - navHeight;
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                            console.log('✅ Scrolled to section');
                        } else {
                            console.warn('⚠️ Target not found:', href);
                        }
                    }, 100);
                } else if (href) {
                    // Page link - navigate immediately
                    console.log('🔗 Page link - navigating to:', href);
                    // Don't prevent default - let browser navigate
                    setTimeout(() => {
                        window.location.href = href;
                    }, 50);
                }
            }
        }, false);

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle window resize - close menu if window gets larger
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });

        // Mark as initialized
        isInitialized = true;
        console.log('✓ isInitialized set to true');

        console.log('✅ Premium mobile menu initialized successfully!');
        console.log('🎯 Elements found:', {
            button: !!mobileMenuBtn,
            nav: !!navLinks,
            overlay: !!menuOverlay
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPremiumMobileMenu);
    } else {
        initPremiumMobileMenu();
    }

    // Re-initialize if navigation is dynamically added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (
                        node.classList?.contains('mobile-menu-btn') ||
                        node.classList?.contains('hamburger') ||
                        node.id === 'mobileMenuBtn' ||
                        node.id === 'hamburgerBtn'
                    )) {
                        console.log('🔄 Re-initializing menu for dynamically added elements');
                        setTimeout(initPremiumMobileMenu, 100);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();