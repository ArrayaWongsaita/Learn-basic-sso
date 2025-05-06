# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Set npm configurations for better network reliability
RUN npm config set registry https://registry.npmjs.org/ \
  && npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Set environment variables from build args
ARG NEXT_PUBLIC_IDP_URL
ARG NEXT_PUBLIC_CLIENT_ID
ARG NEXT_PUBLIC_REDIRECT_URI

ENV NEXT_PUBLIC_IDP_URL=${NEXT_PUBLIC_IDP_URL}
ENV NEXT_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_CLIENT_ID}
ENV NEXT_PUBLIC_REDIRECT_URI=${NEXT_PUBLIC_REDIRECT_URI}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3001

# Start the app
CMD ["npm", "start", "--", "-p", "3001"]
