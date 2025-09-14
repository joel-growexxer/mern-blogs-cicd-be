import { Request, Response, NextFunction } from 'express';
import redisService from '../config/redis';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export const createRateLimiter = (options: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      const key = `rate_limit:${clientIP}`;
      
      // Check if Redis is connected
      if (!redisService.isReady()) {
        console.warn('Redis not available, skipping rate limiting');
        return next();
      }

      const client = redisService.getClient();

      // Get current count (using raw Redis client to get string value)
      const current = await client.get(key);
      const currentCount = current ? parseInt(current) : 0;

      if (currentCount >= options.maxRequests) {
        // Rate limit exceeded
        const ttl = await client.ttl(key);
        const resetTime = ttl > 0 ? ttl : Math.floor(options.windowMs / 1000);

        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: resetTime
        });
      }

      // Increment counter
      if (currentCount === 0) {
        // First request in window
        await client.setEx(key, Math.floor(options.windowMs / 1000), '1');
      } else {
        // Increment existing counter
        await client.incr(key);
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': options.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, options.maxRequests - currentCount - 1).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + options.windowMs).toISOString()
      });

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // If rate limiting fails, allow the request to proceed
      next();
    }
  };
};

// Basic rate limiter: 100 requests per 15 minutes
export const basicRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100
});
