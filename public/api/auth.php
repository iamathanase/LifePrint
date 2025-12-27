<?php
// Authentication API for LifePrint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/db.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Auth {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    // User signup
    public function signup($email, $password, $fullName) {
        try {
            // Check if user exists
            $stmt = $this->conn->prepare("SELECT id FROM " . $this->table_name . " WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                return ['error' => true, 'message' => 'Email already exists'];
            }

            // Create user
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $this->conn->prepare(
                "INSERT INTO " . $this->table_name . " (email, password_hash, created_at) VALUES (?, ?, NOW())"
            );
            $stmt->execute([$email, $passwordHash]);
            $userId = $this->conn->lastInsertId();
            
            // Create profile
            if ($fullName) {
                $stmt = $this->conn->prepare(
                    "INSERT INTO profiles (user_id, full_name, created_at) VALUES (?, ?, NOW())"
                );
                $stmt->execute([$userId, $fullName]);
            }
            
            // Generate token
            $token = $this->generateToken($userId, $email);

            return [
                'error' => false,
                'token' => $token,
                'user' => ['id' => $userId, 'email' => $email, 'full_name' => $fullName],
                'message' => 'Signup successful'
            ];
        } catch (Exception $e) {
            return ['error' => true, 'message' => $e->getMessage()];
        }
    }

    // User login
    public function login($email, $password) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT u.*, p.full_name 
                 FROM " . $this->table_name . " u 
                 LEFT JOIN profiles p ON u.id = p.user_id 
                 WHERE u.email = ? AND u.is_active = 1"
            );
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                // Update last login
                $stmt = $this->conn->prepare(
                    "UPDATE " . $this->table_name . " SET last_login = NOW() WHERE id = ?"
                );
                $stmt->execute([$user['id']]);
                
                $token = $this->generateToken($user['id'], $user['email']);

                return [
                    'error' => false,
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'], 
                        'email' => $user['email'], 
                        'full_name' => $user['full_name'] ?? ''
                    ],
                    'message' => 'Login successful'
                ];
            }

            return ['error' => true, 'message' => 'Invalid credentials'];
        } catch (Exception $e) {
            return ['error' => true, 'message' => $e->getMessage()];
        }
    }

    // Google OAuth signup/login
    public function googleOAuth($email, $fullName, $googleId, $picture = null) {
        try {
            // Check if user exists
            $stmt = $this->conn->prepare("SELECT id FROM " . $this->table_name . " WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user) {
                // User exists, just update last login
                $userId = $user['id'];
                $stmt = $this->conn->prepare(
                    "UPDATE " . $this->table_name . " SET last_login = NOW() WHERE id = ?"
                );
                $stmt->execute([$userId]);
            } else {
                // Create new user
                $stmt = $this->conn->prepare(
                    "INSERT INTO " . $this->table_name . " (email, google_id, created_at) VALUES (?, ?, NOW())"
                );
                $stmt->execute([$email, $googleId]);
                $userId = $this->conn->lastInsertId();
            }
            
            // Create or update profile
            $stmt = $this->conn->prepare("SELECT id FROM profiles WHERE user_id = ?");
            $stmt->execute([$userId]);
            if ($stmt->fetch()) {
                // Update existing profile
                $stmt = $this->conn->prepare(
                    "UPDATE profiles SET full_name = ?, avatar_url = ?, updated_at = NOW() WHERE user_id = ?"
                );
                $stmt->execute([$fullName, $picture, $userId]);
            } else {
                // Create new profile
                $stmt = $this->conn->prepare(
                    "INSERT INTO profiles (user_id, full_name, avatar_url, created_at) VALUES (?, ?, ?, NOW())"
                );
                $stmt->execute([$userId, $fullName, $picture]);
            }
            
            // Get user full name
            $stmt = $this->conn->prepare("SELECT full_name FROM profiles WHERE user_id = ?");
            $stmt->execute([$userId]);
            $profile = $stmt->fetch();
            $userFullName = $profile['full_name'] ?? $fullName;
            
            // Generate token
            $token = $this->generateToken($userId, $email);

            return [
                'error' => false,
                'token' => $token,
                'user' => [
                    'id' => $userId,
                    'email' => $email,
                    'full_name' => $userFullName,
                    'picture' => $picture
                ],
                'message' => 'Google login successful'
            ];
        } catch (Exception $e) {
            return ['error' => true, 'message' => $e->getMessage()];
        }
    }

    // Get current user
    public function getCurrentUser($token) {
        try {
            $decoded = $this->verifyToken($token);
            if (!$decoded) {
                return ['error' => true, 'message' => 'Invalid token'];
            }

            $stmt = $this->conn->prepare(
                "SELECT u.*, p.full_name, p.avatar_url, p.bio 
                 FROM " . $this->table_name . " u 
                 LEFT JOIN profiles p ON u.id = p.user_id 
                 WHERE u.email = ? AND u.is_active = 1"
            );
            $stmt->execute([$decoded['email']]);
            $user = $stmt->fetch();
            
            if ($user) {
                return [
                    'error' => false,
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'full_name' => $user['full_name'] ?? ''
                    ],
                    'profile' => [
                        'avatar_url' => $user['avatar_url'],
                        'bio' => $user['bio']
                    ]
                ];
            }

            return ['error' => true, 'message' => 'User not found'];
        } catch (Exception $e) {
            return ['error' => true, 'message' => $e->getMessage()];
        }
    }

    // Generate JWT-like token (simplified)
    private function generateToken($userId, $email) {
        $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = base64_encode(json_encode([
            'userId' => $userId,
            'email' => $email,
            'iat' => time(),
            'exp' => time() + (7 * 24 * 60 * 60) // 7 days
        ]));
        $signature = hash_hmac('sha256', "$header.$payload", 'lifeprint_secret_key', true);
        $signature = base64_encode($signature);
        
        return "$header.$payload.$signature";
    }

    // Verify token
    private function verifyToken($token) {
        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) return false;
            
            $payload = json_decode(base64_decode($parts[1]), true);
            if ($payload['exp'] < time()) return false;
            
            return $payload;
        } catch (Exception $e) {
            return false;
        }
    }

    // Generate UUID
    private function generateUUID() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}

