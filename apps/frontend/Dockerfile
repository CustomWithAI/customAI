# ===============================
# Stage 1: Build
# ===============================
FROM node:20-slim AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm install @tailwindcss/oxide-linux-arm64-gnu
RUN npm install lightningcss-linux-arm64-gnu
RUN npm install @tailwindcss/oxide-linux-x86-gnu
RUN npm install lightningcss-linux-x86-gnu

RUN npm ci --prefer-offline

COPY . .
RUN npm run build

CMD ["npm", "run", "start"]
