import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    // For development, log errors but don't retry indefinitely
    if (times > 3) {
      console.warn("Redis connection failed. Running without Redis queue support.");
      return undefined; // Stop retrying
    }
    return Math.min(times * 50, 500);
  },
  enableReadyCheck: false,
  enableOfflineQueue: false,
});

redis.on("connect", () => {
  console.log("✓ Redis connected");
});

redis.on("error", (error) => {
  // Suppress error spam in development
  if (process.env.NODE_ENV === "development") {
    // Log once per connection attempt
    if (error.code === "ECONNREFUSED") {
      // Only log on first attempt
      if ((redis.status === "connecting" && redis.retryAttempts === 1)) {
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
