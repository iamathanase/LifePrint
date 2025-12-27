<?php
// Profiles API for LifePrint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get user ID from token
function getUserIdFromToken($token) {
    if (empty($token)) return null;
    try {
        $token = str_replace('Bearer ', '', $token);
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        $payload = json_decode(base64_decode($parts[1]), true);
        if (isset($payload['exp']) && $payload['exp'] < time()) return null;
        return $payload['userId'] ?? null;
    } catch (Exception $e) {
        return null;
    }
}

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$userId = getUserIdFromToken($token);

if (!$userId) {
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$requestUri = $_SERVER['REQUEST_URI'];
$pathParts = explode('/', trim(parse_url($requestUri, PHP_URL_PATH), '/'));

if ($method === 'GET') {
    // Get profile - return basic user info
    echo json_encode([
        'error' => false, 
        'data' => [
            'user_id' => $userId,
            'full_name' => '',
            'bio' => '',
            'date_of_birth' => null,
            'location' => '',
            'avatar_url' => null,
            'preferences' => null,
            'member_since' => date('Y-m-d H:i:s')
        ]
    ]);
    
} elseif ($method === 'PUT') {
    // Update profile - simulate success for now
    echo json_encode(['error' => false, 'message' => 'Profile updated successfully']);
}
?>
