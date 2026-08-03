# Mockstreet

A mock stock trading platform for practicing buying and selling stocks.

## Architecture

**Production**

```text
Browser → Vercel (Vite SPA) → Render Web Service (Docker) → Render PostgreSQL
```

**Local development**

```text
npm Vite (:5173) → npm Express (:5000) → PostgreSQL (Compose :5433)
```

**Staging / QA (Docker)**

```text
Vite preview container (:3000) → backend prod image (:5000) → PostgreSQL (Compose)
```

Nginx is not used. Vercel serves production frontend; Render terminates TLS for the API; the frontend calls the backend via `VITE_API_URL`; the backend handles CORS and cookie sessions.

Deployment checklist, known risks, and historical hosting decisions: **[deployment.md](deployment.md)**.

## Folder structure

```
mockstreet/
├── frontend/                 # Vite + React SPA (deployed to Vercel)
│   ├── public/
│   ├── src/
│   ├── Dockerfile            # Staging QA image only (not used by Vercel)
│   ├── vercel.json
│   └── .env.example
├── backend/                  # Express API (deployed to Render via Docker)
│   ├── migrations/
│   ├── scripts/migrate.js
│   ├── Dockerfile            # prod image (Render + staging)
│   └── .env.example
├── docker-compose.yml        # Local Postgres
├── docker-compose.staging.yml # Staging QA: frontend + backend containers
├── deployment.md
└── README.md
```

## Prerequisites

- Node.js 22+
- Docker and Docker Compose (Postgres + optional staging stack)
- Copy env examples and fill in values for local npm workflow

## Local development

Day-to-day coding runs **frontend and backend on the host**. Nginx is not required.

### 1. PostgreSQL

```bash
docker compose up -d postgres
```

Or use any local PostgreSQL instance and set `DATABASE_URL` accordingly.

Compose publishes Postgres on **host port 5433** (`localhost:5433`) to avoid clashing with a Postgres already bound to 5432.

### 2. Backend

```bash
cd backend
cp .env.example .env   # then edit values
npm ci
npm run migrate
npm run dev
```

API: [http://localhost:5000](http://localhost:5000)  
Health: [http://localhost:5000/health](http://localhost:5000/health)

Example `DATABASE_URL`: `postgresql://postgres:postgres@localhost:5433/mockstreet-db` (must match root `.env` `POSTGRES_*`)

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
npm ci
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

**Frontend** (`frontend/.env`): `VITE_API_URL`

Do not put database credentials, session secrets, email passwords, or private API keys in frontend env vars.

---

## Staging / QA (Docker)

Use this before pushing to Vercel + Render. It builds the **production backend image** and a **production frontend build** (served with `vite preview`) against Compose Postgres.

```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml up --build
```

- App: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:5000](http://localhost:5000)

Staging sets `COOKIE_SECURE=false` so session cookies work over local HTTP. Real Render production leaves cookies Secure (omit `COOKIE_SECURE` or set `true`).

Optional root `.env` for staging secrets: `SESSION_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `FINNHUB_API_KEY`.

```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml down
```

This stack is **not** deployed to production. Vercel hosts the frontend; Render hosts the backend.

---

## Production deployment

Code changes prepare the repo; **Render and Vercel dashboards must be configured manually**. Deployment is not complete until those steps are done.

For the short checklist and background on why this stack was chosen, see **[deployment.md](deployment.md)**.

### Render PostgreSQL

1. Create a managed PostgreSQL database on Render.
2. Place it in the **same region** as the backend.
3. Copy the **internal** database URL.
4. Set that value as the backend service’s `DATABASE_URL`.

### Render backend (Web Service)

| Setting | Value |
| --- | --- |
| Service type | Web Service |
| Runtime | Docker |
| Root directory | `backend` |
| Dockerfile | `./Dockerfile` (relative to root directory) |
| Health check path | `/health` |
| Pre-deploy command | `npm run migrate` |

**Required environment variables** (set in the Render dashboard; no secret values in git):

- `NODE_ENV=production`
- `DATABASE_URL` — from Render PostgreSQL
- `SESSION_SECRET` — long random string
- `ALLOWED_ORIGINS` — comma-separated exact origins (update after the Vercel domain is known), e.g. `https://your-app.vercel.app`
- `EMAIL_USER` / `EMAIL_PASS` — contact form (Gmail)
- `FINNHUB_API_KEY` — market data

Do **not** set `COOKIE_SECURE=false` on Render.

Render sets `PORT` automatically; do not hard-code it.

**Production migration command:** `npm run migrate`

After the final Vercel domain is known, update `ALLOWED_ORIGINS` on Render and redeploy or restart the service if needed.

### Vercel frontend

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

**Environment variable** (Production):

- `VITE_API_URL` — public Render backend URL, e.g. `https://your-backend.onrender.com` (no trailing slash)

`VITE_*` values are baked in at **build time**. Redeploy the frontend after changing them.

---

## Docker Compose services

| Service | File | Role |
| --- | --- | --- |
| `postgres` | `docker-compose.yml` | Local + staging database |
| `backend` | `docker-compose.staging.yml` | Prod image for QA (same Dockerfile as Render) |
| `frontend` | `docker-compose.staging.yml` | Prod build + `vite preview` for QA only |

---

## Notes and risks

- Cookie sessions use Postgres (`connect-pg-simple`). Production cookies are `Secure` + `SameSite=None` for cross-site Vercel → Render requests. Frontend requests use `credentials: "include"`.
- Cross-site auth requires HTTPS on both sides and a correct `ALLOWED_ORIGINS` allowlist.
- Gmail SMTP from Render may be unreliable depending on IP reputation; the existing nodemailer/Gmail setup is preserved.
