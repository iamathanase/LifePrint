<?php
// Simple router for LifePrint API
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Only handle API routes - let static files be served normally
if (strpos($path, '/api/') === 0) {
    // Route to appropriate file
    if (preg_match('#^/api/auth(/.*)?$#', $path)) {
        require __DIR__ . '/api/auth.php';
        return;
    } elseif (preg_match('#^/api/assessments(/.*)?$#', $path)) {
        require __DIR__ . '/api/assessments.php';
        return;
    } elseif (preg_match('#^/api/profiles(/.*)?$#', $path)) {
        require __DIR__ . '/api/profiles.php';
        return;
    } elseif (preg_match('#^/api/food-logs(/.*)?$#', $path)) {
        require __DIR__ . '/api/food-logs.php';
        return;
    } elseif (preg_match('#^/api/stories(/.*)?$#', $path)) {
        require __DIR__ . '/api/stories.php';
        return;
    } elseif (preg_match('#^/api/time-capsule-goals(/.*)?$#', $path)) {
        require __DIR__ . '/api/time-capsule-goals.php';
        return;
    } elseif (preg_match('#^/api/goals(/.*)?$#', $path)) {
        require __DIR__ . '/api/time-capsule-goals.php';
        return;
    } elseif (preg_match('#^/api/friends(/.*)?$#', $path)) {
        require __DIR__ . '/api/friends.php';
        return;
    } elseif (preg_match('#^/api/analytics(/.*)?$#', $path)) {
        require __DIR__ . '/api/analytics.php';
        return;
    } elseif (preg_match('#^/api/test-db\.php$#', $path)) {
        require __DIR__ . '/test-db.php';
        return;
    }
}

// For all other requests (static files), let PHP built-in server handle them
return false;
?>