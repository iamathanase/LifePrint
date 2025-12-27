// Friends Feature - Recommendations, Requests, and Public Posts

Pages.friends = () => {
    setTimeout(async () => {
        try {
            // Load friends, requests, and recommendations
            await loadFriendsData();
            
            // Tab switching
            document.querySelectorAll('[data-tab]').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    switchTab(tabName);
                });
            });
            
            // Search functionality
            document.getElementById('friendSearch')?.addEventListener('input', (e) => {
                searchFriends(e.target.value);
            });
            
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }, 0);

    return `
        <div class="container" style="padding-top: 2rem;">
            <div class="text-center mb-4">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--primary);"></i>
                <h1 class="text-gradient mt-2">Friends & Community</h1>
                <p class="text-muted">Connect with people who share your interests</p>
            </div>

            <!-- Tabs -->
            <div class="flex gap-2 mb-4" style="justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-primary tab-btn active" data-tab="friends">
                    <i class="fas fa-user-friends"></i> My Friends
                </button>
                <button class="btn btn-outline tab-btn" data-tab="requests">
                    <i class="fas fa-envelope"></i> Requests <span id="requestCount" class="badge">0</span>
                </button>
                <button class="btn btn-outline tab-btn" data-tab="recommendations">
                    <i class="fas fa-lightbulb"></i> Recommendations
                </button>
                <button class="btn btn-outline tab-btn" data-tab="discover">
                    <i class="fas fa-compass"></i> Discover
                </button>
            </div>

            <!-- Search Bar -->
            <div class="card glass-card mb-4">
                <div class="form-group mb-0">
                    <input type="text" id="friendSearch" class="form-input" placeholder="Search for friends by name, interests, or location...">
                </div>
            </div>

            <!-- Friends List Tab -->
            <div id="friends-tab" class="tab-content active">
                <div id="friendsList"></div>
            </div>

            <!-- Friend Requests Tab -->
            <div id="requests-tab" class="tab-content" style="display: none;">
                <div class="card glass-card mb-4">
                    <h3 class="mb-4">Pending Requests</h3>
                    <div id="pendingRequests"></div>
                </div>
                <div class="card glass-card">
                    <h3 class="mb-4">Sent Requests</h3>
                    <div id="sentRequests"></div>
                </div>
            </div>

            <!-- Recommendations Tab -->
            <div id="recommendations-tab" class="tab-content" style="display: none;">
                <div class="card glass-card">
                    <h3 class="mb-4">People You May Know</h3>
                    <p class="text-muted mb-4">Based on shared interests, goals, and personality traits</p>
                    <div id="recommendedFriends"></div>
                </div>
            </div>

            <!-- Discover Tab - Public Posts Feed -->
            <div id="discover-tab" class="tab-content" style="display: none;">
                <div class="card glass-card">
                    <h3 class="mb-4">Community Feed</h3>
                    <p class="text-muted mb-4">See what others are sharing publicly</p>
                    <div id="publicPostsFeed"></div>
                </div>
            </div>
        </div>
    `;
};

async function loadFriendsData() {
    try {
        // Load all friends data
        const [friendsResp, pendingResp, sentResp, recsResp, postsResp] = await Promise.all([
            api.getFriends().catch(() => ({ data: [] })),
            api.getFriendRequests('pending').catch(() => ({ data: [] })),
            api.getFriendRequests('sent').catch(() => ({ data: [] })),
            api.getFriendRecommendations().catch(() => ({ data: [] })),
            api.getPublicPosts().catch(() => ({ data: [] }))
        ]);

        const friends = friendsResp.data || [];
        const pendingRequests = pendingResp.data || [];
        const sentRequests = sentResp.data || [];
        const recommendations = recsResp.data || [];
        const publicPosts = postsResp.data || [];

        renderFriendsList(friends);
        renderPendingRequests(pendingRequests);
        renderSentRequests(sentRequests);
        renderRecommendations(recommendations);
        renderPublicPosts(publicPosts);
        
        // Update request count badge
        document.getElementById('requestCount').textContent = pendingRequests.length;
    } catch (error) {
        console.error('Error loading friends data:', error);
        showToast('Failed to load friends data', 'error');
    }
}

