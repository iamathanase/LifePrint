<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$user_id = $_SESSION['user_id'] ?? 1; // Default for testing

// PersonaPrint APIs
class PersonaPrintAPI {
    private $conn;
    private $user_id;

    public function __construct($conn, $user_id) {
        $this->conn = $conn;
        $this->user_id = $user_id;
    }

    public function getProfile() {
        $query = "SELECT * FROM persona_profiles WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode($result->fetch_assoc());
        } else {
            echo json_encode(['error' => 'Profile not found']);
        }
    }

    public function updateProfile($data) {
        $traits = json_encode($data['traits'] ?? []);
        $type = $data['type'] ?? '';
        $completion = $data['completion'] ?? 0;

        $query = "INSERT INTO persona_profiles (user_id, traits, personality_type, completion_percentage) 
                  VALUES (?, ?, ?, ?) 
                  ON DUPLICATE KEY UPDATE 
                  traits = VALUES(traits), personality_type = VALUES(personality_type), completion_percentage = VALUES(completion_percentage)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("issi", $this->user_id, $traits, $type, $completion);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Profile updated']);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }

    public function saveAssessment($answers) {
        $assessment_data = json_encode($answers);
        $query = "INSERT INTO persona_assessments (user_id, answers, created_at) VALUES (?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $this->user_id, $assessment_data);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'assessment_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }
}

// FoodPrint APIs
class FoodPrintAPI {
    private $conn;
    private $user_id;

    public function __construct($conn, $user_id) {
        $this->conn = $conn;
        $this->user_id = $user_id;
    }

    public function logMeal($meal_data) {
        $query = "INSERT INTO meal_logs (user_id, meal_type, calories, description, logged_at) VALUES (?, ?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $meal_type = $meal_data['meal_type'] ?? '';
        $calories = $meal_data['calories'] ?? 0;
        $description = $meal_data['description'] ?? '';
        
        $stmt->bind_param("isis", $this->user_id, $meal_type, $calories, $description);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'meal_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }

    public function getDailyMeals($date = null) {
        $date = $date ?? date('Y-m-d');
        $query = "SELECT * FROM meal_logs WHERE user_id = ? AND DATE(logged_at) = ? ORDER BY logged_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $this->user_id, $date);
        $stmt->execute();
        
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
    }

    public function getHabitStats($date = null) {
        $date = $date ?? date('Y-m-d');
        $query = "SELECT habit_type, current_value, goal_value FROM habit_tracking WHERE user_id = ? AND DATE(tracked_at) = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $this->user_id, $date);
        $stmt->execute();
        
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
    }

    public function updateHabit($habit_type, $value) {
        $query = "INSERT INTO habit_tracking (user_id, habit_type, current_value, tracked_at) VALUES (?, ?, ?, NOW())
                  ON DUPLICATE KEY UPDATE current_value = VALUES(current_value)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isi", $this->user_id, $habit_type, $value);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }
}

// StoryWeaver APIs
class StoryWeaverAPI {
    private $conn;
    private $user_id;

    public function __construct($conn, $user_id) {
        $this->conn = $conn;
        $this->user_id = $user_id;
    }

    public function saveJournalEntry($entry_data) {
        $query = "INSERT INTO journal_entries (user_id, content, emotion, title, created_at) VALUES (?, ?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $content = $entry_data['content'] ?? '';
        $emotion = $entry_data['emotion'] ?? '';
        $title = $entry_data['title'] ?? 'Journal Entry';
        
        $stmt->bind_param("isss", $this->user_id, $content, $emotion, $title);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'entry_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }

    public function getJournalEntries($limit = 20, $offset = 0) {
        $query = "SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iii", $this->user_id, $limit, $offset);
        $stmt->execute();
        
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
    }

    public function addMemory($memory_data) {
        $query = "INSERT INTO life_memories (user_id, title, description, year, emotion, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $title = $memory_data['title'] ?? '';
        $description = $memory_data['description'] ?? '';
        $year = $memory_data['year'] ?? date('Y');
        $emotion = $memory_data['emotion'] ?? '';
        
        $stmt->bind_param("issss", $this->user_id, $title, $description, $year, $emotion);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'memory_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }

    public function getTimeline() {
        $query = "SELECT * FROM life_memories WHERE user_id = ? ORDER BY year DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->user_id);
        $stmt->execute();
        
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
    }
}

// Time Capsule APIs
class TimeCapsuleAPI {
    private $conn;
    private $user_id;

    public function __construct($conn, $user_id) {
        $this->conn = $conn;
        $this->user_id = $user_id;
    }

    public function saveGoal($goal_data) {
        $query = "INSERT INTO future_goals (user_id, title, description, target_year, priority, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $title = $goal_data['title'] ?? '';
        $description = $goal_data['description'] ?? '';
        $target_year = $goal_data['target_year'] ?? 2040;
        $priority = $goal_data['priority'] ?? 'medium';
        
        $stmt->bind_param("issss", $this->user_id, $title, $description, $target_year, $priority);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'goal_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }

    public function getGoals() {
        $query = "SELECT * FROM future_goals WHERE user_id = ? ORDER BY target_year, priority DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->user_id);
        $stmt->execute();
        
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
    }

    public function trackProgress($goal_id, $progress_data) {
        $query = "INSERT INTO goal_progress (goal_id, progress_percentage, notes, updated_at) VALUES (?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $progress = $progress_data['progress'] ?? 0;
        $notes = $progress_data['notes'] ?? '';
        
        $stmt->bind_param("iss", $goal_id, $progress, $notes);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => $stmt->error]);
        }
    }

    public function getVisionBoard() {
        $query = "SELECT * FROM vision_board_items WHERE user_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->user_id);
        $stmt->execute();
        
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
    }
}

// Route requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    switch ($action) {
        case 'persona_update':
            $api = new PersonaPrintAPI($conn, $user_id);
            $api->updateProfile($data);
            break;
        case 'persona_save_assessment':
            $api = new PersonaPrintAPI($conn, $user_id);
            $api->saveAssessment($data['answers']);
            break;
        case 'meal_log':
            $api = new FoodPrintAPI($conn, $user_id);
            $api->logMeal($data);
            break;
        case 'habit_update':
            $api = new FoodPrintAPI($conn, $user_id);
            $api->updateHabit($data['habit_type'], $data['value']);
            break;
        case 'journal_save':
            $api = new StoryWeaverAPI($conn, $user_id);
            $api->saveJournalEntry($data);
            break;
        case 'memory_add':
            $api = new StoryWeaverAPI($conn, $user_id);
            $api->addMemory($data);
            break;
        case 'goal_save':
            $api = new TimeCapsuleAPI($conn, $user_id);
            $api->saveGoal($data);
            break;
        case 'goal_progress':
            $api = new TimeCapsuleAPI($conn, $user_id);
            $api->trackProgress($data['goal_id'], $data);
            break;
        default:
            echo json_encode(['error' => 'Unknown action']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    switch ($action) {
        case 'persona_get':
            $api = new PersonaPrintAPI($conn, $user_id);
            $api->getProfile();
            break;
        case 'meals_get':
            $api = new FoodPrintAPI($conn, $user_id);
            $api->getDailyMeals($_GET['date'] ?? null);
            break;
        case 'habits_get':
            $api = new FoodPrintAPI($conn, $user_id);
            $api->getHabitStats($_GET['date'] ?? null);
            break;
        case 'journal_get':
            $api = new StoryWeaverAPI($conn, $user_id);
            $api->getJournalEntries($_GET['limit'] ?? 20, $_GET['offset'] ?? 0);
            break;
        case 'timeline_get':
            $api = new StoryWeaverAPI($conn, $user_id);
            $api->getTimeline();
            break;
        case 'goals_get':
            $api = new TimeCapsuleAPI($conn, $user_id);
            $api->getGoals();
            break;
        case 'vision_board_get':
            $api = new TimeCapsuleAPI($conn, $user_id);
            $api->getVisionBoard();
            break;
        default:
            echo json_encode(['error' => 'Unknown action']);
    }
}
?>
