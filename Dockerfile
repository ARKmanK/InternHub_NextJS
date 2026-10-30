# syntax=docker/dockerfile:1
#
# Один Dockerfile — три образа (цели):
#   app       — Next.js (standalone-сборка, только node и нужные файлы)
#   migrator  — применение миграций и служебные скрипты (prisma CLI, tsx)
#   realtime  — WebSocket-сервер (bun, один файл и пакет ws)
#
# Сборка:  docker build --target app -t internhub-app .
# Обычно всё собирает docker compose (docker-compose.yml).

ARG NODE_IMAGE=node:22-bookworm-slim
ARG BUN_VERSION=1.3.14

# ─── Зависимости ──────────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS deps
ARG BUN_VERSION
WORKDIR /app
RUN npm install -g bun@${BUN_VERSION}
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# postinstall выполнит prisma generate — клиент появится в src/shared/api/db/generated
RUN bun install --frozen-lockfile

# ─── Сборка Next ──────────────────────────────────────────────────────────────
FROM deps AS build
COPY . .
# Сборке база и почта не нужны, но модули подключения проверяют, что переменные заданы.
# Это заглушки только для сборки: настоящие значения приходят при запуске (env_file в compose)
ENV DATABASE_URL=postgres://build:build@localhost:5432/build \
	BETTER_AUTH_SECRET=build-only-secret-not-used-at-runtime-000000 \
	BETTER_AUTH_URL=http://localhost:3000 \
	NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ─── Миграции и служебные скрипты ─────────────────────────────────────────────
FROM build AS migrator
ENV NODE_ENV=production
CMD ["bunx", "prisma", "migrate", "deploy"]

# ─── Приложение ───────────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS app
WORKDIR /app
ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PORT=3000 \
	HOSTNAME=0.0.0.0
# Не root: при взломе приложения у процесса нет прав на систему контейнера
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs \
	&& mkdir -p /app/.storage && chown nextjs:nodejs /app/.storage
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

# ─── Realtime-сервер ──────────────────────────────────────────────────────────
FROM oven/bun:${BUN_VERSION}-slim AS realtime
WORKDIR /app
ENV NODE_ENV=production
RUN bun add ws@8.18.3
COPY realtime ./realtime
COPY src/shared/api/realtime/token.ts ./src/shared/api/realtime/token.ts
USER bun
EXPOSE 3001
CMD ["bun", "realtime/server.ts"]
