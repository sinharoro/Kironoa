<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT * FROM messages ORDER BY created_at DESC');
        $messages = $stmt->fetchAll();
        echo json_encode($messages);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['nickname']) || !isset($input['message'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nickname and message are required']);
            exit();
        }

        $nickname = trim($input['nickname']);
        $message = trim($input['message']);

        if (empty($nickname) || empty($message)) {
            http_response_code(400);
            echo json_encode(['error' => 'Nickname and message cannot be empty']);
            exit();
        }

        $stmt = $pdo->prepare('INSERT INTO messages (nickname, message) VALUES (:nickname, :message)');
        $stmt->execute(['nickname' => $nickname, 'message' => $message]);

        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required']);
            exit();
        }

        if (!isset($input['passcode']) || $input['passcode'] !== '1234') {
            http_response_code(403);
            echo json_encode(['error' => 'Invalid passcode']);
            exit();
        }

        $stmt = $pdo->prepare('DELETE FROM messages WHERE id = :id');
        $stmt->execute(['id' => $input['id']]);

        echo json_encode(['success' => true, 'message' => 'Message deleted successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
