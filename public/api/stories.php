<?php
// Stories API for LifePrint
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
        $query = "SELECT s.*, p.full_name as author_name 
                  FROM stories s 
                  LEFT JOIN profiles p ON s.user_id = p.user_id 
                  WHERE s.user_id = :user_id 
                  ORDER BY s.created_at DESC LIMIT 50";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $stories = [];
        while ($row = $stmt->fetch()) {
            $row['tags'] = json_decode($row['tags'], true);
            $stories[] = $row;
        }
        
        http_response_code(200);
        echo json_encode(['error' => false, 'data' => $stories]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to fetch stories: ' . $e->getMessage()]);
    }
    
} elseif ($method === 'POST') {
    try {
        if (!isset($data['title']) || !isset($data['content'])) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'Missing required fields']);
            exit();
        }

        $query = "INSERT INTO stories (user_id, title, content, category, tags, mood, is_private, is_public) 
                  VALUES (:user_id, :title, :content, :category, :tags, :mood, :is_private, :is_public)";
        
        $stmt = $db->prepare($query);
        
        // Bind all parameters as variables
        $title = $data['title'];
        $content = $data['content'];
        $category = $data['category'] ?? 'personal';
        $tags = json_encode($data['tags'] ?? []);
        $mood = $data['mood'] ?? null;
        $isPrivate = $data['is_private'] ?? true;
        $isPublic = $data['is_public'] ?? false;
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':tags', $tags);
        $stmt->bindParam(':mood', $mood);
        $stmt->bindParam(':is_private', $isPrivate);
        $stmt->bindParam(':is_public', $isPublic);
        
        if ($stmt->execute()) {
            // Log activity
            $activityQuery = "INSERT INTO activity_log (user_id, activity_type, description) 
                             VALUES (:user_id, 'story_created', :description)";
            $activityStmt = $db->prepare($activityQuery);
            $activityStmt->bindParam(':user_id', $userId);
            $actDesc = "Wrote story: " . $data['title'];
            $activityStmt->bindParam(':description', $actDesc);
            $activityStmt->execute();
            
            http_response_code(201);
            echo json_encode(['error' => false, 'id' => $db->lastInsertId(), 'message' => 'Story saved successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => true, 'message' => 'Failed to save story']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}
?>
