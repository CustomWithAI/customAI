FROM oven/bun:1 AS base
FROM base AS build

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lockb bun.lockb

COPY /apps/frontend/package.json ./apps/frontend/package.json
COPY /packages/config/package.json ./packages/config/package.json

RUN bun install

COPY /apps/frontend ./apps/frontend
COPY /packages/core ./packages/core

ENV NODE_ENV=development

RUN bun run dev:frontend

EXPOSE 4000
CMD ["bun", "run", "dev:frontend"]


