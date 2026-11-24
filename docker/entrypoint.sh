#!/bin/sh
set -eu

mkdir -p /data /app/uploads

if [ ! -f /data/.initialized ]; then
  echo "[entrypoint] initializing database at ${DATABASE_URL:-unset}"
  if [ ! -f /data/app.db ]; then
    cp /app/template.db /data/app.db
  fi

  echo "[entrypoint] seeding initial content"
  # Keep the seeded admin credentials out of the container logs.
  if ! seed_output=$(node /app/seed.cjs 2>&1); then
    echo "$seed_output"
    echo "[entrypoint] seeding failed"
    exit 1
  fi
  echo "$seed_output" | grep -v "Admin login:" || true

  touch /data/.initialized
fi

exec node /app/server.js
