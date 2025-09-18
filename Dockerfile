# Stage 1: build
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps (use package-lock.json for reproducible installs)
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built JS
COPY --from=builder /app/build ./build

# Optional: copy other runtime files (e.g., supabase folder or public assets)
# COPY supabase ./supabase

EXPOSE 10000
CMD ["node", "build/app.js"]
