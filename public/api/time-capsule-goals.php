<?php
// Goals API for LifePrint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
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

$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'GET') {
    try {
        $query = "SELECT * FROM time_capsule_goals 
                  WHERE user_id = :user_id 
                  ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $goals = [];
        while ($row = $stmt->fetch()) {
            $row['milestones'] = json_decode($row['milestones'], true);
            $row['reminders'] = json_decode($row['reminders'], true);
            $goals[] = $row;
        }
        
        http_response_code(200);
        echo json_encode(['error' => false, 'data' => $goals]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to fetch goals: ' . $e->getMessage()]);
    }
    
} elseif ($method === 'POST') {
    try {
        if (!isset($data['title']) || !isset($data['target_date'])) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'Missing required fields']);
            exit();
        }

        $query = "INSERT INTO time_capsule_goals 
                  (user_id, title, description, category, target_date, unlock_date, is_locked, milestones, reminders, status) 
                  VALUES (:user_id, :title, :description, :category, :target_date, :unlock_date, :is_locked, :milestones, :reminders, :status)";
        
        $stmt = $db->prepare($query);
        
        // Bind all parameters as variables
        $title = $data['title'];
        $description = $data['description'] ?? null;
        $category = $data['category'] ?? 'personal';
        $targetDate = $data['target_date'];
        $unlockDate = $data['unlock_date'] ?? null;
        $isLocked = $data['is_locked'] ?? false;
        $milestones = json_encode($data['milestones'] ?? []);
        $reminders = json_encode($data['reminders'] ?? []);
        $status = $data['status'] ?? 'active';
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':target_date', $targetDate);
        $stmt->bindParam(':unlock_date', $unlockDate);
        $stmt->bindParam(':is_locked', $isLocked);
        $stmt->bindParam(':milestones', $milestones);
        $stmt->bindParam(':reminders', $reminders);
        $stmt->bindParam(':status', $status);
        
        if ($stmt->execute()) {
            // Log activity
            $activityQuery = "INSERT INTO activity_log (user_id, activity_type, description) 
                             VALUES (:user_id, 'goal_created', :description)";
            $activityStmt = $db->prepare($activityQuery);
            $activityStmt->bindParam(':user_id', $userId);
            $actDesc = "Created goal: " . $data['title'];
            $activityStmt->bindParam(':description', $actDesc);
            $activityStmt->execute();
            
            http_response_code(201);
            echo json_encode(['error' => false, 'id' => $db->lastInsertId(), 'message' => 'Goal saved successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => true, 'message' => 'Failed to save goal']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    
} elseif ($method === 'PUT') {
    $pathParts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
    $goalId = end($pathParts);
    
    $query = "UPDATE time_capsule_goals SET 
              progress = :progress,
              status = :status,
              updated_at = NOW()
              WHERE id = :id AND user_id = :user_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':progress', $data['progress']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':id', $goalId);
    $stmt->bindParam(':user_id', $userId);
    
    if ($stmt->execute()) {
        echo json_encode(['error' => false, 'message' => 'Goal updated successfully']);
    } else {
        echo json_encode(['error' => true, 'message' => 'Failed to update goal']);
    }
}
?>
