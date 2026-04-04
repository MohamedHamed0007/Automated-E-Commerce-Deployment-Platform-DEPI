# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_INTERNAL_API_URL=http://backend:3000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_INTERNAL_API_URL=${NEXT_PUBLIC_INTERNAL_API_URL}

COPY package*.json ./
RUN npm ci
COPY .env ./
COPY . .
RUN npm run build

# Stage 2: Run only the compiled output
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 5000
CMD ["npm", "run", "start"]