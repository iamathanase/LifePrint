<?php
// Food Logs API for LifePrint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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

if ($method === 'GET') {
    try {
        $query = "SELECT * FROM food_logs WHERE user_id = :user_id ORDER BY logged_at DESC LIMIT 50";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $logs = [];
        while ($row = $stmt->fetch()) {
            $row['food_items'] = json_decode($row['food_items'], true);
            $logs[] = $row;
        }
        
        http_response_code(200);
        echo json_encode(['error' => false, 'data' => $logs]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to fetch food logs: ' . $e->getMessage()]);
    }
    
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['meal_type']) || !isset($data['food_items'])) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'Missing required fields']);
            exit();
        }
        
        // Convert food_items to JSON if it's a string
        $foodItems = is_string($data['food_items']) ? json_encode([$data['food_items']]) : json_encode($data['food_items'] ?? []);
        
        $query = "INSERT INTO food_logs (user_id, meal_type, food_items, portion_size, calories, mood, notes, photo_url) 
                  VALUES (:user_id, :meal_type, :food_items, :portion_size, :calories, :mood, :notes, :photo_url)";
        
        $stmt = $db->prepare($query);
        
        // Bind all parameters as variables
        $mealType = $data['meal_type'];
        $portionSize = $data['portion_size'] ?? null;
        $calories = $data['calories'] ?? null;
        $mood = $data['mood'] ?? null;
        $notes = $data['notes'] ?? null;
        $photoUrl = $data['photo_url'] ?? null;
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':meal_type', $mealType);
        $stmt->bindParam(':food_items', $foodItems);
        $stmt->bindParam(':portion_size', $portionSize);
        $stmt->bindParam(':calories', $calories);
        $stmt->bindParam(':mood', $mood);
        $stmt->bindParam(':notes', $notes);
        $stmt->bindParam(':photo_url', $photoUrl);
        
        if ($stmt->execute()) {
            // Log activity
            $activityQuery = "INSERT INTO activity_log (user_id, activity_type, description) 
                             VALUES (:user_id, 'food_logged', :description)";
            $activityStmt = $db->prepare($activityQuery);
            $activityStmt->bindParam(':user_id', $userId);
            $description = "Logged " . $data['meal_type'];
            $activityStmt->bindParam(':description', $description);
            $activityStmt->execute();
            
            http_response_code(201);
            echo json_encode(['error' => false, 'id' => $db->lastInsertId(), 'message' => 'Food log saved successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => true, 'message' => 'Failed to save food log']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}
?>
