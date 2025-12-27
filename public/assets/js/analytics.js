// Analytics Page - Track Personal Growth and Progress

Pages.analytics = () => {
    setTimeout(async () => {
        try {
            await loadAnalyticsData();
            
            // Date range selector
            document.querySelectorAll('[data-range]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const range = e.target.dataset.range;
                    selectDateRange(range);
                });
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }, 0);

    return `
        <div class="container" style="padding-top: 2rem;">
            <div class="text-center mb-4">
                <i class="fas fa-chart-line" style="font-size: 3rem; color: var(--primary);"></i>
                <h1 class="text-gradient mt-2">Your Progress & Analytics</h1>
                <p class="text-muted">Track your personal growth and wellness journey</p>
            </div>

            <!-- Date Range Selector -->
            <div class="flex gap-2 mb-4" style="justify-content: center;">
                <button class="btn btn-sm btn-primary" data-range="7">Last 7 Days</button>
                <button class="btn btn-sm btn-outline" data-range="30">Last 30 Days</button>
                <button class="btn btn-sm btn-outline" data-range="90">Last 90 Days</button>
                <button class="btn btn-sm btn-outline" data-range="365">This Year</button>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-4 mb-4">
                <div class="card glass-card text-center">
                    <i class="fas fa-fire" style="font-size: 2rem; color: var(--accent);"></i>
                    <h3 class="mt-2" id="streakDays">0</h3>
                    <p class="text-muted">Day Streak</p>
                </div>
                <div class="card glass-card text-center">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success);"></i>
                    <h3 class="mt-2" id="goalsCompleted">0</h3>
                    <p class="text-muted">Goals Completed</p>
                </div>
                <div class="card glass-card text-center">
                    <i class="fas fa-utensils" style="font-size: 2rem; color: var(--primary);"></i>
                    <h3 class="mt-2" id="mealsLogged">0</h3>
                    <p class="text-muted">Meals Logged</p>
                </div>
                <div class="card glass-card text-center">
                    <i class="fas fa-book" style="font-size: 2rem; color: var(--accent);"></i>
                    <h3 class="mt-2" id="storiesWritten">0</h3>
                    <p class="text-muted">Stories Written</p>
                </div>
            </div>

            <!-- Personality Growth -->
            <div class="card glass-card mb-4">
                <h3 class="mb-4">
                    <i class="fas fa-brain"></i> Personality Growth Over Time
                </h3>
                <div id="personalityGrowthChart"></div>
            </div>

            <!-- Wellness Trends -->
            <div class="grid grid-cols-2 mb-4">
                <div class="card glass-card">
                    <h3 class="mb-4">
                        <i class="fas fa-heart"></i> Wellness Score Trend
                    </h3>
                    <div id="wellnessChart"></div>
                </div>
                <div class="card glass-card">
                    <h3 class="mb-4">
                        <i class="fas fa-smile"></i> Mood Patterns
                    </h3>
                    <div id="moodChart"></div>
                </div>
            </div>

            <!-- Activity Timeline -->
            <div class="card glass-card mb-4">
                <h3 class="mb-4">
                    <i class="fas fa-calendar-alt"></i> Activity Timeline
                </h3>
                <div id="activityTimeline"></div>
            </div>

            <!-- Goals Progress -->
            <div class="card glass-card mb-4">
                <h3 class="mb-4">
                    <i class="fas fa-bullseye"></i> Goals Progress
                </h3>
                <div id="goalsProgress"></div>
            </div>

            <!-- Improvements & Achievements -->
            <div class="grid grid-cols-2">
                <div class="card glass-card">
                    <h3 class="mb-4">
                        <i class="fas fa-trophy"></i> Achievements
                    </h3>
                    <div id="achievements"></div>
                </div>
                <div class="card glass-card">
                    <h3 class="mb-4">
                        <i class="fas fa-arrow-up"></i> Key Improvements
                    </h3>
                    <div id="improvements"></div>
                </div>
            </div>
        </div>
    `;
};

