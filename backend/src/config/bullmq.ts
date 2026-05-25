import { ConnectionOptions } from 'bullmq'

function parseRedisUrl(url: string): ConnectionOptions {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
    username: parsed.username || undefined,
    tls: parsed.protocol === 'rediss:' ? {} : undefined,
  }
}

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined')
}

export const redisConnection: ConnectionOptions =
  parseRedisUrl(process.env.REDIS_URL)

export const defaultJobOptions = {
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
}
