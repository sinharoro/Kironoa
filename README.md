# Kironoa Portfolio — Next.js

A Next.js 14 + TypeScript conversion of the Kironoa bento portfolio.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (CLI build — no CDN runtime)
- **Supabase** (auth + calendar notes)
- **SortableJS** (drag-to-reorder bento cards)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Copy your assets
Place your images in `public/images/` and sounds in `public/sounds/`.
Copy the Space Impact game files to `public/games/`.

Asset checklist:
- `public/images/MyLogo.png`
- `public/images/nge.jpg`
- `public/images/mwemwe.jpg`
- `public/images/4seasons.png`
- `public/images/Keshi.png`
- `public/images/saobg.jpg`          ← dark mode background
- `public/images/saopurple.png`      ← light mode background
- `public/images/StudentPal/SPpreview.jpg`
- `public/images/StudentPal/SPdashboard.png`
- `public/images/StudentPal/SPonline.png`
- `public/images/StudentPal/SPoffline.png`
- `public/sounds/Bloody_Ice.mp3`
- `public/sounds/Desert_Scream.mp3`
- `public/sounds/Green_Despair.mp3`
- `public/sounds/Port_Lux.mp3`
- `public/games/SI.html`             ← Space Impact game
- `public/games/style.css`
- `public/games/game.js`

### 4. Set up Supabase RLS
In your Supabase project, enable Row Level Security on `calendar_notes`:

```sql
-- Users can only read/write their own notes
ALTER TABLE calendar_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own notes only" ON calendar_notes
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Run dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx          ← Root layout + font loading
  page.tsx            ← Home page
  globals.css         ← All CSS (no Tailwind CDN)
components/
  layout/
    TopNav.tsx        ← Logo + theme toggle + login popup
    FloatingNav.tsx   ← Bottom pill navigation
  cards/
    TimeCard.tsx      ← Clock + calendar opener
    CalendarCard.tsx  ← Full calendar with Supabase note saving
    ProfileCard.tsx   ← Profile info
    StatusCard.tsx    ← Status indicator
    HarmonyCard.tsx   ← Season sounds player
    ContactCard.tsx   ← Contact/message form
    MusicCard.tsx     ← Favorite track
    GameCard.tsx      ← Space Impact launcher
  sections/
    BentoSection.tsx  ← Main bento grid (SortableJS)
    SkillsSection.tsx
    CertificatesSection.tsx
    ProjectsSection.tsx
  modals/
    CardModal.tsx     ← Generic expand modal
    LoginPopup.tsx    ← Auth form
  ui/
    CursorInit.tsx    ← Client-side cursor follower init
hooks/
  useTheme.tsx        ← Dark/light theme context
  useCursor.ts        ← Cursor follower hook
lib/
  supabase.ts         ← Supabase client singleton
```

---

## PHP Backend + MySQL (Messaging & Visit Counter)

This project includes a PHP REST API backend with MySQL for two features:
- **Messaging System** — visitors can leave messages (nickname + message)
- **Visit Counter** — tracks total homepage visits

### Backend Structure

```
backend/
  schema.sql              ← MySQL database schema
  config/
    database.php          ← PDO database connection + CORS headers
  api/
    messages.php          ← GET (fetch all), POST (add), DELETE (remove)
    visits.php            ← GET (get count), POST (increment)
```

### Setup Instructions (XAMPP)

#### 1. Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services

#### 2. Import the database
- Open phpMyAdmin: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
- Click **Import**, select `backend/schema.sql`, and run it
- This creates the `kironoa` database with `messages` and `visits` tables

#### 3. Deploy the PHP backend
- Copy the entire `backend/` folder into `C:\xampp\htdocs\`
- Rename it to `kironoa-api`
- Your API will be available at: `http://localhost/kironoa-api/`

#### 4. Configure environment
- Open `.env.local` in the project root
- Verify or update:
  ```
  NEXT_PUBLIC_API_URL=http://localhost/kironoa-api/api
  ```

#### 5. Run the Next.js dev server
```bash
npm run dev
```

### API Endpoints

| Method   | Endpoint                          | Description              |
|----------|-----------------------------------|--------------------------|
| `GET`    | `/api/messages.php`               | Fetch all messages       |
| `POST`   | `/api/messages.php`               | Add a new message        |
| `DELETE` | `/api/messages.php`               | Delete a message by ID   |
| `GET`    | `/api/visits.php`                 | Get total visit count    |
| `POST`   | `/api/visits.php`                 | Increment visit count    |

### Database Tables

**messages**
| Field      | Type         | Description              |
|------------|--------------|--------------------------|
| id         | INT (PK)     | Auto-increment ID        |
| nickname   | VARCHAR(100) | Sender's nickname        |
| message    | TEXT         | Message content          |
| created_at | TIMESTAMP    | Auto-set on creation     |

**visits**
| Field | Type     | Description             |
|-------|----------|-------------------------|
| id    | INT (PK) | Always 1 (single row)   |
| count | INT      | Total visit count       |

### Troubleshooting

- **CORS errors**: Ensure `database.php` has `Access-Control-Allow-Origin: http://localhost:3000`
- **Database connection fails**: Check your MySQL credentials in `backend/config/database.php` (default: root / no password)
- **404 on API calls**: Verify the backend folder is in XAMPP's `htdocs` and the URL in `.env.local` is correct

## Key improvements over original
- Supabase credentials moved to `.env.local` (never hardcoded)
- `body` always visible — no auth-blocking blank screen
- Game iframe properly cleaned up on close
- All HTML IDs are unique (duplicate `id="heading"` fixed)
- Tailwind built at compile time (not CDN runtime)
- All JS split into focused modules/components
- TypeScript throughout
