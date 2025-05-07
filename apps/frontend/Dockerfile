FROM node:20-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

# Install deps separately to improve caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the code and build
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only install production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy build output and necessary files
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/pages pages
COPY --from=builder /app/app app
COPY --from=builder /app/styles styles
COPY --from=builder /app/components components
COPY --from=builder /app/utils utils

EXPOSE 3000

CMD ["npm", "start"]