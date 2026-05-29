# Kironoa Portfolio — Backend Documentation

## Overview

The backend for the Kironoa portfolio is a **lightweight PHP REST API** with a **MySQL database**, served locally via **XAMPP** and exposed to the internet through an **ngrok tunnel**. It provides two simple services: a guestbook message board and a visit counter.

---

## Architecture

```
Frontend (Next.js on Vercel)
       │
       │  HTTP (fetch) via ngrok tunnel
       ▼
ngrok (seclusion-applicant-smartly.ngrok-free.dev)
       │
       ▼
XAMPP Apache / PHP built-in server (localhost)
       │
       ▼
PHP API (backend/)
       │
       ▼
MySQL Database (C:\xampp\mysql\data\kironoa\)
```

- **API Base URL (prod):** `https://seclusion-applicant-smartly.ngrok-free.dev/api`
- **API Base URL (local):** `http://localhost/kironoa-api/api` or `http://localhost:8000/api`
- Defined in `app/page.tsx:7`: `const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'`

---

## File Structure

```
backend/
├── config/
│   └── database.php      # PDO connection + CORS headers
├── api/
│   ├── messages.php       # Guestbook CRUD
│   └── visits.php         # Visit counter
└── schema.sql             # Database/tables creation script
```

### File Locations on Disk

| Component | Path |
|---|---|
| PHP source | `C:\Personal\Roro\My projects\Kironoa\backend\` |
| MySQL data | `C:\xampp\mysql\data\kironoa\` |
| XAMPP root | `C:\xampp\` |

**Note:** The PHP files live inside the project's git repo, NOT inside `C:\xampp\htdocs\`. The API is served either via `php -S localhost:8000` or by pointing XAMPP Apache to the project directory.

---

## Database (`schema.sql`)

### Database: `kironoa`

### Table: `messages`

| Column     | Type         | Attributes                  |
|------------|--------------|-----------------------------|
| id         | INT          | AUTO_INCREMENT, PRIMARY KEY |
| nickname   | VARCHAR(100) | NOT NULL                    |
| message    | TEXT         | NOT NULL                    |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   |

### Table: `visits`

| Column | Type | Attributes                  |
|--------|------|-----------------------------|
| id     | INT  | AUTO_INCREMENT, PRIMARY KEY |
| count  | INT  | DEFAULT 0                   |

The `visits` table uses a single row with `id=1` to store the visit count. Initialized by:

```sql
INSERT INTO visits (id, count) VALUES (1, 0) ON DUPLICATE KEY UPDATE count = count;
```

### Storage Engine

Both tables use **InnoDB**, with physical files:
- `messages.frm` / `messages.ibd`
- `visits.frm` / `visits.ibd`

---

## Configuration (`config/database.php`)

### CORS Policy

| Aspect | Value |
|---|---|
| Allowed origins | `http://localhost:3000`, `https://kironoa.vercel.app`, any `*.ngrok-free.dev` |
| Allowed methods | GET, POST, DELETE, OPTIONS |
| Allowed headers | Content-Type, ngrok-skip-browser-warning |

The `ngrok-skip-browser-warning` header is a custom header used to bypass ngrok's browser warning page when making API calls from the frontend.

### Database Connection

- **Driver:** PDO (PHP Data Objects)
- **Host:** `localhost`
- **Database:** `kironoa`
- **Username:** `root`
- **Password:** (empty)
- **Charset:** `utf8mb4`
- **Error mode:** Exceptions (`PDO::ERRMODE_EXCEPTION`)
- **Fetch mode:** Associative arrays (`PDO::FETCH_ASSOC`)

On connection failure, returns HTTP 500 with a JSON error message.

---

## API Endpoints

### 1. Messages — `/api/messages.php`

#### GET /api/messages.php

Fetches all guestbook messages.

**Response (200):**
```json
[
  {
    "id": 1,
    "nickname": "Visitor",
    "message": "Great site!",
    "created_at": "2026-05-26 12:00:00"
  }
]
```
Ordered by `created_at DESC` (newest first).

---

#### POST /api/messages.php

Creates a new guestbook message.

**Request body (JSON):**
```json
{
  "nickname": "VisitorName",
  "message": "Hello world"
}
```

**Validation:**
- Both `nickname` and `message` are required
- Both fields are trimmed and checked for emptiness
- Maximum nickname length: 100 characters (VARCHAR)

**Success (201):**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Error (400 — missing/empty fields):**
```json
{
  "error": "Nickname and message are required"
}
```

