# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# The production host is small (1 vCPU / 1 GB RAM), so cap the Node heap and
# use Webpack instead of Turbopack: Turbopack segfaults under this memory limit.
ENV NODE_OPTIONS=--max-old-space-size=768
# A throwaway database lets the build run `prisma generate` and (if needed)
# prerender pages that touch Prisma. Real data lives in the /data volume.
ENV DATABASE_URL=file:/tmp/build.db
RUN npx prisma db push --skip-generate \
  && npx prisma generate \
  && npx next build --webpack

FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Taken from the builder so the generated Prisma client is included.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY docker/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh \
  && mkdir -p /app/uploads /data \
  && rm -f /app/prisma/dev.db /app/prisma/dev.db-journal

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
