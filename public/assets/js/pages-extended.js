// Additional Page Templates

// PersonaPrint Page
Pages.personaprint = () => {
    setTimeout(async () => {
        const introEl = document.getElementById('assessment-intro');
        const resultEl = document.getElementById('assessment-result');
        
        if (!introEl) {
            console.error('Assessment intro element not found');
            return;
        }
        
        try {
            const assessments = await api.getAssessments();
            const hasCompletedAssessment = assessments && assessments.length > 0;
            
            if (hasCompletedAssessment) {
                const latest = assessments[0];
                
                // Update intro section to show completion status
                introEl.innerHTML = `
                    <div class="card glass-card text-center" style="max-width: 600px; margin: 0 auto; border: 2px solid #10b981;">
                        <div style="background: #10b981; color: white; padding: 0.75rem; border-radius: 8px 8px 0 0; margin: -1.5rem -1.5rem 1.5rem -1.5rem;">
                            <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
                            <h3 style="margin: 0.5rem 0 0 0; font-size: 1.25rem;">Assessment Completed!</h3>
                        </div>
                        <p class="text-muted mb-4">
                            You've already completed your personality assessment. 
                            You can view your results below or retake the assessment.
                        </p>
                        <button id="start-assessment-btn" class="btn btn-primary">
                            <i class="fas fa-redo"></i> Retake Assessment
                        </button>
                    </div>
                `;
                
                // Show results
                if (resultEl) {
                    resultEl.innerHTML = `
                        <div class="card glass-card">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                                <h3 style="margin: 0;">Your Personality Profile</h3>
                                <span style="background: #10b981; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600;">
                                    <i class="fas fa-check"></i> Complete
                                </span>
                            </div>
                            <div style="background: rgba(212, 184, 150, 0.1); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                                <h4 class="mb-2" style="color: #D4B896;">Your Personality Type</h4>
                                <p class="text-gradient" style="font-size: 1.8rem; font-weight: 700; margin: 0;">${latest.personality_type}</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 class="mb-2" style="color: #10b981;"><i class="fas fa-star"></i> Strengths</h4>
                                    <ul style="list-style: none; padding-left: 0;">
                                        ${JSON.parse(latest.strengths || '[]').map(s => `<li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #10b981; margin-right: 0.5rem;"></i>${s}</li>`).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <h4 class="mb-2" style="color: #3b82f6;"><i class="fas fa-seedling"></i> Areas for Growth</h4>
                                    <ul style="list-style: none; padding-left: 0;">
                                        ${JSON.parse(latest.areas_for_growth || '[]').map(s => `<li style="margin-bottom: 0.5rem;"><i class="fas fa-arrow-up" style="color: #3b82f6; margin-right: 0.5rem;"></i>${s}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                            <div style="border-top: 1px solid rgba(212, 184, 150, 0.2); padding-top: 1rem; margin-top: 1rem;">
                                <p class="text-muted" style="margin: 0; font-size: 0.875rem;">
                                    <i class="fas fa-calendar-alt"></i> Completed on ${formatDate(latest.created_at)}
                                </p>
                            </div>
                        </div>
                    `;
                }
            } else {
                // Show default intro for users who haven't taken the assessment
                introEl.innerHTML = `
                    <div class="card glass-card text-center" style="max-width: 600px; margin: 0 auto;">
                        <h2 class="mb-4">Take Your Personality Assessment</h2>
                        <p class="text-muted mb-4">
                            Answer a series of questions to discover your personality type, 
                            strengths, and areas for growth.
                        </p>
                        <button id="start-assessment-btn" class="btn btn-primary">
                            <i class="fas fa-play"></i> Start Assessment
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading assessments:', error);
            // Show default intro on error
            introEl.innerHTML = `
                <div class="card glass-card text-center" style="max-width: 600px; margin: 0 auto;">
                    <h2 class="mb-4">Take Your Personality Assessment</h2>
                    <p class="text-muted mb-4">
                        Answer a series of questions to discover your personality type, 
                        strengths, and areas for growth.
                    </p>
                    <button id="start-assessment-btn" class="btn btn-primary">
                        <i class="fas fa-play"></i> Start Assessment
                    </button>
                </div>
            `;
        }

        const startBtn = document.getElementById('start-assessment-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                introEl.style.display = 'none';
                document.getElementById('assessment-wizard').style.display = 'block';
                startAssessmentWizard();
            });
        }
    }, 0);

    return `
        <div class="container" style="padding-top: 2rem;">
            <div class="text-center mb-4">
                <i class="fas fa-brain" style="font-size: 3rem; color: var(--primary);"></i>
                <h1 class="text-gradient mt-2">PersonaPrint</h1>
                <p class="text-muted">Discover your unique personality</p>
            </div>

            <div id="assessment-intro">
                <div class="card glass-card text-center" style="max-width: 600px; margin: 0 auto;">
                    <div style="padding: 2rem;">
                        <div style="width: 50px; height: 50px; border: 4px solid rgba(212, 184, 150, 0.3); border-top-color: #D4B896; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                        <p class="text-muted">Loading...</p>
                    </div>
                </div>
            </div>

            <div id="assessment-wizard" style="display: none;">
                <!-- Assessment wizard will be loaded here -->
            </div>

            <div id="assessment-result" class="mt-4"></div>
        </div>
    `;
};

// FoodPrint Page
Pages.foodprint = () => {
    setTimeout(async () => {
        try {
            const response = await api.getFoodLogs();
            renderFoodLogs(response.data || []);
        } catch (error) {
            console.error('Error loading food logs:', error);
        }

        document.getElementById('foodLogForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mealType = document.getElementById('mealType').value;
            const foodItems = document.getElementById('foodItems').value;
            const calories = document.getElementById('calories').value;
            const mood = document.getElementById('mood').value;

            if (!mealType || !foodItems) {
                showToast('Please fill in meal type and food items', 'error');
                return;
            }

            try {
                showLoader();
                await api.createFoodLog({
                    meal_type: mealType,
                    food_items: foodItems,
                    calories: calories ? parseInt(calories) : null,
                    mood: mood || null
                });

                showToast('Meal logged successfully!', 'success');
                e.target.reset();
                
                const response = await api.getFoodLogs();
                renderFoodLogs(response.data || []);
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                hideLoader();
            }
        });
    }, 0);

    return `
        <div class="container" style="padding-top: 2rem;">
            <div class="text-center mb-4">
                <i class="fas fa-utensils" style="font-size: 3rem; color: var(--accent);"></i>
                <h1 class="text-gradient mt-2">FoodPrint</h1>
                <p class="text-muted">Track your wellness journey</p>
            </div>

            <div class="card glass-card mb-4">
                <h3 class="mb-4">Log Your Meal</h3>
                <form id="foodLogForm">
                    <div class="grid grid-cols-2">
                        <div class="form-group">
                            <label class="form-label">Meal Type</label>
                            <select id="mealType" class="form-select" required>
                                <option value="">Select meal type</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Calories (optional)</label>
                            <input type="number" id="calories" class="form-input" placeholder="500">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Food Items</label>
                        <input type="text" id="foodItems" class="form-input" placeholder="Grilled chicken, salad, rice" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mood After Meal</label>
                        <select id="mood" class="form-select">
                            <option value="">How do you feel?</option>
                            <option value="energized">Energized</option>
                            <option value="satisfied">Satisfied</option>
                            <option value="tired">Tired</option>
                            <option value="bloated">Bloated</option>
                            <option value="neutral">Neutral</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-plus"></i> Log Meal
                    </button>
                </form>
            </div>

            <div class="card glass-card">
                <h3 class="mb-4">Recent Logs</h3>
                <div id="foodLogsList">
                    <p class="text-muted">No logs yet. Start tracking your meals!</p>
                </div>
            </div>
        </div>
    `;
};

function renderFoodLogs(logs) {
    const container = document.getElementById('foodLogsList');
    if (!logs || logs.length === 0) {
        container.innerHTML = '<p class="text-muted">No logs yet. Start tracking your meals!</p>';
        return;
    }

    container.innerHTML = logs.map(log => `
        <div class="glass-card p-4 mb-2 flex justify-between items-center">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-gradient" style="font-weight: 600; text-transform: capitalize;">${log.meal_type}</span>
                    <span class="text-muted" style="font-size: 0.9rem;">${formatTime(log.created_at)}</span>
                </div>
                <p>${escapeHtml(log.food_items)}</p>
                <div class="flex gap-2 mt-1" style="font-size: 0.9rem;">
                    ${log.calories ? `<span>🔥 ${log.calories} cal</span>` : ''}
                    ${log.mood ? `<span>😊 ${log.mood}</span>` : ''}
                </div>
            </div>
            <button class="btn btn-secondary" onclick="deleteFoodLog('${log.id}')" style="padding: 0.5rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

async function deleteFoodLog(id) {
    try {
        await api.deleteFoodLog(id);
        showToast('Log deleted', 'success');
        const logs = await api.getFoodLogs();
        renderFoodLogs(logs);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// StoryWeaver Page
Pages.storyweaver = () => {
    setTimeout(async () => {
        try {
            const response = await api.getStories();
            renderStories(response.data || []);
        } catch (error) {
            console.error('Error loading stories:', error);
        }

        document.getElementById('createStoryBtn').addEventListener('click', () => {
            document.getElementById('storyForm').style.display = 'block';
        });

        document.getElementById('cancelStory').addEventListener('click', () => {
            document.getElementById('storyForm').style.display = 'none';
            document.getElementById('storyFormElement').reset();
        });

        document.getElementById('storyFormElement').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('storyTitle').value;
            const content = document.getElementById('storyContent').value;
            const moodTag = document.getElementById('moodTag').value;
            const privacyLevel = document.getElementById('privacyLevel').value;

            try {
                showLoader();
                await api.createStory({
                    title,
                    content,
                    mood_tag: moodTag,
                    privacy_level: privacyLevel
                });

                showToast('Story created successfully!', 'success');
                document.getElementById('storyForm').style.display = 'none';
                e.target.reset();
                
                const response = await api.getStories();
                renderStories(response.data || []);
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                hideLoader();
            }
        });
    }, 0);

    return `
        <div class="container" style="padding-top: 2rem;">
            <div class="text-center mb-4">
                <i class="fas fa-book-open" style="font-size: 3rem; color: var(--primary);"></i>
                <h1 class="text-gradient mt-2">StoryWeaver</h1>
                <p class="text-muted">Share your life stories</p>
            </div>

            <div class="mb-4">
                <button id="createStoryBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Create New Story
                </button>
            </div>

            <div id="storyForm" class="card glass-card mb-4" style="display: none;">
                <h3 class="mb-4">Write Your Story</h3>
                <form id="storyFormElement">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" id="storyTitle" class="form-input" placeholder="My Story Title" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Story</label>
                        <textarea id="storyContent" class="form-textarea" placeholder="Write your story here..." required></textarea>
                    </div>
                    <div class="grid grid-cols-2">
                        <div class="form-group">
                            <label class="form-label">Mood Tag</label>
                            <input type="text" id="moodTag" class="form-input" placeholder="happy, reflective, etc.">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Privacy</label>
                            <select id="privacyLevel" class="form-select">
                                <option value="private">Private</option>
                                <option value="friends">Friends Only</option>
                                <option value="public">Public</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Story
                        </button>
                        <button type="button" id="cancelStory" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>

            <div id="storiesList">
                <p class="text-muted text-center">No stories yet. Start writing!</p>
            </div>
        </div>
    `;
};

function renderStories(stories) {
    const container = document.getElementById('storiesList');
    if (!stories || stories.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No stories yet. Start writing!</p>';
        return;
    }

    container.innerHTML = stories.map(story => `
        <div class="card glass-card mb-4">
            <div class="flex justify-between items-center mb-2">
                <h3>${escapeHtml(story.title)}</h3>
                ${story.user_id === auth.user.id ? `
                    <button class="btn btn-secondary" onclick="deleteStory('${story.id}')" style="padding: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
            <p>${escapeHtml(story.content)}</p>
            <div class="flex gap-2 mt-4" style="font-size: 0.9rem; color: var(--muted);">
                ${story.mood_tag ? `<span><i class="fas fa-tag"></i> ${story.mood_tag}</span>` : ''}
                <span><i class="fas fa-lock"></i> ${story.privacy_level}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(story.created_at)}</span>
            </div>
        </div>
    `).join('');
}

async function deleteStory(id) {
    createModal(
        'Delete Story',
        'Are you sure you want to delete this story? This action cannot be undone.',
        async () => {
            try {
                await api.deleteStory(id);
                showToast('Story deleted', 'success');
                const stories = await api.getStories();
                renderStories(stories);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    );
}

// TimeCapsule Page
Pages.timecapsule = () => {
    setTimeout(async () => {
        try {
            const response = await api.getGoals();
            renderGoals(response.data || []);
        } catch (error) {
            console.error('Error loading goals:', error);
        }

        document.getElementById('createGoalBtn').addEventListener('click', () => {
            document.getElementById('goalForm').style.display = 'block';
        });

        document.getElementById('cancelGoal').addEventListener('click', () => {
            document.getElementById('goalForm').style.display = 'none';
            document.getElementById('goalFormElement').reset();
        });

        document.getElementById('goalFormElement').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('goalTitle').value;
            const description = document.getElementById('goalDescription').value;
            const targetDate = document.getElementById('targetDate').value;

            try {
                showLoader();
                await api.createGoal({
                    title,
                    description,
                    target_date: targetDate,
                    status: 'active'
                });

                showToast('Goal created successfully!', 'success');
                document.getElementById('goalForm').style.display = 'none';
                e.target.reset();
                
                const response = await api.getGoals();
                renderGoals(response.data || []);
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                hideLoader();
            }
        });
    }, 0);

    return `
        <div class="container" style="padding-top: 2rem;">
            <div class="text-center mb-4">
                <i class="fas fa-hourglass-half" style="font-size: 3rem; color: var(--accent);"></i>
                <h1 class="text-gradient mt-2">TimeCapsule</h1>
                <p class="text-muted">Set and track your future goals</p>
            </div>

            <div class="mb-4">
                <button id="createGoalBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Create New Goal
                </button>
            </div>

            <div id="goalForm" class="card glass-card mb-4" style="display: none;">
                <h3 class="mb-4">Set Your Goal</h3>
                <form id="goalFormElement">
                    <div class="form-group">
                        <label class="form-label">Goal Title</label>
                        <input type="text" id="goalTitle" class="form-input" placeholder="My Goal" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea id="goalDescription" class="form-textarea" placeholder="Describe your goal..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Target Date</label>
                        <input type="date" id="targetDate" class="form-input" required>
                    </div>
                    <div class="flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Goal
                        </button>
                        <button type="button" id="cancelGoal" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>

            <div id="goalsList">
                <p class="text-muted text-center">No goals yet. Start setting your targets!</p>
            </div>
        </div>
    `;
};

function renderGoals(goals) {
    const container = document.getElementById('goalsList');
    if (!goals || goals.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No goals yet. Start setting your targets!</p>';
        return;
    }

    container.innerHTML = goals.map(goal => `
        <div class="card glass-card mb-4">
            <div class="flex justify-between items-center mb-2">
                <h3>${escapeHtml(goal.title)}</h3>
                <div class="flex gap-2">
                    <span class="btn btn-secondary" style="padding: 0.5rem; text-transform: capitalize;">${goal.status}</span>
                    <button class="btn btn-secondary" onclick="deleteGoal('${goal.id}')" style="padding: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${goal.description ? `<p>${escapeHtml(goal.description)}</p>` : ''}
            <div class="flex gap-2 mt-4" style="font-size: 0.9rem; color: var(--muted);">
                <span><i class="fas fa-calendar"></i> Target: ${formatDate(goal.target_date)}</span>
                <span><i class="fas fa-clock"></i> Created: ${formatDate(goal.created_at)}</span>
            </div>
        </div>
    `).join('');
}

async function deleteGoal(id) {
    createModal(
        'Delete Goal',
        'Are you sure you want to delete this goal?',
        async () => {
            try {
                await api.deleteGoal(id);
                showToast('Goal deleted', 'success');
                const goals = await api.getGoals();
                renderGoals(goals);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    );
}

// Profile Page
Pages.profile = () => {
    setTimeout(async () => {
        if (auth.profile) {
            document.getElementById('profileName').value = auth.profile.full_name || '';
            document.getElementById('profileBio').value = auth.profile.bio || '';
        }

        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('profileName').value;
            const bio = document.getElementById('profileBio').value;

            try {
                showLoader();
                await api.updateProfile(auth.user.id, {
                    ...auth.profile,
                    full_name: fullName,
                    bio: bio
                });

                showToast('Profile updated successfully!', 'success');
                await auth.loadProfile();
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                hideLoader();
            }
        });
    }, 0);

    const userName = auth.user?.name || auth.user?.full_name || auth.user?.email || 'User';
    const userEmail = auth.user?.email || '';
    const userInitial = userName.charAt(0).toUpperCase();

    return `
        <div class="container" style="padding-top: 2rem; max-width: 800px;">
            <div class="text-center mb-4">
                <div style="width: 100px; height: 100px; margin: 0 auto; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
                    ${userInitial}
                </div>
                <h1 class="text-gradient mt-4">${userName}</h1>
                <p class="text-muted">${userEmail}</p>
            </div>

            <div class="card glass-card">
                <h3 class="mb-4">Profile Information</h3>
                <form id="profileForm">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="profileName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bio</label>
                        <textarea id="profileBio" class="form-textarea" placeholder="Tell us about yourself..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </form>
            </div>

            <div class="card glass-card mt-4">
                <h3 class="mb-4">Account Settings</h3>
                <p class="text-muted mb-4">Email: ${userEmail}</p>
                <button class="btn btn-outline" onclick="showToast('Password update feature coming soon', 'info')">
                    <i class="fas fa-key"></i> Change Password
                </button>
            </div>
        </div>
    `;
};

// Assessment Wizard
function startAssessmentWizard() {
    // Use comprehensive assessment questions from assessment-questions.js
    const categories = Object.keys(AssessmentQuestions.categories);
    let currentCategory = 0;
    let currentQuestion = 0;
    let responses = {};

    function renderQuestion() {
        const categoryKey = categories[currentCategory];
        const category = AssessmentQuestions.categories[categoryKey];
        const question = category.questions[currentQuestion];
        
        const totalQuestions = categories.reduce((sum, cat) => 
            sum + AssessmentQuestions.categories[cat].questions.length, 0);
        const questionsAnswered = Object.keys(responses).length;
        const progress = (questionsAnswered / totalQuestions) * 100;

        document.getElementById('assessment-wizard').innerHTML = `
            <div class="card glass-card" style="max-width: 700px; margin: 0 auto;">
                <div class="mb-4">
                    <div class="flex justify-between text-muted mb-2" style="font-size: 0.9rem;">
                        <span>Question ${questionsAnswered + 1} of ${totalQuestions}</span>
                        <span>${Math.round(progress)}% complete</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <h4 class="mt-3" style="color: var(--primary);">${category.title}</h4>
                </div>

                <h3 class="mb-4">${question.text}</h3>

                <div class="grid grid-cols-1" style="gap: 1rem;">
                    ${AssessmentQuestions.scaleOptions.map(option => `
                        <button class="btn ${responses[question.id] === option.value ? 'btn-primary' : 'btn-outline'}" 
                                onclick="selectAnswer('${question.id}', ${option.value})" 
                                style="text-align: left; justify-content: space-between; display: flex; align-items: center;">
                            <span>${option.label}</span>
                            <span style="font-size: 1.5rem; opacity: ${responses[question.id] === option.value ? '1' : '0.3'};">
                                ${option.value === 1 ? '😔' : option.value === 2 ? '😐' : option.value === 3 ? '😊' : option.value === 4 ? '😄' : '🌟'}
                            </span>
                        </button>
                    `).join('')}
                </div>

                <div class="flex gap-2 justify-between mt-4">
                    <button class="btn btn-outline" onclick="previousQuestion()" 
                            ${currentCategory === 0 && currentQuestion === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    ${currentCategory >= categories.length - 1 && currentQuestion >= category.questions.length - 1 ? `
                        <button class="btn btn-primary" onclick="completeAssessment()" 
                                ${responses[question.id] === undefined ? 'disabled' : ''}>
                            <i class="fas fa-check"></i> Complete Assessment
                        </button>
                    ` : `
                        <div style="color: var(--muted); font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-info-circle"></i> Select an answer to continue
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    window.selectAnswer = (questionId, value) => {
        responses[questionId] = value;
        renderQuestion();
        
        // Auto-advance to next question after a brief delay
        setTimeout(() => {
            const categoryKey = categories[currentCategory];
            const category = AssessmentQuestions.categories[categoryKey];
            
            // Check if this is not the last question
            if (currentQuestion < category.questions.length - 1 || currentCategory < categories.length - 1) {
                window.nextQuestion();
            }
        }, 400); // 400ms delay for smooth transition
    };

    window.nextQuestion = () => {
        const categoryKey = categories[currentCategory];
        const category = AssessmentQuestions.categories[categoryKey];
        
        if (currentQuestion < category.questions.length - 1) {
            currentQuestion++;
        } else if (currentCategory < categories.length - 1) {
            currentCategory++;
            currentQuestion = 0;
        }
        renderQuestion();
    };

    window.previousQuestion = () => {
        if (currentQuestion > 0) {
            currentQuestion--;
        } else if (currentCategory > 0) {
            currentCategory--;
            const prevCategoryKey = categories[currentCategory];
            const prevCategory = AssessmentQuestions.categories[prevCategoryKey];
            currentQuestion = prevCategory.questions.length - 1;
        }
        renderQuestion();
    };

    window.completeAssessment = async () => {
        try {
            showLoader();
            
            // Calculate personality profile using the comprehensive assessment
            const scores = AssessmentQuestions.calculateProfile(responses);
            const personalityType = AssessmentQuestions.getPersonalityType(scores);
            const strengths = AssessmentQuestions.getStrengths(scores);
            const areasForGrowth = AssessmentQuestions.getAreasForGrowth(scores);
            const recommendations = AssessmentQuestions.getRecommendations(scores);
            
            // Save assessment with generated profile
            await api.createAssessment({
                responses: responses,
                scores: scores,
                personality_type: personalityType,
                strengths: strengths,
                areas_for_growth: areasForGrowth,
                recommendations: recommendations
            });

            hideLoader();
            showToast('Personality profile generated successfully!', 'success');
            
            // Reload the PersonaPrint page to show completed status
            setTimeout(() => {
                window.location.hash = '#personaprint';
                router.loadPage();
            }, 1500);
        } catch (error) {
            hideLoader();
            showToast('An error occurred. Please try again.', 'error');
            console.error('Assessment completion error:', error);
        }
    };

    renderQuestion();
}

function displayAssessmentResults(results) {
    document.getElementById('assessment-wizard').innerHTML = `
        <div class="card glass-card" style="max-width: 800px; margin: 0 auto;">
            <div class="text-center mb-4">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--success);"></i>
                <h2 class="text-gradient mt-3">Assessment Complete!</h2>
                <p class="text-muted">Your comprehensive personality profile has been generated</p>
            </div>

            <div class="card glass-card mb-4">
                <h3 class="mb-3">Your Personality Type</h3>
                <p class="text-gradient" style="font-size: 1.8rem; font-weight: 700; text-align: center;">
                    ${results.personality_type}
                </p>
            </div>

            <div class="grid grid-cols-2 mb-4">
                <div class="card glass-card">
                    <h4 class="mb-3"><i class="fas fa-star"></i> Your Strengths</h4>
                    <ul style="list-style: none; padding-left: 0;">
                        ${results.strengths.map(s => `<li style="margin-bottom: 0.75rem;"><i class="fas fa-check" style="color: var(--success);"></i> ${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="card glass-card">
                    <h4 class="mb-3"><i class="fas fa-seedling"></i> Growth Areas</h4>
                    <ul style="list-style: none; padding-left: 0;">
                        ${results.areas_for_growth.map(a => `<li style="margin-bottom: 0.75rem;"><i class="fas fa-arrow-up" style="color: var(--primary);"></i> ${a}</li>`).join('')}
                    </ul>
                </div>
            </div>

            ${results.recommendations && results.recommendations.length > 0 ? `
                <div class="card glass-card mb-4">
                    <h4 class="mb-3"><i class="fas fa-lightbulb"></i> Personalized Recommendations</h4>
                    <div class="space-y-3">
                        ${results.recommendations.map(rec => `
                            <div class="card glass-card">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="badge">${rec.category}</span>
                                    <span class="badge" style="background: ${rec.priority === 'high' ? 'var(--error)' : 'var(--primary)'};">
                                        ${rec.priority} priority
                                    </span>
                                </div>
                                <p>${rec.suggestion}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="text-center">
                <button class="btn btn-primary" onclick="router.navigate('home')">
                    Go to Home
                </button>
                <button class="btn btn-outline" onclick="router.navigate('personaprint')">
                    View Full Profile
                </button>
            </div>
        </div>
    `;
}
