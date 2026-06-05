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
    if ($provided === $admin_token) {
        $_SESSION['admin_token'] = $provided;
        return true;
    }
    return false;
}

if (!isAuthenticated()) {
    http_response_code(401);
    die(json_encode(['success' => false, 'error' => 'Unauthorized']));
}

$categories = ['dogs', 'cats', 'birds', 'reptiles', 'small-mammals'];
$pets_base  = __DIR__ . '/../adoptions/pets';
$apps_base  = __DIR__ . '/../adoptions/applications';

$total_available = 0;
$total_adopted   = 0;

foreach ($categories as $cat) {
    $index = $pets_base . '/' . $cat . '/index.json';
    if (!file_exists($index)) continue;
    $data = json_decode(file_get_contents($index), true);
    foreach ($data['pets'] ?? [] as $pet) {
        if (($pet['status'] ?? '') === 'Available') $total_available++;
        if (($pet['status'] ?? '') === 'Adopted')   $total_adopted++;
    }
}

$pending_count  = 0;
$approved_count = 0;
$rejected_count = 0;
$adopted_month  = 0;

if (is_dir($apps_base)) {
    foreach (scandir($apps_base) as $dir) {
        if ($dir === '.' || $dir === '..') continue;
        $app_file = $apps_base . '/' . $dir . '/application.json';
        if (!file_exists($app_file)) continue;
        $app = json_decode(file_get_contents($app_file), true);
        $status = $app['status'] ?? 'PENDING';
        if ($status === 'PENDING')   $pending_count++;
        if ($status === 'APPROVED')  $approved_count++;
        if ($status === 'REJECTED')  $rejected_count++;
        if ($status === 'APPROVED' && isset($app['updated_date'])) {
            if (date('Y-m', strtotime($app['updated_date'])) === date('Y-m')) {
                $adopted_month++;
            }
        }
    }
}

echo json_encode([
    'success' => true,
    'stats'   => [
        'total_available'      => $total_available,
        'total_adopted'        => $total_adopted,
        'pending_applications' => $pending_count,
        'approved_applications'=> $approved_count,
        'rejected_applications'=> $rejected_count,
        'adopted_this_month'   => $adopted_month,
    ]
]);
?>
