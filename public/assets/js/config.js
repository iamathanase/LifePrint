// Configuration - School Server & Local Development
const CONFIG = {
    // Auto-detect environment and set API URL
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '/api' 
        : '/~athanase.abayo/LifePrint/public/api',
    
    TOKEN_KEY: 'lifeprint_token',
    USER_KEY: 'lifeprint_user',
    GOOGLE_CLIENT_ID: '493540523260-1o2s3tajlq0gdbel6so7bs0cq3cr8un8.apps.googleusercontent.com'
};