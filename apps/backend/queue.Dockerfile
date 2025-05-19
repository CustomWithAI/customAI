FROM oven/bun AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install
COPY . .

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile worker \
	./src/workers/queueWorker.ts

FROM debian:bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libstdc++6 \
    libvips \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app .

ENV NODE_ENV=production
CMD ["./worker"]
