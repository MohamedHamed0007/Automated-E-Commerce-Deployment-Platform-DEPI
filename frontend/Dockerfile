# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_URL=/api/v1
ARG VITE_STRIPE_PUBLISHABLE_KEY

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}

COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]