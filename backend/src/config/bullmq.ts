const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const parsedRedisUrl = new URL(redisUrl);

// Extract password and decode it (Upstash encodes special characters)
const password = parsedRedisUrl.password ? decodeURIComponent(parsedRedisUrl.password) : undefined;

export const redisConnection = {
  host: parsedRedisUrl.hostname,
  port: Number(parsedRedisUrl.port || 6379),
  password,
  tls: parsedRedisUrl.protocol === "rediss:" ? {} : undefined,
};

export const defaultJobOptions = {
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
  attempts: 3,
  backoff: { type: "exponential", delay: 2000 },
} as const;
