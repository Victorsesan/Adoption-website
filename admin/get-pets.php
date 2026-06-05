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

$category = $_GET['category'] ?? null;
$pet_id   = $_GET['pet_id']   ?? null;

if (!$category) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'category is required']));
}

$pets_base = __DIR__ . '/../adoptions/pets';

// Return single pet
if ($pet_id) {
    $pet_file = $pets_base . "/{$category}/{$pet_id}/pet.json";
    if (!file_exists($pet_file)) {
        http_response_code(404);
        die(json_encode(['success' => false, 'error' => 'Pet not found']));
    }
    $pet = json_decode(file_get_contents($pet_file), true);
    // Ensure single_image_url is set
    if (!isset($pet['single_image_url']) && isset($pet['single_image']) && $pet['single_image']) {
        $pet['single_image_url'] = "/adoptions/pets/{$category}/{$pet_id}/" . $pet['single_image'];
    }
    echo json_encode(['success' => true, 'pet' => $pet]);
    exit;
}

// Return list of pets for category
$category_folder = $pets_base . "/{$category}";
$index_file = $category_folder . '/index.json';

if (file_exists($index_file)) {
    $data = json_decode(file_get_contents($index_file), true);
    $pets = $data['pets'] ?? [];
} else {
    $pets = [];
    if (is_dir($category_folder)) {
        foreach (scandir($category_folder) as $folder) {
            if ($folder === '.' || $folder === '..') continue;
            $pet_file = $category_folder . '/' . $folder . '/pet.json';
            if (file_exists($pet_file)) {
                $pets[] = json_decode(file_get_contents($pet_file), true);
            }
        }
    }
}

// Ensure all pets have pet_id and single_image_url
foreach ($pets as &$pet) {
    if (!isset($pet['pet_id']) && isset($pet['id'])) $pet['pet_id'] = $pet['id'];
    $pid = $pet['pet_id'] ?? $pet['id'] ?? '';
    if (!isset($pet['single_image_url']) && isset($pet['single_image']) && $pet['single_image'] && $pid) {
        $pet['single_image_url'] = "/adoptions/pets/{$category}/{$pid}/" . $pet['single_image'];
    }
}

echo json_encode(['success' => true, 'pets' => $pets]);
?>
