# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Set npm configurations to improve reliability
RUN npm config set registry https://registry.npmjs.org/ \
  && npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with retries for network resilience
RUN --mount=type=cache,target=/root/.npm \
  npm install --no-audit --prefer-offline || \
  npm install --no-audit --prefer-offline || \
  npm install --no-audit

# Add build arguments for environment variables
ARG VITE_IDP_URL
ARG VITE_CLIENT_ID
ARG VITE_REDIRECT_URI

# Set environment variables
ENV VITE_IDP_URL=${VITE_IDP_URL}
ENV VITE_CLIENT_ID=${VITE_CLIENT_ID}
ENV VITE_REDIRECT_URI=${VITE_REDIRECT_URI}

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration if you have custom settings
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
