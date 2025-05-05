# Step 1: Build the application
FROM node:23-alpine AS builder

WORKDIR /app

RUN apk add --no-cache gcompat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2: Run the production server
FROM node:23-alpine AS runner

WORKDIR /app

# Only copy necessary files
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "start"]
