FROM node:23-alpine AS base
FROM base AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev:fast"]


