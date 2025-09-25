# Deployment Guide: Dev Environment (Docker Compose, VPS/PaaS)

## Prerequisites
- Docker & Docker Compose installed on your VPS or local machine
- (Optional) Git for code deployment

## 1. Clone Your Repo
```
git clone https://github.com/chettripasa/myliveapp.git
cd myliveapp/infra
```

## 2. Configure Environment Variables
- Edit `/workspaces/myliveapp/backend/.env` as needed for production secrets.
- By default, Docker Compose will use the internal service names for Postgres and Redis:
  - `DATABASE_URL=postgres://postgres:postgres@db:5432/myliveapp`
  - `REDIS_URL=redis://redis:6379`

## 3. Start All Services
```
docker compose up --build -d
```
- This will start:
  - PostgreSQL (db)
  - Redis (redis)
  - Backend (NestJS)
  - Admin (React)
  - Mobile (Expo web)

## 4. Access Services
- Backend API: `http://<your-vps-ip>:3000`
- Admin UI: `http://<your-vps-ip>:5173`
- Mobile (web): `http://<your-vps-ip>:8081`
- Postgres: port 5432 (for DB tools)
- Redis: port 6379 (for Redis tools)

## 5. Database Migrations
If not automated, run:
```
docker compose exec backend npx prisma migrate deploy
```

## 6. (Optional) Deploy to Render/Heroku/DigitalOcean
- Use their Docker support or deploy each service separately.
- For managed Postgres/Redis, update `DATABASE_URL` and `REDIS_URL` in `.env` and/or Docker Compose.

## 7. Logs & Debugging
```
docker compose logs -f
```

---

**You are ready to deploy!**
- For production, secure your secrets and use managed DB/Redis if possible.
- Let me know if you want a Render/Heroku-specific guide or CI/CD setup.
