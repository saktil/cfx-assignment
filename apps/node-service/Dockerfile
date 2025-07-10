# Stage 1: Install dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json./
RUN npm ci --only=production

# Stage 2: Create the final production image
FROM node:20-alpine

WORKDIR /app

# Create a non-root user for security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy installed dependencies and source code from the builder stage
COPY --from=builder /app/node_modules./node_modules
COPY server.js.

EXPOSE 3000

# Define the command to run the application
CMD ["node", "server.js"]