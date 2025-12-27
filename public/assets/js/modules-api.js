/**
 * LifePrint Modules API Helper
 * Handles all API communication for PersonaPrint, FoodPrint, StoryWeaver, and Time Capsule
 */

class LifePrintModuleAPI {
    constructor(baseUrl = null) {
        // Auto-detect environment
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.baseUrl = baseUrl || (isLocal ? '/api/modules.php' : '/~athanase.abayo/LifePrint/public/api/modules.php');
    }

    /**
     * Make API request
     */
    async request(action, method = 'GET', data = null) {
        const url = new URL(this.baseUrl, window.location.origin);
        url.searchParams.append('action', action);

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // ===== PersonaPrint APIs =====
    
    /**
     * Get user's personality profile
     */
    async getPersonaProfile() {
        return this.request('persona_get', 'GET');
    }

    /**
     * Update personality profile
     */
    async updatePersonaProfile(traits, type, completion) {
        return this.request('persona_update', 'POST', {
            traits: traits,
            type: type,
            completion: completion
        });
    }

    /**
     * Save assessment answers
     */
    async savePersonaAssessment(answers) {
        return this.request('persona_save_assessment', 'POST', {
            answers: answers
        });
    }

    // ===== FoodPrint APIs =====

    /**
     * Log a meal
     */
    async logMeal(mealType, calories, description = '') {
        return this.request('meal_log', 'POST', {
            meal_type: mealType,
            calories: calories,
            description: description
        });
    }

    /**
     * Get daily meals
     */
    async getDailyMeals(date = null) {
        const params = date ? `&date=${date}` : '';
        return this.request('meals_get' + params, 'GET');
    }

    /**
     * Get habit statistics for a date
     */
    async getHabitStats(date = null) {
        const params = date ? `&date=${date}` : '';
        return this.request('habits_get' + params, 'GET');
    }

    /**
     * Update habit value
     */
    async updateHabit(habitType, value) {
        return this.request('habit_update', 'POST', {
            habit_type: habitType,
            value: value
        });
    }

    // ===== StoryWeaver APIs =====

    /**
     * Save journal entry
     */
    async saveJournalEntry(content, emotion = '', title = '') {
        return this.request('journal_save', 'POST', {
            content: content,
            emotion: emotion,
            title: title
        });
    }

    /**
     * Get journal entries
     */
    async getJournalEntries(limit = 20, offset = 0) {
        return this.request(`journal_get&limit=${limit}&offset=${offset}`, 'GET');
    }

    /**
     * Add memory to timeline
     */
    async addMemory(title, description, year, emotion = '') {
        return this.request('memory_add', 'POST', {
            title: title,
            description: description,
            year: year,
            emotion: emotion
        });
    }

    /**
     * Get life timeline
     */
    async getTimeline() {
        return this.request('timeline_get', 'GET');
    }

    // ===== Time Capsule 2040 APIs =====

    /**
     * Save future goal
     */
    async saveGoal(title, description, targetYear = 2040, priority = 'medium') {
        return this.request('goal_save', 'POST', {
            title: title,
            description: description,
            target_year: targetYear,
            priority: priority
        });
    }

    /**
     * Get all goals
     */
    async getGoals() {
        return this.request('goals_get', 'GET');
    }

    /**
     * Track goal progress
     */
    async trackGoalProgress(goalId, progress, notes = '') {
        return this.request('goal_progress', 'POST', {
            goal_id: goalId,
            progress: progress,
            notes: notes
        });
    }

    /**
     * Get vision board items
     */
    async getVisionBoard() {
        return this.request('vision_board_get', 'GET');
    }
}

// Create global instance
const moduleAPI = new LifePrintModuleAPI();

/**
 * Utility functions for common tasks
 */

// Debounce function for API calls
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Format date to YYYY-MM-DD
function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

// Calculate streak
function calculateStreak(dates) {
    if (!dates || dates.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b - a);
    
    for (let i = 0; i < sortedDates.length; i++) {
        const checkDate = new Date(currentDate);
        checkDate.setDate(checkDate.getDate() - i);
        
        if (Math.abs(sortedDates[i] - checkDate) < 86400000) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export for use in modules
window.LifePrintAPI = {
    moduleAPI,
    debounce,
    formatDate,
    calculateStreak,
    showNotification
};
