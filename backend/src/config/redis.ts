import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL

export const redis = new Redis(redisUrl!, {
  tls: redisUrl?.startsWith('rediss://') 
    ? { rejectUnauthorized: false } 
    : undefined,
  maxRetriesPerRequest: null,
  lazyConnect: false,
})

redis.on('connect', () => console.log('✓ Redis connected'))
redis.on('error', (err) => console.error('Redis error:', err))

export default redis
