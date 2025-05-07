FROM oven/bun AS build

WORKDIR /app

COPY package.json package.json
RUN apt update && apt install python3 python3-pip make g++ -y
COPY bun.lockb bun.lockb

RUN bun install

COPY . .

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 4000