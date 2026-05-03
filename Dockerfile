# ---------- Base Stage ----------
FROM node:18-alpine AS base

WORKDIR /app

# Create non-root user
RUN addgroup -S nodejs -g 1001 && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# ---------- Dependencies (Dev + Build) ----------
FROM base AS deps

RUN npm ci

# ---------- Development Stage ----------
FROM base AS development

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

# Fix permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

CMD ["npm", "run", "dev"]

# ---------- Production Dependencies ----------
FROM base AS prod-deps

ENV NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force

# ---------- Production Stage ----------
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Create same user again (new stage!)
RUN addgroup -S nodejs -g 1001 && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy only what we need
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .

# Fix permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["npm", "start"]