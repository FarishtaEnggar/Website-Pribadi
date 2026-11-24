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
  && npx next build --webpack \
  && ./node_modules/.bin/esbuild prisma/seed.ts --bundle --platform=node \
     --target=node22 --format=cjs --external:@prisma/client --outfile=/tmp/seed.cjs

FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone/ ./
COPY --from=builder /app/.next/static/ ./.next/static/
COPY --from=builder /app/public/ ./public/
# The Prisma query engine is loaded dynamically, so tracing may miss it.
COPY --from=builder /app/node_modules/.prisma/ ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma/ ./node_modules/@prisma/
# A schema-initialised empty database copied into the volume on first boot.
COPY --from=builder /tmp/build.db ./template.db
COPY --from=builder /tmp/seed.cjs ./seed.cjs
COPY docker/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh \
  && mkdir -p /app/uploads /data

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
