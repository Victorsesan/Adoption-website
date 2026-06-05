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

$code     = $_GET['code'] ?? null;
$apps_base = __DIR__ . '/../adoptions/applications';

// Return single application
if ($code) {
    $app_file = $apps_base . "/{$code}/application.json";
    if (!file_exists($app_file)) {
        http_response_code(404);
        die(json_encode(['success' => false, 'error' => 'Application not found']));
    }
    $application = json_decode(file_get_contents($app_file), true);
    echo json_encode(['success' => true, 'application' => $application]);
    exit;
}

// Return all applications
$applications = [];
if (is_dir($apps_base)) {
    foreach (scandir($apps_base) as $dir) {
        if ($dir === '.' || $dir === '..') continue;
        $app_file = $apps_base . '/' . $dir . '/application.json';
        if (!file_exists($app_file)) continue;
        $app = json_decode(file_get_contents($app_file), true);
        // Build summary record
        $applications[] = [
            'adoption_code'   => $app['adoption_code'] ?? $dir,
            'applicant_name'  => $app['applicant_name'] ?? ($app['name'] ?? 'Unknown'),
            'applicant_email' => $app['applicant_email'] ?? ($app['user_email'] ?? ''),
            'applicant_phone' => $app['applicant_phone'] ?? ($app['phone'] ?? ''),
            'pet_id'          => $app['pet_id'] ?? '',
            'pet_name'        => $app['pet_name'] ?? '',
            'pet_category'    => $app['pet_category'] ?? '',
            'status'          => $app['status'] ?? 'PENDING',
            'applied_at'      => $app['applied_at'] ?? ($app['submission_date'] ?? ''),
            'checkout_url'    => $app['checkout_url'] ?? null,
            'rejection_notes' => $app['rejection_notes'] ?? null,
            'address'         => $app['address'] ?? '',
            'apartment'       => $app['apt'] ?? '',
            'city'            => $app['city'] ?? '',
            'state'           => $app['state'] ?? '',
            'zip'             => $app['zip'] ?? '',
            'employment_status' => $app['employment_status'] ?? '',
            'residence_type'    => $app['residence_type'] ?? '',
            'landlord_allows'   => $app['landlord_allows'] ?? '',
            'have_vet'          => $app['have_vet'] ?? '',
            'vet_name'          => $app['vet_name'] ?? '',
            'can_afford'        => $app['can_afford'] ?? '',
            'inside_plan'       => $app['inside_plan'] ?? '',
            'additional_info'   => $app['additional_info'] ?? '',
        ];
    }
}

// Sort by date descending
usort($applications, function($a, $b) {
    return strcmp($b['applied_at'] ?? '', $a['applied_at'] ?? '');
});

echo json_encode(['success' => true, 'applications' => $applications]);
?>
