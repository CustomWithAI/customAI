FROM oven/bun:latest

RUN apt update && apt install python3 python3-pip make g++ -y

WORKDIR /app

COPY package.json bun.lock /

RUN bun install

COPY . .

ENV NODE_ENV=development

EXPOSE 4000

CMD ["bun", "run","--watch", "src/index.ts"]


