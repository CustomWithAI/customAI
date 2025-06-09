# ===============================
# Stage 1: Build
# ===============================
FROM node:20-slim AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build

# ===============================
# Stage 2: Production runtime
# ===============================
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS=--max-old-space-size=512

# Optional: add tini for PID 1 stability
RUN apt-get update && apt-get install -y --no-install-recommends tini && apt-get clean && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/usr/bin/tini", "--"]

# Copy standalone output only
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static .next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
