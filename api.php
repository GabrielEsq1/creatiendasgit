<?php
require_once 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure stores directory exists
$storesDir = __DIR__ . '/stores';
if (!file_exists($storesDir)) {
    mkdir($storesDir, 0777, true);
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? $input['action'] ?? '';

// Helper to get user ID (In a real app, use session/token)
$userId = $_GET['user_id'] ?? $input['user_id'] ?? 0;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

if ($action === 'list_stores') {
    $stmt = $pdo->prepare("SELECT id, name, slug, created_at FROM stores WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    $stores = $stmt->fetchAll();
    
    // Add URL to each store
    foreach ($stores as &$store) {
        $store['url'] = 'stores/' . $store['slug'] . '.html';
    }
    
    echo json_encode(['success' => true, 'stores' => $stores]);

} elseif ($action === 'create_store') {
    $name = $input['name'] ?? '';
    if (!$name) {
        echo json_encode(['success' => false, 'message' => 'Nombre requerido']);
        exit;
    }

    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    // Ensure unique slug
    $stmt = $pdo->prepare("SELECT id FROM stores WHERE slug = ?");
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
        $slug .= '-' . time();
    }

    // Initial Data
    $initialData = json_encode([
        'products' => [],
        'categories' => [],
        'meta' => ['name' => $name, 'color' => '#2563eb', 'whatsapp' => '']
    ]);

    try {
        $stmt = $pdo->prepare("INSERT INTO stores (user_id, name, slug, data) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $name, $slug, $initialData]);
        
        // Create empty HTML file
        file_put_contents("$storesDir/$slug.html", "<h1>Tienda: $name</h1><p>En construcción...</p>");

        echo json_encode(['success' => true, 'store' => [
            'id' => $pdo->lastInsertId(),
            'name' => $name,
            'slug' => $slug
        ]]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al crear tienda']);
    }

} elseif ($action === 'get_store') {
    $storeId = $_GET['store_id'] ?? 0;
    $stmt = $pdo->prepare("SELECT * FROM stores WHERE id = ? AND user_id = ?");
    $stmt->execute([$storeId, $userId]);
    $store = $stmt->fetch();

    if ($store) {
        $store['data'] = json_decode($store['data']);
        echo json_encode(['success' => true, 'store' => $store]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Tienda no encontrada']);
    }

} elseif ($action === 'save_store') {
    $storeId = $input['store_id'] ?? 0;
    $data = $input['data'] ?? null; // JSON state
    $html = $input['html'] ?? '';   // Full HTML content

    if (!$storeId || !$data) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }

    // Verify ownership
    $stmt = $pdo->prepare("SELECT slug FROM stores WHERE id = ? AND user_id = ?");
    $stmt->execute([$storeId, $userId]);
    $store = $stmt->fetch();

    if (!$store) {
        echo json_encode(['success' => false, 'message' => 'Tienda no encontrada']);
        exit;
    }

    // Update DB
    $stmt = $pdo->prepare("UPDATE stores SET data = ? WHERE id = ?");
    $stmt->execute([json_encode($data), $storeId]);

    // Update File
    if ($html) {
        file_put_contents("$storesDir/{$store['slug']}.html", $html);
    }

    echo json_encode(['success' => true, 'message' => 'Guardado exitosamente']);

} elseif ($action === 'delete_store') {
    $storeId = $input['store_id'] ?? 0;
    
    $stmt = $pdo->prepare("SELECT slug FROM stores WHERE id = ? AND user_id = ?");
    $stmt->execute([$storeId, $userId]);
    $store = $stmt->fetch();

    if ($store) {
        // Delete from DB
        $pdo->prepare("DELETE FROM stores WHERE id = ?")->execute([$storeId]);
        
        // Delete File
        $file = "$storesDir/{$store['slug']}.html";
        if (file_exists($file)) {
            unlink($file);
        }
        
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Tienda no encontrada']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}
?>
