# MERN Blogs Backend

Express.js backend with MongoDB and Redis caching for a blog application.

## 🏗️ Architecture

![Architecture Diagram](./arch_diagram.png)

## Features

- Express.js with TypeScript
- MongoDB with Mongoose
- Redis caching layer with automatic invalidation
- JWT-based authentication
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Rate limiting with Redis
- CORS configuration
- Security headers with Helmet
- Request logging with Morgan
- Swagger API documentation
- Comprehensive error handling
- Database seeding utilities
- Cache middleware for performance optimization

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Dependencies are already included** - All required dependencies including authentication packages are already in package.json

3. **Set up environment:**
Create a `.env` file in the root directory:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blogs-demo
REDIS_URL=redis://localhost:6379
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY_MINUTES=15
FRONTEND_URL=http://localhost:3000
```

4. **Start services:**
```bash
# Start Redis
redis-server

# Start MongoDB (if not running)
mongod

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

## API Endpoints

### Blogs
- `GET /api/blogs` - Get blogs (with filtering, pagination, sorting)
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (requires auth)
- `POST /api/auth/logout` - User logout (requires auth)
- `GET /api/auth/users` - Get all users (admin only)

### Health
- `GET /health` - Server health status

## Database Seeding

```bash
npm run seed              # Run all seeders (users, categories, blogs)
npm run seed:users        # Seed users only
npm run seed:categories   # Seed categories only
npm run seed:blogs        # Seed blogs only
npm run seed:run          # Interactive seeder utility
npm run seed:clear        # Clear and reseed all data
```

## Scripts

### Development & Production
- `npm run dev` - Development server with ts-node
- `npm start` - Production server (requires build)
- `npm run build` - Build TypeScript to JavaScript
- `npm test` - Run tests (placeholder)

### Database Seeding
- `npm run seed` - Run all seeders (users, categories, blogs)
- `npm run seed:users` - Seed users only
- `npm run seed:categories` - Seed categories only  
- `npm run seed:blogs` - Seed blogs only
- `npm run seed:run` - Interactive seeder utility
- `npm run seed:clear` - Clear and reseed all data

## Caching

The application uses Redis for performance optimization with automatic caching and invalidation:

### How It Works
- **Automatic Caching**: Frequently accessed data is automatically cached
- **Smart Invalidation**: Cache is automatically cleared when data is updated/deleted
- **Graceful Fallback**: App works normally even if Redis is unavailable
- **TTL Management**: Different cache durations for different data types

### Cache Strategy
- **Blog Lists**: 30 minutes (with query parameters)
- **Individual Blogs**: 1 hour
- **Categories**: 1 hour
- **Automatic Invalidation**: Cache cleared on data changes



### Cache Keys Structure
- `blogs:list:{query}` - Blog list queries with filters
- `blogs:blog:{id}` - Individual blog posts
- `categories:all` - All categories list
- `categories:category:{id}` - Individual categories
- `auth:user:{id}` - User authentication data

### Cache Features
- **Pattern-based deletion** for related data
- **Prefix organization** (blogs:, categories:)
- **Error handling** with graceful degradation
- **Statistics tracking** for monitoring

## API Documentation

Access Swagger docs at: `http://localhost:3000/api-docs`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/blogs-demo` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key` |
| `JWT_EXPIRY_MINUTES` | JWT expiration time in minutes | `15` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Authentication

The application uses JWT-based authentication with the following features:

### User Roles
- **User**: Regular user with basic access
- **Admin**: Administrative user with full access

### Default Test Users
After running `npm run seed:users`, you can use these test accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `password123` | admin |
| `user1@example.com` | `password123` | user |
| `user2@example.com` | `password123` | user |

### Authentication Flow
1. **Signup**: `POST /api/auth/signup` with email, password, and optional role
2. **Login**: `POST /api/auth/login` with email and password
3. **Access Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Logout**: `POST /api/auth/logout` to invalidate cached user data

### Protected Routes
- All routes requiring authentication need `Authorization: Bearer <token>` header
- Admin-only routes require user to have `admin` role

## Security Features

### Rate Limiting
The application implements Redis-based rate limiting:
- **Default**: 100 requests per 15 minutes per IP
- **Graceful Degradation**: If Redis is unavailable, requests proceed without limiting
- **IP-based Tracking**: Uses client IP address for rate limiting

### CORS Configuration
- **Configurable Origins**: Set `FRONTEND_URL` environment variable
- **Default Origins**: `localhost:3000`, `localhost:3001`, `localhost:5173`
- **Credentials Support**: Allows credentials in cross-origin requests
- **Method Restrictions**: GET, POST, PUT, DELETE, OPTIONS

### Security Headers
- **Helmet.js**: Automatically sets security headers
- **Content Security Policy**: Basic CSP headers
- **XSS Protection**: Built-in XSS filtering

### Error Handling
- **Custom Error Types**: Structured error responses
- **Development vs Production**: Stack traces only in development
- **Mongoose Error Handling**: Automatic handling of validation and cast errors
- **404 Handler**: Custom not found middleware

## Project Structure

```
blogs-ci-cd-be/
├── config/
│   ├── database.ts          # MongoDB connection setup
│   └── redis.ts             # Redis connection and service
├── middlewares/
│   ├── authMiddleware.ts     # JWT authentication middleware
│   ├── cacheMiddleware.ts    # Cache handling middleware
│   ├── errorHandler.ts      # Global error handling
│   ├── notFound.ts          # 404 handler
│   └── rateLimiter.ts       # Redis-based rate limiting
├── models/
│   ├── Blog.ts              # Blog schema and model
│   ├── Category.ts          # Category schema and model
│   └── User.ts              # User schema and model
├── routes/
│   ├── authRoutes.ts        # Authentication endpoints
│   ├── blogRoutes.ts        # Blog CRUD endpoints
│   └── categoryRoutes.ts    # Category CRUD endpoints
├── services/
│   ├── authService.ts       # Authentication business logic
│   ├── blogService.ts       # Blog business logic
│   └── categoryService.ts   # Category business logic
├── seeders/
│   ├── index.ts             # Main seeder runner
│   ├── userSeeder.ts        # User data seeding
│   ├── categorySeeder.ts    # Category data seeding
│   ├── blogSeeder.ts        # Blog data seeding
│   ├── runSeeder.ts         # Interactive seeder utility
│   └── README.md            # Seeder documentation
├── swagger/
│   └── swagger.json         # OpenAPI 3.0 specification
├── utils/
│   ├── cacheService.ts      # Redis caching utilities
│   └── responseHandler.ts   # Response formatting utilities
├── server.ts                # Express server setup
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This documentation
```

## Development Tips

1. **Environment Setup**: Always set up your `.env` file first
2. **Redis Dependency**: The app gracefully handles Redis being unavailable
3. **Database Seeding**: Run seeders to get sample data for development
4. **API Testing**: Use the Swagger UI at `/api-docs` for testing endpoints
5. **Authentication**: Use the seeded admin account for testing admin features
6. **Caching**: Monitor cache performance through the health endpoint

## Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use MongoDB Atlas or a production MongoDB instance
3. **Redis**: Use Redis Cloud or a production Redis instance
4. **Security**: Change JWT_SECRET to a strong, random value
5. **CORS**: Configure FRONTEND_URL for your production domain
6. **Rate Limiting**: Adjust rate limits based on your needs
7. **Logging**: Consider adding structured logging for production monitoring
