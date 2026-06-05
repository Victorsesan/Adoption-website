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
$name              = $_POST['name']              ?? null;
$breed             = $_POST['breed']             ?? null;
$age               = floatval($_POST['age_years'] ?? $_POST['age'] ?? 0);
$size              = $_POST['size']              ?? null;
$fee               = floatval($_POST['adoption_fee'] ?? $_POST['fee'] ?? 0);
$species           = $_POST['species']           ?? null;
$description_short = $_POST['description_short'] ?? $_POST['description'] ?? null;
$description_full  = $_POST['description_full']  ?? null;
$health_info       = $_POST['health_info']       ?? null;

if (!$category || !$name || !$breed) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Missing required fields: category, name, breed']));
}

function generatePetId($prefix, $category) {
    $index_file = __DIR__ . "/../adoptions/pets/{$category}/index.json";
    $count = 1;
    if (file_exists($index_file)) {
        $data = json_decode(file_get_contents($index_file), true);
        $count = count($data['pets'] ?? []) + 1;
    }
    return $prefix . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
}

function updateCategoryIndex($category) {
    $category_folder = __DIR__ . "/../adoptions/pets/{$category}";
    $pets = [];
    if (!is_dir($category_folder)) return;
    foreach (scandir($category_folder) as $folder) {
        if ($folder === '.' || $folder === '..') continue;
        $pet_file = $category_folder . '/' . $folder . '/pet.json';
        if (file_exists($pet_file)) {
            $pets[] = json_decode(file_get_contents($pet_file), true);
        }
    }
    file_put_contents($category_folder . '/index.json', json_encode(['pets' => $pets], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$prefix_map = ['dogs' => 'DOG', 'cats' => 'CAT', 'birds' => 'BIRD', 'reptiles' => 'REPTILE', 'small-mammals' => 'MAM'];
$id_prefix  = $prefix_map[$category] ?? strtoupper(substr($category, 0, 3));
$pet_id     = generatePetId($id_prefix, $category);

$pets_base  = __DIR__ . '/../adoptions/pets';
$pet_folder = $pets_base . "/{$category}/{$pet_id}";
if (!is_dir($pet_folder)) mkdir($pet_folder, 0755, true);

$bulk_folder = $pet_folder . '/bulk_images';
if (!is_dir($bulk_folder)) mkdir($bulk_folder, 0755, true);

$single_image = '';
if (isset($_FILES['single_image']) && $_FILES['single_image']['error'] === UPLOAD_ERR_OK) {
    $ext = strtolower(pathinfo($_FILES['single_image']['name'], PATHINFO_EXTENSION));
    $single_image = 'single_image.' . ($ext ?: 'jpg');
    move_uploaded_file($_FILES['single_image']['tmp_name'], $pet_folder . '/' . $single_image);
}

$bulk_images = [];
if (isset($_FILES['bulk_images']['name'])) {
    for ($i = 0; $i < count($_FILES['bulk_images']['name']); $i++) {
        if ($_FILES['bulk_images']['error'][$i] === UPLOAD_ERR_OK) {
            $ext = strtolower(pathinfo($_FILES['bulk_images']['name'][$i], PATHINFO_EXTENSION));
            $filename = 'image' . ($i + 1) . '.' . ($ext ?: 'jpg');
            move_uploaded_file($_FILES['bulk_images']['tmp_name'][$i], $bulk_folder . '/' . $filename);
            $bulk_images[] = $filename;
        }
    }
}

$pet_data = [
    'pet_id'            => $pet_id,
    'id'                => $pet_id,
    'name'              => $name,
    'category'          => $category,
    'species'           => $species ?? ucfirst(rtrim($category, 's')),
    'breed'             => $breed,
    'age_years'         => $age,
    'size'              => $size,
    'adoption_fee'      => $fee,
    'description_short' => $description_short,
    'description_full'  => $description_full,
    'health_info'       => $health_info,
    'status'            => 'Available',
    'single_image'      => $single_image,
    'single_image_url'  => $single_image ? "/adoptions/pets/{$category}/{$pet_id}/{$single_image}" : '',
    'bulk_images'       => $bulk_images,
    'published_date'    => date('Y-m-d')
];

file_put_contents($pet_folder . '/pet.json', json_encode($pet_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
updateCategoryIndex($category);

echo json_encode(['success' => true, 'pet_id' => $pet_id, 'pet' => $pet_data, 'message' => 'Pet published successfully']);
?>
