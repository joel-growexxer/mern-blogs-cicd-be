import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../utils/cacheService';

export interface CacheMiddlewareOptions {
  ttl?: number;
  prefix?: string;
  keyGenerator?: (req: Request) => string;
  shouldCache?: (req: Request, res: Response) => boolean;
}

/**
 * Middleware for automatic caching of API responses
 */
export const cacheMiddleware = (options: CacheMiddlewareOptions = {}) => {
  const {
    ttl = 1800, // 30 minutes default
    prefix = 'api:',
    keyGenerator = defaultKeyGenerator,
    shouldCache = defaultShouldCache
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Check if we should cache this request
    if (!shouldCache(req, res)) {
      return next();
    }

    const cacheKey = keyGenerator(req);

    try {
      // Try to get from cache
      const cachedResponse = await CacheService.get(cacheKey, prefix);
      
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // If not in cache, intercept the response
      const originalJson = res.json;
      res.json = function(data: any) {
        // Store in cache
        CacheService.set(cacheKey, data, { ttl, prefix }).catch(error => {
          console.error('❌ Cache middleware error:', error);
        });
        
        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('❌ Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Default key generator for cache keys
 */
function defaultKeyGenerator(req: Request): string {
  const { url, query } = req;
  const queryString = Object.keys(query).length > 0 ? JSON.stringify(query) : '';
  return `${url}${queryString}`;
}

/**
 * Default function to determine if response should be cached
 */
function defaultShouldCache(req: Request, res: Response): boolean {
  // Don't cache if there's an error
  if (res.statusCode >= 400) {
    return false;
  }
  
  // Don't cache if response is too large (over 1MB)
  const contentLength = res.get('Content-Length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) {
    return false;
  }
  
  return true;
}

/**
 * Middleware to invalidate cache for specific patterns
 */
export const invalidateCacheMiddleware = (patterns: string[], prefix?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    
    res.json = function(data: any) {
      // Invalidate cache patterns after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patterns.forEach(pattern => {
          CacheService.delPattern(pattern, prefix).catch(error => {
            console.error(`❌ Cache invalidation error for pattern ${pattern}:`, error);
          });
        });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to add cache headers to response
 */
export const cacheHeadersMiddleware = (maxAge: number = 1800) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${maxAge}`);
      res.set('ETag', `"${Date.now()}"`);
    } else {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
    
    next();
  };
};
