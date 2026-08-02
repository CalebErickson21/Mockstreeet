# Mockstreet

A mock stock trading platform for practicing buying and selling stocks.

## Folder structure

```
mockstreet/
├── frontend/                 # React (Create React App) client
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── contexts/         # React context providers
│   │   ├── pages/            # Route pages (home, market, portfolio, etc.)
│   │   └── utils/
│   ├── public/
│   └── Dockerfile
├── backend/                  # Node.js API server
│   ├── index.js
│   ├── db.js
│   └── Dockerfile
├── nginx/                    # Reverse proxy configs
│   ├── nginx.dev.conf
│   ├── nginx.prod.conf
│   └── ssl/                  # TLS certs (prod)
├── docker/
│   └── postgres/init/        # DB init scripts
├── docker-compose.yml        # Shared network / base services
├── docker-compose.dev.yml    # Local development overlay
└── docker-compose.prod.yml   # Production overlay
```

## Prerequisites

- Docker and Docker Compose
- A `.env` file in the repo root (see `.env.example` for required variables)

## Development

Builds the stack with hot reload, Postgres, and nginx on port 80:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

App: [http://localhost](http://localhost)

Useful commands:

```bash
# Stop
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Rebuild after dependency changes
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Production

Ensure `.env` is filled in (Postgres credentials, `SESSION_SECRET`, `ALLOWED_ORIGINS`, `FINNHUB_API_KEY`, email settings, etc.) and place TLS certs under `nginx/ssl/`.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

App: ports **80** (HTTP) and **443** (HTTPS)

Useful commands:

```bash
# Stop
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Follow logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

Optional image tag:

```bash
IMAGE_TAG=v1 docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```
