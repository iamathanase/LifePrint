php
<?php
header('Content-Type: application/json');

try {
    $token = $_POST['token'] ?? $_GET['token'] ?? null;
    
    if (!$token) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'No token provided']);
        exit;
    }
    
    // Verify token with Google
    $url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' . urlencode($token);
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    
    if (isset($data['error'])) {
        http_response_code(401);
        echo json_encode(['error' => true, 'message' => 'Invalid token']);
        exit;
    }
    
    // Token is valid, return user info
    echo json_encode(['error' => false, 'token' => $token, 'user' => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}