import { ConnectionOptions } from 'bullmq'

function parseRedisUrl(url: string): ConnectionOptions {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
    username: parsed.username || undefined,
    tls: url.startsWith('rediss://') 
      ? { rejectUnauthorized: false } 
      : undefined,
  }
}

export const redisConnection: ConnectionOptions = 
  parseRedisUrl(process.env.REDIS_URL!)

export const defaultJobOptions = {
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
}
