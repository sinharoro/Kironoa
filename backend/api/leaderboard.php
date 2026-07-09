<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT name, score FROM leaderboard ORDER BY score DESC LIMIT 5');
        $scores = $stmt->fetchAll();
        echo json_encode($scores);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['name']) || !isset($input['score'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and score are required']);
            exit();
        }

        $name = trim($input['name']);
        $score = (int)$input['score'];

        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name cannot be empty']);
            exit();
        }

        $stmt = $pdo->prepare('INSERT INTO leaderboard (name, score) VALUES (:name, :score)');
        $stmt->execute(['name' => $name, 'score' => $score]);

        http_response_code(201);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
