import { Category, ICategory } from '../models/Category';

const categoryData = [
  { name: 'Technology' },
  { name: 'Programming' },
  { name: 'Web Development' },
  { name: 'Mobile Development' },
  { name: 'Data Science' },
  { name: 'Artificial Intelligence' },
  { name: 'DevOps' },
  { name: 'Cybersecurity' },
  { name: 'Blockchain' },
  { name: 'Cloud Computing' }
];

export const seedCategories = async (): Promise<ICategory[]> => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');
    
    // Insert new categories
    const categories = await Category.insertMany(categoryData);
    console.log(`✅ Created ${categories.length} categories`);
    
    // Log created categories
    categories.forEach(category => {
      console.log(`  - ${category.name} (ID: ${category._id})`);
    });
    
    return categories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

export const clearCategories = async (): Promise<void> => {
  try {
    await Category.deleteMany({});
    console.log('🗑️ All categories cleared');
  } catch (error) {
    console.error('❌ Error clearing categories:', error);
    throw error;
  }
};
