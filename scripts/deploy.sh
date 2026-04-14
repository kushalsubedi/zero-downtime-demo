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