import { connectDB } from '../config/database';
import { seedUsers, clearUsers } from './userSeeder';
import { seedCategories, clearCategories } from './categorySeeder';
import { seedBlogs, clearBlogs } from './blogSeeder';

const command = process.argv[2];
const target = process.argv[3];

const runCommand = async (): Promise<void> => {
  try {
    await connectDB();
    
    switch (command) {
      case 'seed':
        if (target === 'users') {
          await seedUsers();
        } else if (target === 'categories') {
          await seedCategories();
        } else if (target === 'blogs') {
          const categories = await seedCategories();
          await seedBlogs(categories);
        } else {
          console.log('🌱 Seeding all data...');
          await seedUsers();
          const categories = await seedCategories();
          await seedBlogs(categories);
        }
        break;
        
      case 'clear':
        if (target === 'users') {
          await clearUsers();
        } else if (target === 'categories') {
          await clearCategories();
        } else if (target === 'blogs') {
          await clearBlogs();
        } else {
          console.log('🗑️ Clearing all data...');
          await clearBlogs();
          await clearCategories();
          await clearUsers();
        }
        break;
        
      default:
        console.log('Usage:');
        console.log('  npm run seed:run seed [users|categories|blogs]  - Seed data');
        console.log('  npm run seed:run clear [users|categories|blogs] - Clear data');
        console.log('  npm run seed:run seed                            - Seed all data');
        console.log('  npm run seed:run clear                           - Clear all data');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

runCommand();
