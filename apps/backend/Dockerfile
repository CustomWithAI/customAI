FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lockb bun.lockb

RUN bun install --production --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
  --external pg \
	--target bun \
	--outfile server \
	./src/index.ts

RUN chmod +x server

FROM alpine:latest AS runner

COPY --from=build /app/server /app/server

WORKDIR /app
RUN ls -a
RUN file server && ls -l server

ENV NODE_ENV=production

EXPOSE 3000

CMD ["./server"]