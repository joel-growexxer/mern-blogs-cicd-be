import { connectDB } from '../config/database';
import { seedUsers } from './userSeeder';
import { seedCategories } from './categorySeeder';
import { seedBlogs } from './blogSeeder';

const runSeeders = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Run seeders in order (users first, then categories, then blogs)
    console.log('👥 Seeding users...');
    await seedUsers();
    
    console.log('📂 Seeding categories...');
    const categories = await seedCategories();
    
    console.log('📝 Seeding blogs...');
    await seedBlogs(categories);
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeders();
}

export { runSeeders };
