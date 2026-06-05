<?php
session_start();
header('Content-Type: application/json');

function isAuthenticated() {
    $env_file = __DIR__ . '/../.env';
    if (!file_exists($env_file)) return false;
    preg_match('/ADMIN_TOKEN=(.+)/', file_get_contents($env_file), $m);
    $admin_token = isset($m[1]) ? trim($m[1]) : null;
    if (!$admin_token) return false;
    $provided = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? ($_SESSION['admin_token'] ?? null);
    if ($provided === $admin_token) { $_SESSION['admin_token'] = $provided; return true; }
    return false;
}

if (!isAuthenticated()) {
    http_response_code(401);
    die(json_encode(['success' => false, 'error' => 'Unauthorized']));
}

$category = $_POST['category'] ?? null;
$pet_id   = $_POST['pet_id']   ?? null;

if (!$category || !$pet_id) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'category and pet_id are required']));
}

$pet_folder = __DIR__ . "/../adoptions/pets/{$category}/{$pet_id}";
if (!is_dir($pet_folder)) {
    http_response_code(404);
    die(json_encode(['success' => false, 'error' => 'Pet not found']));
}

function deleteFolder($folder) {
    foreach (scandir($folder) as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $folder . '/' . $item;
        is_dir($path) ? deleteFolder($path) : unlink($path);
    }
    rmdir($folder);
}

deleteFolder($pet_folder);

function updateCategoryIndex($category) {
    $category_folder = __DIR__ . "/../adoptions/pets/{$category}";
    $pets = [];
    if (!is_dir($category_folder)) { file_put_contents($category_folder . '/../' . $category . '-placeholder', ''); return; }
    foreach (scandir($category_folder) as $folder) {
        if ($folder === '.' || $folder === '..') continue;
        $pet_file = $category_folder . '/' . $folder . '/pet.json';
        if (file_exists($pet_file)) {
            $pets[] = json_decode(file_get_contents($pet_file), true);
        }
    }
    file_put_contents($category_folder . '/index.json', json_encode(['pets' => $pets], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

updateCategoryIndex($category);
echo json_encode(['success' => true, 'message' => 'Pet deleted successfully']);
?>