---

#### DELETE /api/messages.php

Deletes a message. Requires a passcode for authorization.

**Request body (JSON):**
```json
{
  "id": 1,
  "passcode": "0712"
}
```

**Validation:**
- `id` is required
- `passcode` must equal `0712` (hardcoded)

**Success (200):**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Error (403 — wrong passcode):**
```json
{
  "error": "Invalid passcode"
}
```

**Note:** The passcode `0712` is hardcoded directly in the PHP source at `messages.php:47`. This is not a secure authentication mechanism — it acts as a simple shared secret for admin-level delete access.

---

### 2. Visits — `/api/visits.php`

#### GET /api/visits.php

Retrieves the current visit count.

**Response (200):**
```json
{
  "count": 42
}
```

If the `visits` table is empty (no row with id=1), it creates one with count 0.

---

#### POST /api/visits.php

Increments the visit counter by 1 and returns the new count.

**Response (200):**
```json
{
  "success": true,
  "count": 43
}
```

This endpoint is called once per page load from the frontend.

---

## Frontend Integration

All API calls originate from `app/page.tsx` and use the native `fetch()` API.

### Message fetching (GET)
```ts
fetch(`${API_BASE}/messages.php`, { cache: 'no-store', headers })
```
Renders in the **Messages** section. Called on mount and after a new message is sent.

### Message creation (POST)
```ts
fetch(`${API_BASE}/messages.php`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ... },
  body: JSON.stringify({ nickname, message }),
})
```
Called from the **Contact** form when submitting a message.

### Message deletion (DELETE)
```ts
fetch(`${API_BASE}/messages.php`, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json', ... },
  body: JSON.stringify({ id, passcode }),
})
```
Triggered from a modal that asks for the 4-digit passcode. Only visible to the site owner.

### Visit tracking (POST + GET)
```ts
// Increment
await fetch(`${API_BASE}/visits.php`, { method: 'POST' })
// Read
const res = await fetch(`${API_BASE}/visits.php`)
```
Runs on every page load in the **Footer** component.

---

## XAMPP Environment

XAMPP is installed at `C:\xampp\` with the following relevant components:

| Component | Purpose |
|---|---|
| Apache | HTTP server for PHP |
| MySQL (MariaDB) | Database server |
| PHP 8.x | Scripting language |
| phpMyAdmin | DB admin UI (`C:\xampp\phpMyAdmin\`) |

The `kironoa` database is active in `C:\xampp\mysql\data\kironoa\` with the following physical files:

| File | Size | Contents |
|---|---|---|
| `db.opt` | 67 B | DB options (charset, collation) |
| `messages.frm` | 1,416 B | Table format (definition) |
| `messages.ibd` | 65,536 B | Table data + indexes |
| `visits.frm` | 949 B | Table format (definition) |
| `visits.ibd` | 65,536 B | Table data + indexes |

---

## Deployment / Network

| Component | URL | Hosting |
|---|---|---|
| Frontend | `https://kironoa.vercel.app` | Vercel |
| Backend API | `https://seclusion-applicant-smartly.ngrok-free.dev/api` | ngrok → local XAMPP |
| Local API | `http://localhost/kironoa-api/api` | XAMPP (htdocs) |

The frontend communicates with the backend via an **ngrok tunnel** — ngrok exposes the local XAMPP/PHP server to the internet with a randomly generated subdomain (`seclusion-applicant-smartly`).

---

## Security Considerations

1. **Passcode is hardcoded** — `'0712'` in `messages.php:47`. This is trivial to extract from the source if someone has file access, but since it's server-side code, it's not exposed to frontend users directly (unless there's a source leak).
2. **No rate limiting** — The API has no protection against spam or abuse. The `POST /messages.php` and `POST /visits.php` endpoints can be called arbitrarily.
3. **No input sanitization beyond trimming** — While PDO prepared statements prevent SQL injection, there is no XSS filtering on message content (though the frontend likely renders it safely).
4. **MySQL root with no password** — Standard XAMPP default, acceptable for local development but should not be exposed publicly (ngrok does not expose the MySQL port directly).

---

## Setup Summary

To recreate this backend from scratch:

1. Install XAMPP and start Apache + MySQL
2. Run `schema.sql` in phpMyAdmin or via MySQL CLI
3. Place the `backend/` folder in `C:\xampp\htdocs\kironoa-api\`
4. Update `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost/kironoa-api/api`
5. For public access: run `ngrok http 80` and update `.env.local` with the ngrok URL
