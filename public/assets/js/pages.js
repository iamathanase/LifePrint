// Page Templates
// NOTE: Long HTML templates have been moved to separate HTML files
// - stories page content → public/pages/stories.html
// - about page content → public/pages/about.html
// - news page content → public/pages/news.html
// - faq page content → public/pages/faq.html
// - contact page content → public/pages/contact.html
//
// CSS for these pages → public/assets/css/pages-styles.css

const Pages = {
    home: () => {
        // Get user name from auth
        const userName = auth.user?.full_name || auth.user?.name || auth.user?.email?.split('@')[0] || 'User';
        
        return `
            <div id="home-page" class="page-container" style="padding: 0; margin: 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 100px); gap: 0;">
                    <!-- Left Side: Welcome Message and Animated Text -->
                    <div style="background: rgba(42, 47, 80, 0.6); backdrop-filter: blur(10px); padding: 4rem 3rem; display: flex; flex-direction: column; justify-content: center; position: relative;">
                        <h1 style="color: #D4B896; font-size: 3.5rem; font-weight: 300; margin-bottom: 2rem; line-height: 1.2;">
                            Welcome, ${userName}!
                        </h1>
                        
                        <div style="margin-top: 3rem; padding: 2rem; background: rgba(212, 184, 150, 0.05); border-radius: 15px; border: 1px solid rgba(212, 184, 150, 0.2);">
                            <p id="animatedMessage" style="color: #b0b0b0; font-size: 1.1rem; line-height: 1.8; min-height: 100px;">
                                Animated messages keep switching from one another in a later typing form; they should be related to what is on our website.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Right Side: Profile Picture -->
                    <div style="background: rgba(212, 184, 150, 0.15); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 3rem;">
                        <div style="width: 450px; height: 450px; border-radius: 50%; overflow: hidden; border: 8px solid #D4B896; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
                            <img id="userProfileImage" src="/assets/images/logo-circle.png" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; background: rgba(212, 184, 150, 0.3);">
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                // Animated Messages - Energetic and Welcoming
                const messages = [
                    "🌟 You're doing amazing! Every step you take brings you closer to your wellness goals.",
                    "💪 Believe in yourself! You have the power to transform your life, one day at a time.",
                    "✨ Today is full of possibilities! What will you accomplish on your wellness journey?",
                    "🎯 Your dedication is inspiring! Keep tracking, keep growing, keep shining.",
                    "🌈 Embrace your unique journey! Your PersonaPrint shows what makes you extraordinary.",
                    "🚀 You're unstoppable! Your consistency is building habits that will last a lifetime.",
                    "💫 Celebrate yourself! Every healthy choice you make is a victory worth honoring.",
                    "🌻 You're glowing from within! Your wellness journey is transforming you beautifully.",
                    "⭐ Keep going! The best version of yourself is emerging with each passing day.",
                    "🎨 Your story matters! Share your experiences and inspire others in our community.",
                    "🏆 You're a champion! Your commitment to wellness is remarkable and powerful.",
                    "🌺 Radiate positivity! Your energy and enthusiasm are contagious.",
                    "💝 Be proud of yourself! You're investing in the most important person - YOU!",
                    "🦋 Transform and flourish! Your wellness journey is a beautiful metamorphosis.",
                    "🌟 Shine bright! Your dedication to self-improvement lights up the world around you."
                ];
                
                let currentMessageIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                
                function typeMessage() {
                    const messageElement = document.getElementById('animatedMessage');
                    if (!messageElement) return;
                    
                    const currentMessage = messages[currentMessageIndex];
                    
                    if (!isDeleting) {
                        // Typing
                        messageElement.textContent = currentMessage.substring(0, charIndex + 1);
                        charIndex++;
                        
                        if (charIndex === currentMessage.length) {
                            // Pause before deleting
                            setTimeout(() => { isDeleting = true; }, 3500);
                            return;
                        }
                        setTimeout(typeMessage, 40);
                    } else {
                        // Deleting
                        messageElement.textContent = currentMessage.substring(0, charIndex - 1);
                        charIndex--;
                        
                        if (charIndex === 0) {
                            isDeleting = false;
                            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
                            setTimeout(typeMessage, 300);
                            return;
                        }
                        setTimeout(typeMessage, 20);
                    }
                }
                
                // Start typing animation
                setTimeout(typeMessage, 1000);
                
                // Load user profile image if available
                if (auth.user && auth.user.profile_image) {
                    const profileImg = document.getElementById('userProfileImage');
                    if (profileImg) {
                        profileImg.src = auth.user.profile_image;
                    }
                }
            </script>
        `;
    },

    login: () => {
        setTimeout(() => {
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                if (!validateEmail(email)) {
                    showToast('Please enter a valid email', 'error');
                    return;
                }

                if (!validatePassword(password)) {
                    showToast('Password must be at least 6 characters', 'error');
                    return;
                }

                try {
                    showLoader();
                    await auth.login(email, password);
                    showToast('Login successful!', 'success');
                    router.navigate('home');
                } catch (error) {
                    showToast(error.message, 'error');
                } finally {
                    hideLoader();
                }
            });
        }, 0);

        return `
            <div class="container" style="max-width: 500px; padding-top: 4rem;">
                <div class="card glass-card">
                    <h2 class="text-gradient text-center mb-4" style="font-size: 2rem;">Welcome Back</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="email" class="form-input" placeholder="you@example.com" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="password" class="form-input" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>
                    <p class="text-center mt-4 text-muted">
                        Don't have an account? <a href="#signup" style="color: var(--primary);">Sign up</a>
                    </p>
                </div>
            </div>
        `;
    },

    signup: () => {
        setTimeout(() => {
            document.getElementById('signupForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (!name.trim()) {
                    showToast('Please enter your name', 'error');
                    return;
                }

                if (!validateEmail(email)) {
                    showToast('Please enter a valid email', 'error');
                    return;
                }

                if (!validatePassword(password)) {
                    showToast('Password must be at least 6 characters', 'error');
                    return;
                }

                if (password !== confirmPassword) {
                    showToast('Passwords do not match', 'error');
                    return;
                }

                try {
                    showLoader();
                    await auth.signup(name, email, password);
                    showToast('Account created successfully! Please login.', 'success');
                    router.navigate('home');
                } catch (error) {
                    showToast(error.message, 'error');
                } finally {
                    hideLoader();
                }
            });
        }, 0);

        return `
            <div class="container" style="max-width: 500px; padding-top: 4rem;">
                <div class="card glass-card">
                    <h2 class="text-gradient text-center mb-4" style="font-size: 2rem;">Create Account</h2>
                    <form id="signupForm">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" id="name" class="form-input" placeholder="John Doe" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="email" class="form-input" placeholder="you@example.com" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="password" class="form-input" placeholder="••••••••" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" id="confirmPassword" class="form-input" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Sign Up</button>
                    </form>
                    <p class="text-center mt-4 text-muted">
                        Already have an account? <a href="#login" style="color: var(--primary);">Login</a>
                    </p>
                </div>
            </div>
        `;
    },

    analytics: () => {
        return renderAnalyticsPage();
    },

    friends: () => {
        return renderFriendsPage();
    },

    stories: () => {
        // Stories page moved to public/pages/stories.html
        window.location.href = 'stories.html';
        return '<div>Loading stories page...</div>';
    },

    about: () => {
        // About page moved to public/pages/about.html
        window.location.href = 'about.html';
        return '<div>Loading about page...</div>';
    },

    news: () => {
        // News page moved to public/pages/news.html
        window.location.href = 'news.html';
        return '<div>Loading news page...</div>';
    },

    faq: () => {
        // FAQ page moved to public/pages/faq.html
        window.location.href = 'faq.html';
        return '<div>Loading FAQ page...</div>';
    },

    contact: () => {
        // Contact page moved to public/pages/contact.html
        window.location.href = 'contact.html';
        return '<div>Loading contact page...</div>';
    },

    getstarted: () => {
        // Automatically redirect to login page
        setTimeout(() => {
            router.navigate('login');
        }, 0);
        
        return `
        <div class="container text-center" style="padding-top: 4rem;">
            <h1 class="text-gradient" style="font-size: 2.5rem; margin-bottom: 1rem;">Getting Started...</h1>
            <p class="text-muted">Redirecting you to login page</p>
        </div>
        `;
    },

    '404': () => `
        <div class="container text-center" style="padding-top: 4rem;">
            <h1 class="text-gradient" style="font-size: 4rem;">404</h1>
            <p class="text-muted" style="font-size: 1.5rem; margin-bottom: 2rem;">Page not found</p>
            <a href="#home" class="btn btn-primary">Go Home</a>
        </div>
    `
};
