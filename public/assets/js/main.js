// Main Application Initialization

document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Account dropdown toggle
    const accountBtn = document.getElementById('accountBtn');
    const accountDropdown = document.getElementById('accountDropdown');
    
    if (accountBtn) {
        accountBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountDropdown.style.display = accountDropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (accountDropdown) {
                accountDropdown.style.display = 'none';
            }
        });
    }

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            showLoader();
            await auth.logout();
            showToast('Logged out successfully', 'success');
            if (accountDropdown) accountDropdown.style.display = 'none';
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            hideLoader();
        }
    });

    // Register all routes
    router.register('home', () => {
        document.getElementById('app').innerHTML = Pages.home();
    });

    router.register('personaprint', () => {
        document.getElementById('app').innerHTML = Pages.personaprint();
    });

    router.register('foodprint', () => {
        document.getElementById('app').innerHTML = Pages.foodprint();
    });

    router.register('storyweaver', () => {
        document.getElementById('app').innerHTML = Pages.storyweaver();
    });

    router.register('timecapsule', () => {
        document.getElementById('app').innerHTML = Pages.timecapsule();
    });

    router.register('profile', () => {
        document.getElementById('app').innerHTML = Pages.profile();
    });

    router.register('analytics', () => {
        document.getElementById('app').innerHTML = Pages.analytics();
    });

    router.register('friends', () => {
        document.getElementById('app').innerHTML = Pages.friends();
    });

    router.register('stories', () => {
        document.getElementById('app').innerHTML = Pages.stories();
    });

    router.register('about', () => {
        document.getElementById('app').innerHTML = Pages.about();
    });

    router.register('news', () => {
        document.getElementById('app').innerHTML = Pages.news();
    });

    router.register('faq', () => {
        document.getElementById('app').innerHTML = Pages.faq();
    });

    router.register('contact', () => {
        document.getElementById('app').innerHTML = Pages.contact();
    });

    router.register('getstarted', () => {
        document.getElementById('app').innerHTML = Pages.getstarted();
    });

    router.register('404', () => {
        document.getElementById('app').innerHTML = Pages['404']();
    });

    // Initial route load
    router.handleRoute();
});

// Error handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An error occurred. Please try again.', 'error');
});
