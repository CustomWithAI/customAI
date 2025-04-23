FROM oven/bun:latest AS base
FROM base AS build

RUN apt update && apt install python3 python3-pip make g++ -y

WORKDIR /app

COPY package.json bun.lockb /

RUN bun install

COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["bun", "run","--watch", "src/index.ts"]


