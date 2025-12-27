// Authentication Manager
class AuthManager {
    constructor() {
        this.user = null;
        this.profile = null;
        this.isAdmin = false;
        this.init();
    }

    init() {
        const userData = localStorage.getItem(CONFIG.USER_KEY);
        if (userData) {
            this.user = JSON.parse(userData);
            this.checkAuth();
        }
        this.updateUI();
    }

    async checkAuth() {
        try {
            const data = await api.getCurrentUser();
            this.user = data.user;
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
            await this.loadProfile();
        } catch (error) {
            console.error('Auth check failed:', error);
            // Don't logout if user data exists (might be Google OAuth user)
            // Only logout if there's no user data at all
            if (!this.user) {
                this.logout();
            }
        }
    }

    async loadProfile() {
        try {
            // If user exists, try to load their profile
            if (this.user && this.user.id) {
                const profileResp = await api.getProfile(this.user.id);
                this.profile = profileResp.data || {};
                const rolesResp = await api.getUserRoles(this.user.id).catch(() => ({ data: [] }));
                const roles = rolesResp.data || [];
                this.isAdmin = roles.some(r => r.role === 'admin');
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            // Don't fail auth if profile loading fails (e.g., for new Google OAuth users)
        }
    }

    async login(email, password) {
        const data = await api.login(email, password);
        this.user = data.user;
        await this.loadProfile();
        this.updateUI();
        return data;
    }

    async signup(name, email, password) {
        const data = await api.signup(name, email, password);
        this.user = data.user;
        await this.loadProfile();
        this.updateUI();
        return data;
    }

    async logout() {
        await api.logout();
        this.user = null;
        this.profile = null;
        this.isAdmin = false;
        this.updateUI();
        window.location.href = 'home.html';
    }

    isAuthenticated() {
        return !!this.user;
    }

    updateUI() {
        const authRequired = document.querySelectorAll('.auth-required');
        const guestOnly = document.querySelectorAll('.guest-only');

        if (this.isAuthenticated()) {
            authRequired.forEach(el => el.style.display = '');
            guestOnly.forEach(el => el.style.display = 'none');
        } else {
            authRequired.forEach(el => el.style.display = 'none');
            guestOnly.forEach(el => el.style.display = '');
        }
    }
}

// Global auth instance
const auth = new AuthManager();