function renderFriendsList(friends) {
    const container = document.getElementById('friendsList');
    
    if (!friends || friends.length === 0) {
        container.innerHTML = `
            <div class="card glass-card text-center">
                <i class="fas fa-user-plus" style="font-size: 3rem; color: var(--muted); margin-bottom: 1rem;"></i>
                <p class="text-muted">You haven't added any friends yet</p>
                <button class="btn btn-primary mt-3" onclick="switchTab('recommendations')">
                    Find Friends
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-3">
            ${friends.map(friend => `
                <div class="card glass-card">
                    <div class="flex items-center gap-3">
                        <div class="avatar" style="width: 60px; height: 60px; flex-shrink: 0;">
                            ${friend.avatar_url ? 
                                `<img src="${friend.avatar_url}" alt="${friend.full_name}">` :
                                `<i class="fas fa-user"></i>`
                            }
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <h4 style="margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${friend.full_name || 'Anonymous'}
                            </h4>
                            <p class="text-muted" style="font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${friend.commonInterests || 'Friend'} in common
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2 mt-3">
                        <button class="btn btn-sm btn-outline" onclick="viewFriendProfile('${friend.user_id}')">
                            <i class="fas fa-eye"></i> View Profile
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="unfriend('${friend.user_id}')" style="color: var(--error);">
                            <i class="fas fa-user-minus"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPendingRequests(requests) {
    const container = document.getElementById('pendingRequests');
    
    if (!requests || requests.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No pending requests</p>';
        return;
    }

    container.innerHTML = requests.map(req => `
        <div class="card glass-card mb-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="avatar">
                        ${req.avatar_url ? 
                            `<img src="${req.avatar_url}" alt="${req.full_name}">` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div>
                        <h4>${req.full_name || 'Anonymous'}</h4>
                        <p class="text-muted" style="font-size: 0.875rem;">${req.commonality || 'wants to be friends'}</p>
                        <p class="text-muted" style="font-size: 0.75rem;">${formatDate(req.created_at)}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="acceptFriendRequest('${req.id}')">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="declineFriendRequest('${req.id}')">
                        <i class="fas fa-times"></i> Decline
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSentRequests(requests) {
    const container = document.getElementById('sentRequests');
    
    if (!requests || requests.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No sent requests</p>';
        return;
    }

    container.innerHTML = requests.map(req => `
        <div class="card glass-card mb-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="avatar">
                        ${req.avatar_url ? 
                            `<img src="${req.avatar_url}" alt="${req.full_name}">` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div>
                        <h4>${req.full_name || 'Anonymous'}</h4>
                        <p class="text-muted" style="font-size: 0.875rem;">Request sent ${formatDate(req.created_at)}</p>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline" onclick="cancelFriendRequest('${req.id}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `).join('');
}

function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendedFriends');
    
    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No recommendations available</p>';
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-2">
            ${recommendations.map(person => `
                <div class="card glass-card">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="avatar" style="width: 60px; height: 60px;">
                            ${person.avatar_url ? 
                                `<img src="${person.avatar_url}" alt="${person.full_name}">` :
                                `<i class="fas fa-user"></i>`
                            }
                        </div>
                        <div>
                            <h4>${person.full_name || 'Anonymous'}</h4>
                            <p class="text-muted" style="font-size: 0.875rem;">${person.location || 'Unknown location'}</p>
                        </div>
                    </div>
                    <div class="mb-3">
                        <p style="font-size: 0.875rem; color: var(--primary);">
                            <i class="fas fa-star"></i> ${person.matchScore}% match
                        </p>
                        <p class="text-muted" style="font-size: 0.875rem;">
                            ${person.commonality}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-primary" onclick="sendFriendRequest('${person.user_id}')">
                            <i class="fas fa-user-plus"></i> Add Friend
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="viewFriendProfile('${person.user_id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPublicPosts(posts) {
    const container = document.getElementById('publicPostsFeed');
    
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No public posts yet. Be the first to share!</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="card glass-card mb-4">
            <div class="flex items-center gap-3 mb-3">
                <div class="avatar">
                    ${post.avatar_url ? 
                        `<img src="${post.avatar_url}" alt="${post.author}">` :
                        `<i class="fas fa-user"></i>`
                    }
                </div>
                <div style="flex: 1;">
                    <h4>${post.author || 'Anonymous'}</h4>
                    <p class="text-muted" style="font-size: 0.75rem;">${formatDate(post.created_at)}</p>
                </div>
                ${!post.isFriend ? `
                    <button class="btn btn-sm btn-outline" onclick="sendFriendRequest('${post.user_id}')">
                        <i class="fas fa-user-plus"></i> Add Friend
                    </button>
                ` : ''}
            </div>
            <div class="mb-3">
                <h4 class="mb-2">${post.title}</h4>
                <p>${post.content}</p>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="flex gap-2 mt-2" style="flex-wrap: wrap;">
                        ${post.tags.map(tag => `<span class="badge">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="flex gap-3 text-muted" style="font-size: 0.875rem;">
                <span><i class="fas fa-heart"></i> ${post.likes || 0}</span>
                <span><i class="fas fa-comment"></i> ${post.comments || 0}</span>
            </div>
        </div>
    `).join('');
}

function switchTab(tabName) {
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'btn-primary'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.add('btn-outline'));
    
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    activeBtn.classList.remove('btn-outline');
    activeBtn.classList.add('btn-primary', 'active');
    
    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    document.getElementById(`${tabName}-tab`).style.display = 'block';
}

async function sendFriendRequest(userId) {
    try {
        showLoader();
        await api.sendFriendRequest(userId);
        showToast('Friend request sent!', 'success');
        await loadFriendsData();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

async function acceptFriendRequest(requestId) {
    try {
        showLoader();
        await api.acceptFriendRequest(requestId);
        showToast('Friend request accepted!', 'success');
        await loadFriendsData();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

async function declineFriendRequest(requestId) {
    try {
        showLoader();
        await api.declineFriendRequest(requestId);
        showToast('Friend request declined', 'success');
        await loadFriendsData();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

async function cancelFriendRequest(requestId) {
    try {
        showLoader();
        await api.cancelFriendRequest(requestId);
        showToast('Friend request cancelled', 'success');
        await loadFriendsData();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

async function unfriend(userId) {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    
    try {
        showLoader();
        await api.unfriend(userId);
        showToast('Friend removed', 'success');
        await loadFriendsData();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

function viewFriendProfile(userId) {
    router.navigate(`profile/${userId}`);
}

function searchFriends(query) {
    // Implement search functionality
    console.log('Searching for:', query);
}
