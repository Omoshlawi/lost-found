# Stage 1: Build the application
FROM node:22.11.0-alpine AS builder

WORKDIR /app

# Enable corepack for yarn v4
RUN corepack enable

# Copy package files and yarn configuration
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies
RUN yarn install --immutable

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration for single-page applications
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
