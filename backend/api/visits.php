<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT count FROM visits WHERE id = 1');
        $visit = $stmt->fetch();

        if (!$visit) {
            $pdo->exec('INSERT INTO visits (id, count) VALUES (1, 0)');
            echo json_encode(['count' => 0]);
        } else {
            echo json_encode(['count' => (int)$visit['count']]);
        }
        break;

    case 'POST':
        $pdo->exec('UPDATE visits SET count = count + 1 WHERE id = 1');

        $stmt = $pdo->query('SELECT count FROM visits WHERE id = 1');
        $visit = $stmt->fetch();

        echo json_encode(['success' => true, 'count' => (int)$visit['count']]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
