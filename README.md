# Todo Bun Monorepo

Aplikasi Todo List full-stack berbasis **Bun**, **ElysiaJS**, **Drizzle ORM (RC)**, **Zod**, **MySQL**, **React 19**, **Vite 8**, **Tailwind CSS v4**, dan **daisyUI v5**.

## Struktur Monorepo

```text
todo-bun/
├── backend/                # ElysiaJS API + Drizzle ORM + Zod + MySQL
│   ├── drizzle/            # File migrasi SQL dari Drizzle Kit
│   ├── src/
│   │   ├── app/            # Koneksi database Drizzle (mysql2)
│   │   ├── config/         # Konfigurasi CORS, Cookie, dan JWT
│   │   ├── db/             # Definisi skema tabel Drizzle
│   │   ├── group/          # Route group (/api/v1/user, /api/v1/todo) + validasi Zod
│   │   ├── service/        # Business logic
│   │   └── index.ts        # Entry point Elysia server
│   ├── drizzle.config.ts   # Konfigurasi Drizzle Kit
│   └── Dockerfile
├── frontend/               # React 19 + React Router v7 + Tailwind v4 + daisyUI v5
│   ├── src/
│   │   ├── components/     # Navbar, Task, UpdateModal, DeleteModal, ThemeSwitcher
│   │   ├── helper/         # Axios instance
│   │   ├── pages/          # Home, Login, Signup
│   │   ├── reducer/        # Todo state reducer
│   │   └── index.css       # Entry point Tailwind CSS v4 + daisyUI v5
│   └── Dockerfile
├── docker-compose.yml      # Orkestrasi MySQL, Backend, dan Frontend
└── README.md
```

## Tech Stack

### Backend
- **Runtime**: Bun `1.4.x`
- **Framework**: Elysia `1.4.x` (`@elysiajs/cors`, `@elysiajs/jwt`, `@elysiajs/swagger`, `@elysiajs/static`)
- **ORM & Migration**: `drizzle-orm@1.0.0-rc.5` & `drizzle-kit@1.0.0-rc.5` dengan driver `mysql2`
- **Validation**: `zod` (terintegrasi langsung dengan route schema Elysia)
- **Database**: MySQL 8

### Frontend
- **Library**: React `19` + React Router `7`
- **Build Tool**: Vite `8`
- **Styling**: Tailwind CSS `4` + daisyUI `5` (dengan dukungan 6 tema dinamis)
- **HTTP Client & Notifikasi**: Axios + React Toastify `11`

---

## Menjalankan Secara Lokal

### Prasyarat
- [Bun](https://bun.sh/) (`>= 1.4`)
- MySQL Server aktif

### 1. Setup Backend
```bash
cd backend
bun install
```
Pastikan file `backend/.env` berisi `DATABASE_URL` yang valid:
```env
DATABASE_URL="mysql://root:wm050604@localhost:3306/bun_todo"
```
Jalankan migrasi database menggunakan Drizzle Kit:
```bash
bun run db:migrate
```
Jalankan server backend (port `3000`):
```bash
bun run dev
```

### 2. Setup Frontend
```bash
cd frontend
bun install
bun run dev
```
Frontend akan berjalan di `http://localhost:5173`.

---

## Script Drizzle Kit (`backend/package.json`)

| Script | Perintah | Fungsi |
| :--- | :--- | :--- |
| `bun run db:generate` | `drizzle-kit generate` | Membuat file migrasi SQL dari perubahan `src/db/schema.ts` |
| `bun run db:migrate` | `drizzle-kit migrate` | Menjalankan migrasi SQL ke database |
| `bun run db:push` | `drizzle-kit push` | Sinkronisasi skema langsung ke database tanpa file migrasi |
| `bun run db:pull` | `drizzle-kit pull` | Mengambil skema dari database yang sudah ada |
| `bun run db:studio` | `drizzle-kit studio` | Membuka Drizzle Studio (GUI database) |
| `bun run db:check` | `drizzle-kit check` | Memeriksa konsistensi snapshot migrasi |

---

## Menjalankan dengan Docker Compose

Jalankan seluruh layanan (`db`, `backend`, `frontend`) dari root direktori:

```bash
docker compose up --build -d
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/swagger`
- **MySQL**: `localhost:3306`

Untuk menghentikan seluruh container:
```bash
docker compose down
```

---

## Ringkasan API Endpoints

### User (`/api/v1/user`)
- `POST /api/v1/user/signup` — Registrasi user baru (validasi Zod)
- `POST /api/v1/user/login` — Login dan set cookie JWT `auth` (validasi Zod)
- `GET /api/v1/user/info` — Cek status autentikasi user
- `DELETE /api/v1/user/logout` — Hapus cookie sesi `auth`

### Todo (`/api/v1/todo`) *(memerlukan cookie JWT `auth`)*
- `GET /api/v1/todo` — Mengambil daftar todo milik user
- `POST /api/v1/todo` — Membuat todo baru (validasi Zod)
- `PATCH /api/v1/todo/:id` — Mengubah `activity` atau status `finished` (validasi Zod)
- `DELETE /api/v1/todo/:id` — Menghapus todo berdasarkan `id` (validasi Zod)
