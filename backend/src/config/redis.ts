import Redis from 'ioredis'
import type { RedisOptions } from 'ioredis'

const redisUrl = process.env.REDIS_URL

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined')
}

const parsedRedisUrl = new URL(redisUrl)

const redisOptions: RedisOptions = {
  host: parsedRedisUrl.hostname,
  port: Number(parsedRedisUrl.port) || 6379,
  username: parsedRedisUrl.username || undefined,
  password: parsedRedisUrl.password ? decodeURIComponent(parsedRedisUrl.password) : undefined,
  tls: parsedRedisUrl.protocol === 'rediss:' ? { rejectUnauthorized: false } : undefined,
  maxRetriesPerRequest: null,
  lazyConnect: false,
  retryStrategy: (times) => Math.min(times * 500, 2000),
}

export const redis = new Redis(redisOptions)

redis.on('connect', () => console.log('✓ Redis connected'))
redis.on('error', (err) => console.error('Redis error:', err))

export default redis
