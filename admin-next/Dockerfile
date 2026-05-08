# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for environment variables (passed during build)
ARG NEXT_PUBLIC_API_URL
ARG MONGO_URI

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_INTERNAL_API_URL=${NEXT_PUBLIC_API_URL}
ENV MONGO_URI=${MONGO_URI}

COPY package*.json ./
RUN npm ci

# Copy source code (but not .env files)
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Run only the compiled output
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]