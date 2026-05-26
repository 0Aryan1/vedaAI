import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const parsedRedisUrl = new URL(redisUrl);

// Extract password and decode it (Upstash encodes special characters)
const password = parsedRedisUrl.password ? decodeURIComponent(parsedRedisUrl.password) : undefined;
const isTLS = parsedRedisUrl.protocol === "rediss:";

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    if (times > 3) {
      return undefined;
    }
    return Math.min(times * 50, 500);
  },
  enableReadyCheck: false,
  enableOfflineQueue: false,
  ...(isTLS && { tls: {} }), // Enable TLS for rediss:// URLs
  ...(password && { password }), // Set password if present
});

redis.on("connect", () => {
  console.log("✓ Redis connected");
});

redis.on("error", (error) => {
  if (process.env.NODE_ENV === "development") {
    if ((error as any).code === "ECONNREFUSED") {
      if ((redis.status === "connecting")) {
        console.warn("⚠ Redis is not running. Job queue features will not work.");
        console.warn("  To start Redis on macOS: brew services start redis");
      }
    }
  } else {
    console.error("Redis error:", error);
  }
});

redis.on("close", () => {
  console.warn("⚠ Redis connection closed");
});

export default redis;
