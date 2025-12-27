// API Client
class APIClient {
    constructor() {
        this.baseURL = CONFIG.API_URL;
        this.token = localStorage.getItem(CONFIG.TOKEN_KEY);
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                }
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Request failed' }));
                throw new Error(error.error || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async signup(name, email, password) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        if (data.token) {
            this.setToken(data.token);
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        }
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (data.token) {
            this.setToken(data.token);
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        }
        return data;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } finally {
            this.clearToken();
        }
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // Profile endpoints
    async getProfile(userId) {
        return await this.request(`/profiles`);
    }

    async updateProfile(userId, data) {
        return await this.request(`/profiles`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async getUserRoles(userId) {
        return await this.request(`/profiles/${userId}/roles`);
    }

    // Assessment endpoints
    async getAssessments() {
        return await this.request('/assessments');
    }

    async createAssessment(data) {
        return await this.request('/assessments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Food log endpoints
    async getFoodLogs() {
        return await this.request('/food-logs.php');
    }

    async createFoodLog(data) {
        return await this.request('/food-logs.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async deleteFoodLog(id) {
        return await this.request(`/food-logs.php/${id}`, {
            method: 'DELETE'
        });
    }

    // Story endpoints
    async getStories() {
        return await this.request('/stories');
    }

    async createStory(data) {
        return await this.request('/stories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateStory(id, data) {
        return await this.request(`/stories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteStory(id) {
        return await this.request(`/stories/${id}`, {
            method: 'DELETE'
        });
    }

    // Goal endpoints
    async getGoals() {
        return await this.request('/goals');
    }

    async createGoal(data) {
        return await this.request('/goals', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateGoal(id, data) {
        return await this.request(`/goals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteGoal(id) {
        return await this.request(`/goals/${id}`, {
            method: 'DELETE'
        });
    }

    // Friends endpoints
    async getFriends() {
        return await this.request('/friends');
    }

    async getFriendRequests(type = 'pending') {
        return await this.request(`/friends/requests?type=${type}`);
    }

    async getFriendRecommendations() {
        return await this.request('/friends/recommendations');
    }

    async sendFriendRequest(userId) {
        return await this.request('/friends/request', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId })
        });
    }

    async acceptFriendRequest(requestId) {
        return await this.request(`/friends/request/${requestId}/accept`, {
            method: 'POST'
        });
    }

    async declineFriendRequest(requestId) {
        return await this.request(`/friends/request/${requestId}/decline`, {
            method: 'POST'
        });
    }

    async cancelFriendRequest(requestId) {
        return await this.request(`/friends/request/${requestId}`, {
            method: 'DELETE'
        });
    }

    async unfriend(userId) {
        return await this.request(`/friends/${userId}`, {
            method: 'DELETE'
        });
    }

    // Public posts endpoints
    async getPublicPosts() {
        return await this.request('/posts/public');
    }

    async createPost(data) {
        return await this.request('/posts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updatePostPrivacy(postId, isPublic) {
        return await this.request(`/posts/${postId}/privacy`, {
            method: 'PUT',
            body: JSON.stringify({ is_public: isPublic })
        });
    }

    // Analytics endpoints
    async getAnalyticsOverview(days = 7) {
        return await this.request(`/analytics/overview?days=${days}`);
    }

    async getPersonalityHistory() {
        return await this.request('/analytics/personality-history');
    }

    async getWellnessData(days = 7) {
        return await this.request(`/analytics/wellness?days=${days}`);
    }

    async getMoodData(days = 7) {
        return await this.request(`/analytics/mood?days=${days}`);
    }

    async getActivityLog(days = 7) {
        return await this.request(`/analytics/activity?days=${days}`);
    }

    async getGoalsProgress() {
        return await this.request('/analytics/goals-progress');
    }

    // Enhanced assessment endpoints
    async saveAssessmentResponses(responses) {
        return await this.request('/assessments/save', {
            method: 'POST',
            body: JSON.stringify(responses)
        });
    }

    async generatePersonalityProfile(assessmentId) {
        return await this.request(`/assessments/${assessmentId}/generate-profile`, {
            method: 'POST'
        });
    }
}

// Global API instance
const api = new APIClient();
