FROM oven/bun:latest AS base
FROM base AS build

WORKDIR /app

COPY package.json bun.lockb /

RUN bun install

COPY . .

ENV NODE_ENV=development

EXPOSE 3000
CMD ["bun", "run", "dev"]


