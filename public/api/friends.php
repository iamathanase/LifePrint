<?php
// Friends API for LifePrint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

if ($method === 'GET') {
    // Get friends list with profile info
    $query = "SELECT u.id, u.email, p.full_name, p.avatar_url, p.bio, p.personality_type, f.created_at as friend_since
              FROM friends f
              JOIN users u ON (f.friend_id = u.id)
              LEFT JOIN profiles p ON (u.id = p.user_id)
              WHERE f.user_id = :user_id AND f.status = 'active'
              ORDER BY f.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $friends = [];
    while ($row = $stmt->fetch()) {
        $friends[] = $row;
    }
    
    echo json_encode(['error' => false, 'data' => $friends]);
}
?>
