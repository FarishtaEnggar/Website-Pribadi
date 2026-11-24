#!/bin/sh
set -eu

mkdir -p /data /app/uploads

# Regenerate the Prisma client for this container so it never ships as the
# uninitialised stub from the npm postinstall step.
echo "[entrypoint] generating prisma client"
npx prisma generate --schema /app/prisma/schema.prisma

if [ ! -f /data/.initialized ]; then
  echo "[entrypoint] initializing database at ${DATABASE_URL:-unset}"
  npx prisma db push --skip-generate --schema /app/prisma/schema.prisma

  echo "[entrypoint] seeding initial content"
  # Keep the seeded admin credentials out of the container logs.
  if ! seed_output=$(npx tsx /app/prisma/seed.ts 2>&1); then
    echo "$seed_output"
    echo "[entrypoint] seeding failed"
    exit 1
  fi
  echo "$seed_output" | grep -v "Admin login:" || true

  touch /data/.initialized
fi

exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
