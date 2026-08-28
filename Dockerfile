# ==========================================
# Senior DevOps Production Multi-Stage Dockerfile
# Optimized for Next.js App Router, Prisma ORM, and Alpine Security
# ==========================================

# ------------------------------------------
# STAGE 1: Dependencies (deps)
# ------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependency manifests and Prisma schema
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install production & dev dependencies for build
RUN npm ci

# ------------------------------------------
# STAGE 2: Builder (builder)
# ------------------------------------------
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client specifically for Alpine Linux
RUN npx prisma generate

# Build Next.js App Router standalone output
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ------------------------------------------
# STAGE 3: Production Runner (runner)
# ------------------------------------------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security (Least Privilege Principle)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone application build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy entrypoint script and set permissions
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER nextjs

EXPOSE 3000

# Entrypoint automatically runs "npx prisma migrate deploy" before "node server.js"
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
