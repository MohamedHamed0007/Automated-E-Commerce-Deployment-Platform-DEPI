# Stage 1: Build TypeScript
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Run compiled JS only
FROM node:20-alpine
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Use Railway environment variables
ENV NODE_ENV=production

# No need to copy env folder; use Railway env vars

# Run server
CMD ["node", "dist/server.js"]