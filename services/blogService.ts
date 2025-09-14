import { Blog, IBlog } from '../models/Blog';
import { Category } from '../models/Category';
import { CacheService } from '../utils/cacheService';

const BlogCacheConfig = {
  ttl: 1800,
  prefix: 'blogs:'
}

export class BlogService {
  // Get all blogs with optional filtering and pagination
  static async getAllBlogs(query: any = {}): Promise<{ blogs: IBlog[], total: number, page: number, limit: number }> {
    const { 
      author, 
      tag, 
      search, 
      category, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;
    
    // Create cache key based on query parameters
    const cacheKey = `blogs:list:${JSON.stringify(query)}`;

    return await CacheService.getOrSet(
      cacheKey,
      async () => {
        let filter: any = {};
        
        if (author) {
          filter.author = { $regex: author, $options: 'i' };
        }
        
        if (tag) {
          filter.tags = { $in: [tag] };
        }
        
        if (category) {
          filter.category = category;
        }
        
        if (search) {
          filter.$text = { $search: search };
        }
        
        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Use lean() for better performance when you don't need Mongoose document methods
        const [blogs, total] = await Promise.all([
          Blog.find(filter)
            .populate('category', 'name')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v')
            .lean(),
          Blog.countDocuments(filter)
        ]);
        
        return {
          blogs,
          total,
          page: parseInt(page),
          limit: parseInt(limit)
        };
      },
      BlogCacheConfig
    );
  }

  // Get blog by ID with optimized query
  static async getBlogById(id: string): Promise<IBlog | null> {
    const cacheKey = `blog:${id}`;
    
    return await CacheService.getOrSet(
      cacheKey,
      async () => {
        return await Blog.findById(id)
          .populate('category', 'name')
          .select('-__v')
          .lean();
      },
      BlogCacheConfig
    );
  }

  // Create new blog
  static async createBlog(blogData: Partial<IBlog>): Promise<IBlog> {
    // Validate category exists
    if (blogData.category) {
      const categoryExists = await Category.findById(blogData.category).lean();
      if (!categoryExists) {
        throw new Error('Category not found');
      }
    }
    
    const blog = new Blog(blogData);
    const savedBlog = await blog.save();
    
    // Return populated blog
    const populatedBlog = await Blog.findById(savedBlog._id)
      .populate('category', 'name')
      .select('-__v');
    
    if (!populatedBlog) {
      throw new Error('Failed to create blog');
    }
    
    // Invalidate related cache
    await CacheService.invalidateBlogCache();
    
    return populatedBlog;
  }

  // Update blog with optimized query
  static async updateBlog(id: string, updateData: Partial<IBlog>): Promise<IBlog | null> {
    // Validate category exists if being updated
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category).lean();
      if (!categoryExists) {
        throw new Error('Category not found');
      }
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category', 'name')
    .select('-__v')
    .lean();
    
    if (updatedBlog) {
      // Invalidate specific blog cache and related caches
      await Promise.all([
        CacheService.del(`blog:${id}`, 'blogs:'),
        CacheService.invalidateBlogCache()
      ]);
    }
    
    return updatedBlog;
  }

  // Delete blog
  static async deleteBlog(id: string): Promise<IBlog | null> {
    const deletedBlog = await Blog.findByIdAndDelete(id).lean();
    
    if (deletedBlog) {
      // Invalidate related cache
      await Promise.all([
        CacheService.del(`blog:${id}`, 'blogs:'),
        CacheService.invalidateBlogCache()
      ]);
    }
    
    return deletedBlog;
  }
}
