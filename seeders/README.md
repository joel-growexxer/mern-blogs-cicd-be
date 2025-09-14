# Database Seeders

This directory contains database seeder scripts to populate your database with sample data for development and testing purposes.

## Available Scripts

### Main Seeder
- `npm run seed` - Run the main seeder (seeds users, categories, and blogs)

### Individual Seeders
- `npm run seed:users` - Seed only users
- `npm run seed:categories` - Seed only categories
- `npm run seed:blogs` - Seed only blogs (requires categories to exist first)

### Advanced Seeder Scripts
- `npm run seed:run seed` - Seed all data (users, categories, and blogs)
- `npm run seed:run seed users` - Seed only users
- `npm run seed:run seed categories` - Seed only categories
- `npm run seed:run seed blogs` - Seed categories and blogs (categories required first)
- `npm run seed:run clear` - Clear all data
- `npm run seed:run clear users` - Clear only users
- `npm run seed:run clear categories` - Clear only categories
- `npm run seed:run clear blogs` - Clear only blogs

**Note**: The `runSeeder.ts` script provides fine-grained control over seeding operations.

## Sample Data

### Users (3 users)
- **admin@example.com** - Admin user (password: `password123`)
- **user1@example.com** - Regular user (password: `password123`)
- **user2@example.com** - Regular user (password: `password123`)

**Note**: All users have the same password for development convenience.

### Categories (10 categories)
- Technology
- Programming
- Web Development
- Mobile Development
- Data Science
- Artificial Intelligence
- DevOps
- Cybersecurity
- Blockchain
- Cloud Computing

### Blogs (10 blogs)
1. **Getting Started with Node.js and Express** - John Doe (Technology)
2. **Understanding MongoDB with Mongoose** - Jane Smith (Data Science)
3. **Building RESTful APIs with TypeScript** - Mike Johnson (Programming)
4. **Introduction to Docker for Developers** - Sarah Wilson (DevOps)
5. **Modern JavaScript: ES6+ Features** - Alex Brown (Programming)
6. **Building Scalable Microservices** - David Lee (Technology) *(unpublished)*
7. **Machine Learning Fundamentals** - Emily Chen (Artificial Intelligence)
8. **Web Security Best Practices** - Robert Garcia (Cybersecurity)
9. **Performance Optimization Techniques** - Lisa Wang (Web Development) *(unpublished)*
10. **The Future of Web Development** - Tom Anderson (Technology)

## Features

- **Rich Content**: Each blog contains detailed, realistic content with code examples
- **Proper Relationships**: Blogs are properly linked to categories
- **Mixed Publication Status**: Some blogs are published, others are drafts
- **Diverse Authors**: Multiple authors with different expertise areas
- **Realistic Tags**: Relevant tags for each blog post
- **Reading Time**: Automatically calculated based on content length

## Usage Examples

```bash
# Seed all data (users, categories, and blogs)
npm run seed

# Seed only users
npm run seed:run seed users

# Seed only categories
npm run seed:run seed categories

# Clear all data
npm run seed:run clear

# Clear only users
npm run seed:run clear users

# Clear only blogs
npm run seed:run clear blogs
```

## File Structure

```
seeders/
├── index.ts           # Main seeder entry point
├── userSeeder.ts      # User seeding logic
├── categorySeeder.ts  # Category seeding logic
├── blogSeeder.ts      # Blog seeding logic
├── runSeeder.ts       # Utility script for individual operations
└── README.md          # This documentation
```

## Notes

- The seeder will clear existing data before inserting new data
- Data is seeded in order: Users → Categories → Blogs (to maintain referential integrity)
- Blog categories are automatically assigned based on tags and content
- All blogs include realistic content with proper markdown formatting
- The seeder includes error handling and detailed logging
- Default password for all seeded users is `password123`
- Admin user has full access to all admin endpoints