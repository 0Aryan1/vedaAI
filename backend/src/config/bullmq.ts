const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const parsedRedisUrl = new URL(redisUrl);

export const redisConnection = {
  host: parsedRedisUrl.hostname,
  port: Number(parsedRedisUrl.port || 6379),
};

export const defaultJobOptions = {
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
  attempts: 3,
  backoff: { type: "exponential", delay: 2000 },
} as const;
