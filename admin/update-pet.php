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

$category          = $_POST['category']          ?? null;
$pet_id            = $_POST['pet_id']            ?? null;
$name              = $_POST['name']              ?? null;
$breed             = $_POST['breed']             ?? null;
$age               = isset($_POST['age_years'])  ? floatval($_POST['age_years']) : (isset($_POST['age']) ? floatval($_POST['age']) : null);
$size              = $_POST['size']              ?? null;
$fee               = isset($_POST['adoption_fee']) ? floatval($_POST['adoption_fee']) : (isset($_POST['fee']) ? floatval($_POST['fee']) : null);
$status            = $_POST['status']            ?? null;
$description_short = $_POST['description_short'] ?? $_POST['description'] ?? null;
$description_full  = $_POST['description_full']  ?? null;
$health_info       = $_POST['health_info']       ?? null;

if (!$category || !$pet_id) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'category and pet_id are required']));
}

$pet_folder = __DIR__ . "/../adoptions/pets/{$category}/{$pet_id}";
if (!is_dir($pet_folder)) {
    http_response_code(404);
    die(json_encode(['success' => false, 'error' => 'Pet not found']));
}

$pet_data = json_decode(file_get_contents($pet_folder . '/pet.json'), true);

if ($name)              $pet_data['name']              = $name;
if ($breed)             $pet_data['breed']             = $breed;
if ($age !== null)      $pet_data['age_years']         = $age;
if ($size)              $pet_data['size']              = $size;
if ($fee !== null)      $pet_data['adoption_fee']      = $fee;
if ($status)            $pet_data['status']            = $status;
if ($description_short) $pet_data['description_short'] = $description_short;
if ($description_full)  $pet_data['description_full']  = $description_full;
if ($health_info)       $pet_data['health_info']       = $health_info;

if (isset($_FILES['single_image']) && $_FILES['single_image']['error'] === UPLOAD_ERR_OK) {
    $ext = strtolower(pathinfo($_FILES['single_image']['name'], PATHINFO_EXTENSION));
    $single_image = 'single_image.' . ($ext ?: 'jpg');
    @unlink($pet_folder . '/' . ($pet_data['single_image'] ?? ''));
    move_uploaded_file($_FILES['single_image']['tmp_name'], $pet_folder . '/' . $single_image);
    $pet_data['single_image'] = $single_image;
    $pet_data['single_image_url'] = "/adoptions/pets/{$category}/{$pet_id}/{$single_image}";
}

if (isset($_FILES['bulk_images']['name'])) {
    $bulk_folder = $pet_folder . '/bulk_images';
    if (!is_dir($bulk_folder)) mkdir($bulk_folder, 0755, true);
    $bulk_images = $pet_data['bulk_images'] ?? [];
    for ($i = 0; $i < count($_FILES['bulk_images']['name']); $i++) {
        if ($_FILES['bulk_images']['error'][$i] === UPLOAD_ERR_OK) {
            $ext = strtolower(pathinfo($_FILES['bulk_images']['name'][$i], PATHINFO_EXTENSION));
            $filename = 'image' . (count($bulk_images) + $i + 1) . '.' . ($ext ?: 'jpg');
            move_uploaded_file($_FILES['bulk_images']['tmp_name'][$i], $bulk_folder . '/' . $filename);
            $bulk_images[] = $filename;
        }
    }
    $pet_data['bulk_images'] = $bulk_images;
}

$pet_data['updated_date'] = date('Y-m-d');
file_put_contents($pet_folder . '/pet.json', json_encode($pet_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

function updateCategoryIndex($category) {
    $category_folder = __DIR__ . "/../adoptions/pets/{$category}";
    $pets = [];
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
echo json_encode(['success' => true, 'message' => 'Pet updated successfully']);
?>
