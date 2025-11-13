# Vista Homestays - Dockerized Full Stack App

## What you got
- React frontend (Vite)
- Node/Express backend with JWT auth
- MongoDB (official image)
- Docker + docker-compose to run all services

## Quick start (requires Docker & Docker Compose)
1. Build & run:
   ```bash
   docker-compose up --build
   ```
2. Backend API: http://localhost:5000
3. Frontend: http://localhost:3000

## Notes
- Seed backend data (homestays) is available via `backend/seed.js`. When backend is running locally, you can run `npm run seed` inside the backend container or host to populate 10 homestays.
- Default JWT secret is in docker-compose env `JWT_SECRET`. Change it for production.
- Coupon code implemented on frontend:
- GST 18% is applied to subtotal and shown in totals.

Enjoy! 🏖️
