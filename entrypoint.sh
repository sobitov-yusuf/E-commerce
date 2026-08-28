#!/bin/sh
# Universal Telegram Mini App (TMA) E-Commerce — Docker Entrypoint Script
# Automatically executes Prisma Migrations before launching Next.js standalone server

set -e

echo "🚀 [DevOps] Running database migrations (npx prisma migrate deploy)..."
npx prisma migrate deploy

echo "✅ [DevOps] Database migrations applied successfully!"
echo "⚡ [DevOps] Launching Next.js Production Server..."

# Execute the main container command (node server.js)
exec "$@"