async function loadAnalyticsData(days = 7) {
    try {
        showLoader();
        
        const [
            overviewResponse,
            personalityHistory,
            wellnessData,
            moodData,
            activityLog,
            goalsData
        ] = await Promise.all([
            api.getAnalyticsOverview(days),
            api.getPersonalityHistory().catch(() => ({ data: [] })),
            api.getWellnessData(days).catch(() => ({ data: [] })),
            api.getMoodData(days).catch(() => ({ data: [] })),
            api.getActivityLog(days).catch(() => ({ data: [] })),
            api.getGoalsProgress().catch(() => ({ data: [] }))
        ]);

        const overview = overviewResponse.data?.overview || {};
        renderOverview(overview);
        renderPersonalityGrowth(personalityHistory.data || []);
        renderWellnessTrend(wellnessData.data || []);
        renderMoodPatterns(moodData.data || []);
        renderActivityTimeline(activityLog.data || []);
        renderGoalsProgress(goalsData.data || []);
        renderAchievements(overview.achievements || []);
        renderImprovements(overview.improvements || []);
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        showToast('Failed to load analytics data', 'error');
    } finally {
        hideLoader();
    }
}

function renderOverview(data) {
    document.getElementById('streakDays').textContent = data.streak_days || data.streak || 0;
    document.getElementById('goalsCompleted').textContent = data.goals_completed || data.goalsCompleted || 0;
    document.getElementById('mealsLogged').textContent = data.meals_logged || data.mealsLogged || 0;
    document.getElementById('storiesWritten').textContent = data.stories_written || data.storiesWritten || 0;
}

function renderPersonalityGrowth(history) {
    const container = document.getElementById('personalityGrowthChart');
    
    if (!history || history.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Take multiple assessments to see your growth</p>';
        return;
    }

    const latest = history[0];
    const previous = history[history.length - 1];
    
    const traits = [
        { name: 'Emotional Stability', current: latest.emotionalStability, prev: previous.emotionalStability },
        { name: 'Lifestyle Health', current: latest.lifestyle, prev: previous.lifestyle },
        { name: 'Relationships', current: latest.relationships, prev: previous.relationships },
        { name: 'Goal Motivation', current: latest.goalsMotivation, prev: previous.goalsMotivation },
        { name: 'Stress Management', current: latest.stressManagement, prev: previous.stressManagement }
    ];

    container.innerHTML = `
        <div class="space-y-4">
            ${traits.map(trait => {
                const change = trait.current - trait.prev;
                const changePercent = ((change / 5) * 100).toFixed(1);
                const isImprovement = change > 0;
                
                return `
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span style="font-weight: 500;">${trait.name}</span>
                            <span style="color: ${isImprovement ? 'var(--success)' : change < 0 ? 'var(--error)' : 'var(--muted)'};">
                                ${isImprovement ? '+' : ''}${changePercent}%
                                <i class="fas fa-${isImprovement ? 'arrow-up' : change < 0 ? 'arrow-down' : 'minus'}"></i>
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(trait.current / 5) * 100}%;"></div>
                        </div>
                        <div class="flex justify-between text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">
                            <span>Previous: ${trait.prev.toFixed(1)}</span>
                            <span>Current: ${trait.current.toFixed(1)}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderWellnessTrend(data) {
    const container = document.getElementById('wellnessChart');
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No wellness data available</p>';
        return;
    }

    // Simple text-based chart
    const avg = data.reduce((sum, d) => sum + d.score, 0) / data.length;
    const trend = data[data.length - 1].score - data[0].score;
    
    container.innerHTML = `
        <div class="text-center">
            <div style="font-size: 3rem; font-weight: 700; color: var(--primary); margin-bottom: 1rem;">
                ${avg.toFixed(1)}
            </div>
            <p class="text-muted">Average Wellness Score</p>
            <div class="mt-3" style="color: ${trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--error)' : 'var(--muted)'};">
                <i class="fas fa-${trend > 0 ? 'trending-up' : trend < 0 ? 'trending-down' : 'minus'}"></i>
                ${trend > 0 ? '+' : ''}${trend.toFixed(1)} from start of period
            </div>
        </div>
    `;
}

