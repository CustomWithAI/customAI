FROM node:23-alpine AS base
FROM base AS build

WORKDIR /app

RUN apk add --no-cache gcompat
COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
CMD ["npm", "run", "dev"]


