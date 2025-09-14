import redisService from '../config/redis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for organization
}

export class CacheService {
  private static readonly DEFAULT_TTL = 3600; // 1 hour
  private static readonly DEFAULT_PREFIX = 'blogs:';

  /**
   * Generate a cache key with prefix
   */
  private static generateKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || this.DEFAULT_PREFIX;
    return `${keyPrefix}${key}`;
  }

  /**
   * Set a value in cache
   */
  static async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    if (!redisService.isReady()) {
      console.warn('⚠️ Redis not ready, skipping cache set');
      return;
    }

    const cacheKey = this.generateKey(key, options.prefix);
    const ttl = options.ttl || this.DEFAULT_TTL;

    try {
      await redisService.set(cacheKey, value, ttl);
    } catch (error) {
      console.error('❌ Cache set error:', error);
    }
  }

  /**
   * Get a value from cache
   */
  static async get<T = any>(key: string, prefix?: string): Promise<T | null> {
    if (!redisService.isReady()) {
      console.warn('⚠️ Redis not ready, skipping cache get');
      return null;
    }

    const cacheKey = this.generateKey(key, prefix);

    try {
      return await redisService.get(cacheKey);
    } catch (error) {
      console.error('❌ Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete a specific key from cache
   */
  static async del(key: string, prefix?: string): Promise<void> {
    if (!redisService.isReady()) {
      console.warn('⚠️ Redis not ready, skipping cache delete');
      return;
    }

    const cacheKey = this.generateKey(key, prefix);

    try {
      await redisService.del(cacheKey);
    } catch (error) {
      console.error('❌ Cache delete error:', error);
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  static async delPattern(pattern: string, prefix?: string): Promise<void> {
    if (!redisService.isReady()) {
      console.warn('⚠️ Redis not ready, skipping cache pattern delete');
      return;
    }

    const cachePattern = this.generateKey(pattern, prefix);

    try {
      await redisService.delPattern(cachePattern);
    } catch (error) {
      console.error('❌ Cache pattern delete error:', error);
    }
  }

  /**
   * Check if a key exists in cache
   */
  static async exists(key: string, prefix?: string): Promise<boolean> {
    if (!redisService.isReady()) {
      return false;
    }

    const cacheKey = this.generateKey(key, prefix);

    try {
      return await redisService.exists(cacheKey);
    } catch (error) {
      console.error('❌ Cache exists error:', error);
      return false;
    }
  }

  /**
   * Get or set cache with fallback function
   */
  static async getOrSet<T>(
    key: string,
    fallbackFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options.prefix);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, execute fallback function
    const result = await fallbackFn();
    
    // Store in cache
    await this.set(key, result, options);
    
    return result;
  }

  /**
   * Invalidate all blog-related cache
   */
  static async invalidateBlogCache(): Promise<void> {
    await this.delPattern('*', 'blogs:');
  }

  /**
   * Invalidate category-related cache
   */
  static async invalidateCategoryCache(): Promise<void> {
    await this.delPattern('*', 'categories:');
  }

  /**
   * Invalidate all cache
   */
  static async invalidateAllCache(): Promise<void> {
    if (!redisService.isReady()) {
      console.warn('⚠️ Redis not ready, skipping cache invalidation');
      return;
    }

    try {
      await redisService.flushAll();
    } catch (error) {
      console.error('❌ Cache invalidation error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats(): Promise<{
    isReady: boolean;
    totalKeys?: number;
  }> {
    const stats = {
      isReady: redisService.isReady(),
      totalKeys: undefined as number | undefined
    };

    if (stats.isReady) {
      try {
        const keys = await redisService.getClient().keys('*');
        stats.totalKeys = keys.length;
      } catch (error) {
        console.error('❌ Error getting cache stats:', error);
      }
    }

    return stats;
  }
}