function renderMoodPatterns(data) {
    const container = document.getElementById('moodChart');
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No mood data available</p>';
        return;
    }

    const moodCounts = data.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
    }, {});

    const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    container.innerHTML = `
        <div class="space-y-3">
            ${Object.entries(moodCounts).map(([mood, count]) => {
                const percentage = (count / data.length) * 100;
                const emoji = getMoodEmoji(mood);
                
                return `
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span>${emoji} ${mood}</span>
                            <span class="text-muted">${count} times (${percentage.toFixed(0)}%)</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%; background: ${getMoodColor(mood)};"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="mt-4 text-center">
            <p class="text-muted">Most common mood: <strong>${mostCommon[0]}</strong></p>
        </div>
    `;
}

function renderActivityTimeline(activities) {
    const container = document.getElementById('activityTimeline');
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No recent activity</p>';
        return;
    }

    container.innerHTML = `
        <div class="timeline">
            ${activities.map(activity => `
                <div class="timeline-item">
                    <div class="timeline-icon" style="background: ${getActivityColor(activity.type)};">
                        <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="flex justify-between items-center mb-2">
                            <strong>${activity.title}</strong>
                            <span class="text-muted" style="font-size: 0.75rem;">${formatDate(activity.date)}</span>
                        </div>
                        <p class="text-muted">${activity.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderGoalsProgress(goals) {
    const container = document.getElementById('goalsProgress');
    
    if (!goals || goals.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No active goals</p>';
        return;
    }

    container.innerHTML = goals.map(goal => {
        const isLocked = new Date(goal.target_date) > new Date();
        
        return `
            <div class="card glass-card mb-3">
                <div class="flex justify-between items-center mb-2">
                    <h4>${goal.title}</h4>
                    ${isLocked ? '<span class="badge"><i class="fas fa-lock"></i> Locked</span>' : ''}
                </div>
                <div class="progress-bar mb-2">
                    <div class="progress-fill" style="width: ${goal.progress}%;"></div>
                </div>
                <div class="flex justify-between text-muted" style="font-size: 0.875rem;">
                    <span>${goal.progress}% complete</span>
                    <span>Target: ${formatDate(goal.target_date)}</span>
                </div>
                ${isLocked ? `
                    <p class="text-muted mt-2" style="font-size: 0.875rem;">
                        <i class="fas fa-info-circle"></i> This goal will unlock on ${formatDate(goal.target_date)}
                    </p>
                ` : ''}
            </div>
        `;
    }).join('');
}

function renderAchievements(achievements) {
    const container = document.getElementById('achievements');
    
    if (!achievements || achievements.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No achievements yet. Keep going!</p>';
        return;
    }

    container.innerHTML = achievements.map(achievement => `
        <div class="card glass-card mb-3">
            <div class="flex items-center gap-3">
                <div style="font-size: 2rem;">${achievement.icon}</div>
                <div>
                    <h4>${achievement.title}</h4>
                    <p class="text-muted" style="font-size: 0.875rem;">${achievement.description}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderImprovements(improvements) {
    const container = document.getElementById('improvements');
    
    if (!improvements || improvements.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Keep working on your goals!</p>';
        return;
    }

    container.innerHTML = improvements.map(improvement => `
        <div class="card glass-card mb-3">
            <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-arrow-up" style="color: var(--success);"></i>
                <h4>${improvement.area}</h4>
            </div>
            <p class="text-muted" style="font-size: 0.875rem;">${improvement.description}</p>
            <div class="mt-2" style="color: var(--success); font-weight: 600;">
                +${improvement.improvement}% improvement
            </div>
        </div>
    `).join('');
}

function selectDateRange(days) {
    document.querySelectorAll('[data-range]').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });
    
    document.querySelector(`[data-range="${days}"]`).classList.remove('btn-outline');
    document.querySelector(`[data-range="${days}"]`).classList.add('btn-primary');
    
    loadAnalyticsData(parseInt(days));
}

function getMoodEmoji(mood) {
    const emojis = {
        'Happy': '😊',
        'Energized': '⚡',
        'Calm': '😌',
        'Tired': '😴',
        'Stressed': '😰',
        'Anxious': '😟',
        'Sad': '😢'
    };
    return emojis[mood] || '😐';
}

function getMoodColor(mood) {
    const colors = {
        'Happy': '#4ade80',
        'Energized': '#fbbf24',
        'Calm': '#60a5fa',
        'Tired': '#a78bfa',
        'Stressed': '#f87171',
        'Anxious': '#fb923c',
        'Sad': '#94a3b8'
    };
    return colors[mood] || 'var(--primary)';
}

function getActivityIcon(type) {
    const icons = {
        'meal': 'utensils',
        'story': 'book',
        'goal': 'bullseye',
        'assessment': 'brain',
        'friend': 'user-plus'
    };
    return icons[type] || 'check';
}

function getActivityColor(type) {
    const colors = {
        'meal': 'var(--accent)',
        'story': 'var(--primary)',
        'goal': 'var(--success)',
        'assessment': 'var(--primary)',
        'friend': '#60a5fa'
    };
    return colors[type] || 'var(--muted)';
}
