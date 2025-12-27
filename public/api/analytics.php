<?php
// Analytics API for LifePrint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit();
}

// Get the sub-path
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

$days = isset($_GET['days']) ? intval($_GET['days']) : 7;

// Handle /analytics or /analytics/overview
if ($method === 'GET' && (preg_match('#^/api/analytics(/overview)?$#', $path))) {
    // Get analytics overview
    $analytics = [
        'streak_days' => 0,
        'assessments_count' => 0,
        'goals_completed' => 0,
        'meals_logged' => 0,
        'stories_written' => 0,
        'wellness_score' => 0
    ];

    // Count assessments taken
    $query = "SELECT COUNT(*) as count FROM persona_assessments 
              WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    $analytics['assessments_count'] = $stmt->fetch()['count'];

    // Count goals completed
    $query = "SELECT COUNT(*) as count FROM time_capsule_goals 
              WHERE user_id = :user_id AND status = 'completed'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    $analytics['goals_completed'] = $stmt->fetch()['count'];

// Count meals logged in last X days
$query = "SELECT COUNT(*) as count FROM food_logs 
          WHERE user_id = :user_id AND logged_at >= DATE_SUB(NOW(), INTERVAL :days DAY)";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $userId);
$stmt->bindParam(':days', $days);
$stmt->execute();
$analytics['meals_logged'] = $stmt->fetch()['count'];

// Count stories written
$query = "SELECT COUNT(*) as count FROM stories 
          WHERE user_id = :user_id AND created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $userId);
$stmt->bindParam(':days', $days);
$stmt->execute();
$analytics['stories_written'] = $stmt->fetch()['count'];

    // Calculate wellness score (simple average based on activity)
    $totalActivities = $analytics['meals_logged'] + $analytics['stories_written'] + ($analytics['goals_completed'] * 2);
    $analytics['wellness_score'] = min(100, ($totalActivities / $days) * 10);

    // Get recent activity
    $activityQuery = "SELECT * FROM activity_log 
                      WHERE user_id = :user_id 
                      ORDER BY created_at DESC 
                      LIMIT 10";
    $stmt = $db->prepare($activityQuery);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();

    $activities = [];
    while ($row = $stmt->fetch()) {
        $activities[] = $row;
    }

    http_response_code(200);
    echo json_encode([
        'error' => false,
        'data' => [
            'overview' => $analytics,
            'recent_activities' => $activities
        ]
    ]);
} else {
    http_response_code(404);
    echo json_encode(['error' => true, 'message' => 'Endpoint not found']);
}
?>
