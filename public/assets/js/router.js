// Router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        let hash = window.location.hash.slice(1) || 'home';
        this.currentRoute = hash;

        // Check if route requires authentication
        const authRequiredRoutes = ['personaprint', 'foodprint', 'storyweaver', 'timecapsule', 'profile', 'analytics', 'friends'];
        if (authRequiredRoutes.includes(hash) && !auth.isAuthenticated()) {
            showToast('Please login to access this page', 'error');
            window.location.href = 'login.html';
            return;
        }

        const handler = this.routes[hash] || this.routes['404'];
        if (handler) {
            handler();
        }
    }
}

// Global router instance
const router = new Router();
