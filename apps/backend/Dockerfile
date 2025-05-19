FROM oven/bun:latest AS base
WORKDIR /usr/src/app

FROM base AS install

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --production

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/prod/package.json .

COPY . .

USER bun
EXPOSE 4000
ENTRYPOINT [ "bun", "src", "index.ts" ]