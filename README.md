# 3-Tier Web App Demo (Docker & Docker Compose)

A 3-tier Dockerized web application intended for Docker & Docker Compose demo. Includes instructions to build, run, test and extend the repository.

## Contents
- Overview
- Prerequisites
- Quick start (build & run)
- Development workflow
- Environment variables
- Testing
- Project layout
- Useful commands
- Troubleshooting
- License

## Overview
This repository contains a small Node.js application packaged with Docker so it can be run consistently in local and CI/CD environments. Replace example values and extend as needed for the real app.

## Prerequisites
- Docker (engine) >= 20.x
- Docker Compose (optional) >= 2.x
- Node.js & npm (only required for non-Docker local development)
- git (to clone repo)

## Quick start (Docker)
Build the image:
```
docker build -t node-demo:latest .
```

Run the container:
```
docker run --rm -p 3000:3000 --env-file .env node-demo:latest
```

Use docker-compose (recommended for multi-service setups):
```
docker compose up --build -d
```
The app listens on port 3000 by default (adjust in env or Dockerfile).

In Docker (example):
```
docker build -t node-demo:latest .
docker run --name node-demo -p 3000:3000 -d node-demo:latest
```

## Project layout (suggested)
```
.
├── .git
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── index.js
└── README.md
```

## Useful commands
- Build: `docker build -t node-demo:latest .`
- Run: `docker run --name node-demo -p 3000:3000 -d node-demo:latest`
- Compose up: `docker compose up --build -d`
- Show logs: `docker compose logs -f`
- Exec into running container: `docker exec -it <container> sh`

## Troubleshooting
- "Cannot connect to port": check container logs and mapped ports.

## License
Specify project license in LICENSE file (e.g., MIT).

Replace placeholders and customize scripts, healthchecks and CI integration to match the real application.