<?php
// Assessments API for LifePrint
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/db.php';

// Handle preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();

class Assessments {
    private $conn;
    private $table_name = "persona_assessments";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createAssessment($userId, $data) {
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO " . $this->table_name . " 
                (user_id, assessment_type, responses, scores, results, personality_type, 
                 strengths, areas_for_growth, recommendations, completed_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
            );
            $stmt->execute([
                $userId,
                "comprehensive_personality",
                json_encode($data["responses"] ?? []),
                json_encode($data["scores"] ?? []),
                json_encode($data),
                $data["personality_type"] ?? "",
                json_encode($data["strengths"] ?? []),
                json_encode($data["areas_for_growth"] ?? []),
                json_encode($data["recommendations"] ?? [])
            ]);
            $assessmentId = $this->conn->lastInsertId();
            return [
                "error" => false,
                "id" => $assessmentId,
                "message" => "Assessment saved successfully",
                "data" => $data
            ];
        } catch (Exception $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    public function getAssessments($userId) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT * FROM " . $this->table_name . " 
                 WHERE user_id = ? 
                 ORDER BY completed_at DESC"
            );
            $stmt->execute([$userId]);
            $assessments = $stmt->fetchAll();
            foreach ($assessments as &$assessment) {
                $assessment["responses"] = json_decode($assessment["responses"] ?? "[]", true);
                $assessment["scores"] = json_decode($assessment["scores"] ?? "[]", true);
                $assessment["results"] = json_decode($assessment["results"] ?? "{}", true);
                $assessment["strengths"] = json_decode($assessment["strengths"] ?? "[]", true);
                $assessment["areas_for_growth"] = json_decode($assessment["areas_for_growth"] ?? "[]", true);
                $assessment["recommendations"] = json_decode($assessment["recommendations"] ?? "[]", true);
            }
            return ["error" => false, "data" => $assessments];
        } catch (Exception $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }
}

// ...existing code...
$assessmentsObj = new Assessments($db);
$method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"), true);
$token = isset($_SERVER["HTTP_AUTHORIZATION"]) ? $_SERVER["HTTP_AUTHORIZATION"] : "";

function getUserIdFromToken($token) {
    if (empty($token)) return null;
    try {
        $token = str_replace("Bearer ", "", $token);
        $parts = explode(".", $token);
        if (count($parts) !== 3) return null;
        $payload = json_decode(base64_decode($parts[1]), true);
        if (isset($payload["exp"]) && $payload["exp"] < time()) return null;
        return $payload["userId"] ?? null;
    } catch (Exception $e) {
        return null;
    }
}

$userId = getUserIdFromToken($token);

if (!$userId) {
    echo json_encode(["error" => true, "message" => "Unauthorized"]);
    exit();
}

if ($method === "POST") {
    $result = $assessmentsObj->createAssessment($userId, $data);
    echo json_encode($result);
} elseif ($method === "GET") {
    $result = $assessmentsObj->getAssessments($userId);
    echo json_encode($result);
}
?>