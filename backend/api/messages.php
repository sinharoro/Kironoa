<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT id, nickname, message, created_at FROM messages ORDER BY created_at DESC');
        $messages = $stmt->fetchAll();
        echo json_encode($messages);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['nickname']) || !isset($input['message']) || !isset($input['passcode'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nickname, message, and passcode are required']);
            exit();
        }

        $nickname = trim($input['nickname']);
        $message = trim($input['message']);
        $passcode = $input['passcode'];

        if (empty($nickname) || empty($message) || empty($passcode)) {
            http_response_code(400);
            echo json_encode(['error' => 'Fields cannot be empty']);
            exit();
        }

        $passcodeHash = password_hash($passcode, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare('INSERT INTO messages (nickname, message, passcode_hash) VALUES (:nickname, :message, :passcode_hash)');
        $stmt->execute(['nickname' => $nickname, 'message' => $message, 'passcode_hash' => $passcodeHash]);

        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id']) || !isset($input['passcode'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID and passcode are required']);
            exit();
        }

        $stmt = $pdo->prepare('SELECT passcode_hash FROM messages WHERE id = :id');
        $stmt->execute(['id' => $input['id']]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Message not found']);
            exit();
        }

        if (!password_verify($input['passcode'], $row['passcode_hash'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Invalid passcode']);
            exit();
        }

        $nickname = trim($input['nickname'] ?? '');
        $message = trim($input['message'] ?? '');

        if (empty($nickname) || empty($message)) {
            http_response_code(400);
            echo json_encode(['error' => 'Nickname and message cannot be empty']);
            exit();
        }

        $stmt = $pdo->prepare('UPDATE messages SET nickname = :nickname, message = :message WHERE id = :id');
        $stmt->execute(['nickname' => $nickname, 'message' => $message, 'id' => $input['id']]);

        echo json_encode(['success' => true, 'message' => 'Message updated successfully']);
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required']);
            exit();
        }

        if (!isset($input['passcode'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Passcode is required']);
            exit();
        }

        $stmt = $pdo->prepare('SELECT passcode_hash FROM messages WHERE id = :id');
        $stmt->execute(['id' => $input['id']]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Message not found']);
            exit();
        }

        if (!password_verify($input['passcode'], $row['passcode_hash'])) {
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
