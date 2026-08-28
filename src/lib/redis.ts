// Universal Telegram Mini App (TMA) E-Commerce — Redis & Highload Stock Lock Manager
// Uses Upstash Redis for Rate Limiting, O(1) Atomic Stock Lock, and JWT Blacklist

import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client from environment variables
export const redis = Redis.fromEnv();

/**
 * 🛡️ O(1) Highload Atomic Stock Lock Management
 */
export const stockLockManager = {
  /**
   * Reserve stock atomically using INCRBY (O(1) complexity)
   * Creates a user lock key with TTL (default 15 mins / 900 seconds)
   */
  async reserveStock(
    variantId: number,
    userId: string,
    quantity: number,
    dbStockCount: number,
    ttlSeconds: number = 900
  ): Promise<{ success: boolean; availableStock: number; message?: string }> {
    const reservedKey = `reserved_stock:${variantId}`;
    const userLockKey = `user_lock:${variantId}:${userId}`;

    // Get current reserved stock (O(1))
    const currentReservedStr = await redis.get<string | number>(reservedKey);
    const currentReserved = parseInt(String(currentReservedStr || '0'), 10);
    const availableStock = dbStockCount - currentReserved;

    if (availableStock < quantity) {
      return {
        success: false,
        availableStock: Math.max(0, availableStock),
        message: 'Omborda yetarli mahsulot mavjud emas yoki boshqa xaridor tomonidan zaxiralangan',
      };
    }

    // Atomic increment of aggregate reserved stock
    await redis.incrby(reservedKey, quantity);

    // Record individual user lock session with TTL
    await redis.set(userLockKey, JSON.stringify({ quantity, variantId, userId }), {
      ex: ttlSeconds,
    });

    const newAvailable = Math.max(0, dbStockCount - (currentReserved + quantity));

    return {
      success: true,
      availableStock: newAvailable,
    };
  },

  /**
   * Release reserved stock atomically using DECRBY (O(1) complexity)
   * Decrements reserved_stock and deletes user session lock
   */
  async releaseStock(variantId: number, userId: string, quantity: number): Promise<void> {
    const reservedKey = `reserved_stock:${variantId}`;
    const userLockKey = `user_lock:${variantId}:${userId}`;

    // Check if user lock exists before decrementing to avoid negative numbers
    const userLockExists = await redis.exists(userLockKey);
    if (userLockExists) {
      await redis.del(userLockKey);
      
      const currentReservedStr = await redis.get<string | number>(reservedKey);
      const currentReserved = parseInt(String(currentReservedStr || '0'), 10);
      
      const decrementAmount = Math.min(currentReserved, quantity);
      if (decrementAmount > 0) {
        await redis.decrby(reservedKey, decrementAmount);
      }
    }
  },

  /**
   * Read current reserved stock for a variant (O(1) complexity)
   */
  async getReservedStock(variantId: number): Promise<number> {
    const reservedKey = `reserved_stock:${variantId}`;
    const val = await redis.get<string | number>(reservedKey);
    return parseInt(String(val || '0'), 10);
  },

  /**
   * Get available stock calculation (O(1) complexity)
   */
  async getAvailableStock(variantId: number, dbStockCount: number): Promise<number> {
    const reserved = await this.getReservedStock(variantId);
    return Math.max(0, dbStockCount - reserved);
  },
};

/**
 * 🔒 JWT Blacklist & Instant Session Revocation Manager
 */
export const jwtBlacklistManager = {
  /**
   * Add a JWT Token ID (jti) to Redis Blacklist (default 12 hours / 43200s)
   */
  async revokeToken(jti: string, ttlSeconds: number = 43200): Promise<void> {
    const blacklistKey = `jwt_blacklist:${jti}`;
    await redis.set(blacklistKey, 'revoked', { ex: ttlSeconds });
  },

  /**
   * Check if a JWT Token ID (jti) is blacklisted (O(1) complexity)
   */
  async isRevoked(jti: string): Promise<boolean> {
    const blacklistKey = `jwt_blacklist:${jti}`;
    const count = await redis.exists(blacklistKey);
    return count > 0;
  },
};
