<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$env_file = __DIR__ . '/../.env';
if (!file_exists($env_file)) {
    http_response_code(500);
    die(json_encode(['success' => false, 'error' => '.env file not found']));
}

preg_match('/ADMIN_TOKEN=(.+)/', file_get_contents($env_file), $matches);
$admin_token = isset($matches[1]) ? trim($matches[1]) : null;

if (!$admin_token) {
    http_response_code(500);
    die(json_encode(['success' => false, 'error' => 'ADMIN_TOKEN not configured']));
}

$action = $_GET['action'] ?? $_POST['action'] ?? 'login';

if ($action === 'verify') {
    $provided = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? ($_SESSION['admin_token'] ?? null);
    if ($provided && $provided === $admin_token) {
        echo json_encode(['success' => true, 'message' => 'Token valid']);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid token']);
    }
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out']);
    exit;
}

// Login (default action)
$provided_token = $_POST['token'] ?? null;
if (!$provided_token) {
    $body = json_decode(file_get_contents('php://input'), true);
    $provided_token = $body['token'] ?? null;
}

if ($provided_token && $provided_token === $admin_token) {
    $_SESSION['admin_token'] = $provided_token;
    echo json_encode(['success' => true, 'message' => 'Authenticated']);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid token']);
}
?>
