# -------- Stage 1: Build --------
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# -------- Stage 2: Production --------
FROM node:lts-alpine

# Install tini for proper signal handling
RUN apk add --no-cache tini

ENV NODE_ENV=production

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies (smaller image)
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy only the output we need
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# Expose Next.js port
EXPOSE 3000

CMD ["npm", "start"]
    
