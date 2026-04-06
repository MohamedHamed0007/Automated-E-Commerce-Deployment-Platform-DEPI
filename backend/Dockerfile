# Stage 1: Build TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
#COPY env/ ./env/
COPY . .
RUN npm run build

# Stage 2: Run compiled JS only
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/env ./env
EXPOSE 3000
CMD ["node", "dist/server.js"]