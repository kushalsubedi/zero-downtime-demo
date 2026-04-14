# 🚀 Blue-Green Deployment with Docker + Nginx

This project demonstrates a **zero-downtime Blue-Green deployment strategy** using:

- Docker
- Docker Compose
- Nginx (reverse proxy)
- PostgreSQL
- Express + Prisma (Node.js backend)

---
A very Cheap and Simple Way to achieve near zero-downtime for your small to medium scale applications.


Only one app container is active at a time via `app_active` alias.

---

# 📦 Services

### 🟦 app_blue
- First version of the application
- Can serve live traffic

### 🟩 app_green
- New version of the application
- Used for safe deployments

### 🌐 nginx
- Reverse proxy
- Routes traffic to `app_active`

### 🐘 postgres
- Database service

---

# ⚙️ Requirements

- Docker
- Docker Compose

---

# 🚀 Setup

## 1. Build and start services

```bash
docker compose up -d --build
```
## Ready to go Script 
```bash 
#!/bin/bash

set -e

echo "Detecting active container..."

ACTIVE=$(docker ps --filter "name=app_blue" --format "{{.Names}}")

if [ "$ACTIVE" == "app_blue" ]; then
  NEW=app_green
  OLD=app_blue
else
  NEW=app_blue
  OLD=app_green
fi

echo "🚀 Deploying $NEW..."

docker compose up -d --build $NEW

echo "Waiting for app to be ready..."
sleep 5

echo "🔄 Switching traffic..."

# Remove alias from old
docker network disconnect app_net $OLD || true

# Add alias to new
docker network connect --alias app_active app_net $NEW

echo " Reload nginx..."
docker exec nginx nginx -s reload

echo "Stopping old container..."
docker compose stop $OLD

echo "Blue_Green Deployment complete!"
```
## What the deploy script does:

Detects currently active container (app_blue or app_green)
Builds and starts the new version
Waits for the application to be ready
Switches traffic by updating Docker network alias (app_active)
Reloads Nginx
Stops the old container
Completes zero-downtime deployment