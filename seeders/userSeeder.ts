import { User } from '../models/User';

// password is password123
const userData = [
  {
    email: 'admin@example.com',
    password: '$2b$12$ccARdj5jcGwstjdCfY6.A.KhjrZmdoVSp0q3A/yaBxJ30Bdrjn1iu',
    role: 'admin' as const
  },
  {
    email: 'user1@example.com',
    password: '$2b$12$ccARdj5jcGwstjdCfY6.A.KhjrZmdoVSp0q3A/yaBxJ30Bdrjn1iu',
    role: 'user' as const
  },
  {
    email: 'user2@example.com',
    password: '$2b$12$ccARdj5jcGwstjdCfY6.A.KhjrZmdoVSp0q3A/yaBxJ30Bdrjn1iu',
    role: 'user' as const
  }
];

export const seedUsers = async (): Promise<void> => {
  try {
    console.log('🌱 Starting user seeding...');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');
    
    // Insert new users
    const users = await User.insertMany(userData);
    console.log(`✅ Successfully seeded ${users.length} users`);
    
    // Log created users (without passwords)
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

export const clearUsers = async (): Promise<void> => {
  try {
    console.log('🗑️ Clearing users...');
    const result = await User.deleteMany({});
    console.log(`✅ Successfully cleared ${result.deletedCount} users`);
  } catch (error) {
    console.error('❌ Error clearing users:', error);
    throw error;
  }
};

// Run seeder directly if this file is executed
if (require.main === module) {
  import('../config/database').then(({ connectDB }) => {
    connectDB().then(() => {
      seedUsers().then(() => {
        console.log('🎉 User seeding completed');
        process.exit(0);
      }).catch((error) => {
        console.error('❌ User seeding failed:', error);
        process.exit(1);
      });
    });
  });
}
