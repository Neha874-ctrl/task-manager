# ========================================================
# Multi-stage Dockerfile for Node.js Task Manager API
# ========================================================

# --------------------------------------------------------
# Stage 1: Build & compile TypeScript application
# --------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency configuration files
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy TypeScript source code
COPY src/ ./src/

# Compile TypeScript into dist/
RUN npm run build

# Remove development dependencies, retaining only production modules
RUN npm prune --omit=dev

# --------------------------------------------------------
# Stage 2: Minimal production runtime image
# --------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors for npm start
COPY package*.json ./

# Copy production dependencies from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy compiled JavaScript output from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Adjust ownership to built-in non-root 'node' user
RUN chown -R node:node /usr/src/app

# Enforce least-privilege security by running as non-root user
USER node

# Expose API port
EXPOSE 3000

# Container healthcheck using alpine's native wget
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Launch application using production command
CMD ["npm", "start"]
