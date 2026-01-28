# Stage 1: Build the Astro site
FROM node:20-alpine AS build

# Set production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
# This layer is cached unless package files change
COPY package*.json ./

# Install dependencies (npm ci for faster, deterministic installs)
RUN npm ci

# Copy source files
COPY . .

# Build the Astro site
RUN npm run build

# Stage 2: Production image with NGINX
FROM nginx:alpine

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for NGINX
EXPOSE 80

# nginx:alpine already has CMD ["nginx", "-g", "daemon off;"]
