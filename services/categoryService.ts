import { Category, ICategory } from '../models/Category';
import { CacheService } from '../utils/cacheService';

export class CategoryService {
  // Get all categories
  static async getAllCategories(): Promise<ICategory[]> {
    const cacheKey = 'categories:all';
    
    return await CacheService.getOrSet(
      cacheKey,
      async () => {
        return await Category.find()
          .sort({ name: 1 })
          .select('-__v')
          .lean();
      },
      { ttl: 3600, prefix: 'categories:' } // Cache for 1 hour
    );
  }

  // Get category by ID
  static async getCategoryById(id: string): Promise<ICategory | null> {
    const cacheKey = `category:${id}`;
    
    return await CacheService.getOrSet(
      cacheKey,
      async () => {
        return await Category.findById(id)
          .select('-__v')
          .lean();
      },
      { ttl: 3600, prefix: 'categories:' } // Cache for 1 hour
    );
  }

  // Create new category
  static async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    
    // Invalidate category cache
    await CacheService.invalidateCategoryCache();
    
    return savedCategory;
  }

  // Update category
  static async updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .select('-__v')
    .lean();
    
    if (updatedCategory) {
      // Invalidate specific category cache and related caches
      await Promise.all([
        CacheService.del(`category:${id}`, 'categories:'),
        CacheService.invalidateCategoryCache()
      ]);
    }
    
    return updatedCategory;
  }

  // Delete category
  static async deleteCategory(id: string): Promise<ICategory | null> {
    const deletedCategory = await Category.findByIdAndDelete(id).lean();
    
    if (deletedCategory) {
      // Invalidate related cache
      await Promise.all([
        CacheService.del(`category:${id}`, 'categories:'),
        CacheService.invalidateCategoryCache()
      ]);
    }
    
    return deletedCategory;
  }
}