// Handle requests
$database = new Database();
$db = $database->getConnection();

// Check if database connection failed
if ($db === null) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Database connection failed. Please try again later.'
    ]);
    return;
}

$auth = new Auth($db);

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// Parse the request URI to get the action
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Extract action from path (e.g., /api/auth/login -> login)
$pathParts = explode('/', trim($path, '/'));
$action = end($pathParts); // Get last part of path

// Also support query parameter for backward compatibility
if (isset($_GET['action'])) {
    $action = $_GET['action'];
}

if ($method === 'POST') {
    switch ($action) {
        case 'signup':
        case 'register':
            $result = $auth->signup(
                $data['email'] ?? $data['username'] ?? '',
                $data['password'] ?? '',
                $data['fullName'] ?? $data['full_name'] ?? ''
            );
            echo json_encode($result);
            break;

        case 'login':
            $result = $auth->login(
                $data['email'] ?? '',
                $data['password'] ?? ''
            );
            echo json_encode($result);
            break;

        case 'google':
        case 'google-oauth':
            $result = $auth->googleOAuth(
                $data['email'] ?? '',
                $data['full_name'] ?? $data['fullName'] ?? '',
                $data['google_id'] ?? $data['googleId'] ?? '',
                $data['picture'] ?? null
            );
            echo json_encode($result);
            break;

        case 'logout':
            echo json_encode(['error' => false, 'message' => 'Logged out successfully']);
            break;

        default:
            echo json_encode(['error' => true, 'message' => 'Invalid action: ' . $action]);
    }
} elseif ($method === 'GET') {
    if ($action === 'me' || $action === 'auth.php') {
        $token = isset($_SERVER['HTTP_AUTHORIZATION']) ? 
                 str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']) : '';
        
        $result = $auth->getCurrentUser($token);
        echo json_encode($result);
    } else {
        echo json_encode(['error' => true, 'message' => 'Invalid endpoint']);
    }
}
?>
