import { Blog, IBlog } from '../models/Blog';
import { ICategory } from '../models/Category';

const blogData = [
  {
    title: 'Getting Started with Node.js and Express',
    content: `Node.js has revolutionized the way we build web applications. In this comprehensive guide, we'll explore how to create a robust REST API using Node.js and Express.js.

## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server-side, enabling full-stack JavaScript development.

## Why Express.js?

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building APIs and web applications.

## Key Features

- **Fast and unopinionated**: Express provides a thin layer of fundamental web application features
- **Middleware support**: Extensible through middleware functions
- **Routing**: Simple and flexible routing system
- **Template engines**: Support for various template engines
- **Static files**: Built-in support for serving static files

## Getting Started

To get started with Express.js, you'll need to:

1. Install Node.js
2. Initialize a new project
3. Install Express
4. Create your first server

This is just the beginning of your Node.js journey!`,
    author: 'John Doe',
    tags: ['nodejs', 'express', 'javascript', 'api']
  },
  {
    title: 'Understanding MongoDB with Mongoose',
    content: `MongoDB is a popular NoSQL database that works seamlessly with Node.js applications. When combined with Mongoose, it provides a powerful and flexible data modeling solution.

## What is MongoDB?

MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents. It's designed for scalability and performance, making it ideal for modern web applications.

## Why Mongoose?

Mongoose is an elegant MongoDB object modeling for Node.js. It provides:

- **Schema-based solution**: Define your data structure with schemas
- **Validation**: Built-in validation for your data
- **Query building**: Powerful query API
- **Middleware**: Pre and post hooks for operations
- **Type casting**: Automatic type casting

## Basic Schema Definition

\`\`\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 }
});
\`\`\`

## CRUD Operations

Mongoose makes it easy to perform CRUD operations:

- **Create**: Use \`save()\` or \`create()\`
- **Read**: Use \`find()\`, \`findOne()\`, \`findById()\`
- **Update**: Use \`updateOne()\`, \`updateMany()\`, \`findByIdAndUpdate()\`
- **Delete**: Use \`deleteOne()\`, \`deleteMany()\`, \`findByIdAndDelete()\`

MongoDB and Mongoose together provide a powerful foundation for building scalable applications.`,
    author: 'Jane Smith',
    tags: ['mongodb', 'mongoose', 'database', 'nosql']
  },
  {
    title: 'Building RESTful APIs with TypeScript',
    content: `TypeScript has become the standard for building large-scale applications. In this article, we'll explore how to build robust RESTful APIs using TypeScript and Express.

## Why TypeScript?

TypeScript is a superset of JavaScript that adds static typing. This provides several benefits:

- **Better IDE support**: Enhanced autocomplete and error detection
- **Catch errors early**: Type checking at compile time
- **Better documentation**: Types serve as documentation
- **Refactoring support**: Safer refactoring with type checking

## Setting Up TypeScript

To set up TypeScript in your Node.js project:

1. Install TypeScript and type definitions
2. Configure tsconfig.json
3. Set up build scripts
4. Configure your IDE

## Type Definitions

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface CreateUserRequest {
  name: string;
  email: string;
}
\`\`\`

## Express with TypeScript

\`\`\`typescript
import express, { Request, Response } from 'express';

const app = express();

app.get('/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  // Your logic here
});
\`\`\`

TypeScript makes your code more maintainable and less prone to runtime errors.`,
    author: 'Mike Johnson',
    tags: ['typescript', 'api', 'express', 'javascript']
  },
  {
    title: 'Introduction to Docker for Developers',
    content: `Docker has revolutionized the way we deploy and manage applications. In this guide, we'll explore the basics of Docker and how it can improve your development workflow.

## What is Docker?

Docker is a platform for developing, shipping, and running applications in containers. Containers are lightweight, portable, and self-sufficient units that can run anywhere Docker is installed.

## Benefits of Docker

- **Consistency**: Same environment across development, testing, and production
- **Isolation**: Applications run in isolated containers
- **Portability**: Run anywhere Docker is available
- **Scalability**: Easy to scale applications horizontally
- **Version control**: Version your application environment

## Basic Docker Commands

\`\`\`bash
# Build an image
docker build -t my-app .

# Run a container
docker run -p 3000:3000 my-app

# List containers
docker ps

# Stop a container
docker stop <container-id>
\`\`\`

## Dockerfile Example

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

Docker simplifies the deployment process and ensures consistency across environments.`,
    author: 'Sarah Wilson',
    tags: ['docker', 'containers', 'devops', 'deployment']
  },
  {
    title: 'Modern JavaScript: ES6+ Features You Should Know',
    content: `JavaScript has evolved significantly over the years. ES6 (ES2015) and subsequent versions have introduced powerful features that make JavaScript more expressive and easier to work with.

## Arrow Functions

Arrow functions provide a concise syntax for writing function expressions:

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

## Destructuring

Destructuring allows you to extract values from objects and arrays:

\`\`\`javascript
// Object destructuring
const { name, age } = user;

// Array destructuring
const [first, second, ...rest] = array;
\`\`\`

## Template Literals

Template literals provide an elegant way to create strings:

\`\`\`javascript
const name = 'John';
const greeting = \`Hello, \${name}! Welcome to our platform.\`;
\`\`\`

## Async/Await

Async/await makes asynchronous code more readable:

\`\`\`javascript
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
\`\`\`

## Modules

ES6 modules provide a standardized way to organize code:

\`\`\`javascript
// Export
export const add = (a, b) => a + b;
export default class Calculator {}

// Import
import Calculator, { add } from './calculator.js';
\`\`\`

These features make JavaScript more powerful and enjoyable to work with.`,
    author: 'Alex Brown',
    tags: ['javascript', 'es6', 'modern-js', 'programming']
  },
  {
    title: 'Building Scalable Microservices Architecture',
    content: `Microservices architecture has become the preferred approach for building large-scale applications. In this comprehensive guide, we'll explore the principles and best practices of microservices.

## What are Microservices?

Microservices is an architectural style where an application is built as a collection of small, independent services that communicate over well-defined APIs.

## Benefits of Microservices

- **Scalability**: Scale individual services independently
- **Maintainability**: Easier to maintain and update individual services
- **Technology diversity**: Use different technologies for different services
- **Fault isolation**: Failure in one service doesn't affect others
- **Team autonomy**: Teams can work independently on different services

## Key Principles

1. **Single Responsibility**: Each service should have a single, well-defined responsibility
2. **Loose Coupling**: Services should be loosely coupled and communicate through APIs
3. **High Cohesion**: Related functionality should be grouped together
4. **Independent Deployment**: Services should be deployable independently

## Communication Patterns

- **Synchronous**: REST APIs, gRPC
- **Asynchronous**: Message queues, event-driven architecture
- **Service Discovery**: Dynamic service registration and discovery

## Challenges and Solutions

- **Distributed system complexity**: Use proper monitoring and logging
- **Data consistency**: Implement eventual consistency patterns
- **Network latency**: Use caching and optimization strategies
- **Testing complexity**: Implement comprehensive testing strategies

Microservices provide the flexibility and scalability needed for modern applications.`,
    author: 'David Lee',
    tags: ['microservices', 'architecture', 'scalability', 'api']
  },
  {
    title: 'Machine Learning Fundamentals for Developers',
    content: `Machine learning is transforming the way we build applications. In this article, we'll explore the fundamentals of machine learning and how developers can integrate ML into their applications.

## What is Machine Learning?

Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed for every scenario.

## Types of Machine Learning

1. **Supervised Learning**: Learning from labeled training data
2. **Unsupervised Learning**: Finding patterns in unlabeled data
3. **Reinforcement Learning**: Learning through interaction with an environment

## Popular ML Libraries

- **TensorFlow**: Google's open-source ML library
- **PyTorch**: Facebook's ML framework
- **Scikit-learn**: Python library for traditional ML algorithms
- **Keras**: High-level neural network API

## Getting Started with ML

\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make predictions
predictions = model.predict([[6]])
print(predictions)  # [12.]
\`\`\`

## Integration with Web Applications

- **API-based integration**: Expose ML models as REST APIs
- **Real-time processing**: Process data in real-time
- **Batch processing**: Process large datasets offline

Machine learning opens up new possibilities for creating intelligent applications.`,
    author: 'Emily Chen',
    tags: ['machine-learning', 'ai', 'python', 'data-science']
  },
  {
    title: 'Web Security Best Practices for Developers',
    content: `Security is a critical aspect of web development that should not be overlooked. In this guide, we'll explore essential security practices that every developer should implement.

## Common Security Threats

1. **SQL Injection**: Malicious SQL code injection
2. **Cross-Site Scripting (XSS)**: Executing malicious scripts
3. **Cross-Site Request Forgery (CSRF)**: Unauthorized actions
4. **Authentication vulnerabilities**: Weak authentication mechanisms
5. **Data exposure**: Sensitive data leaks

## Security Best Practices

### Input Validation
Always validate and sanitize user input:

\`\`\`javascript
// Bad
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// Good
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
\`\`\`

### Authentication and Authorization
- Use strong password policies
- Implement multi-factor authentication
- Use JWT tokens with proper expiration
- Implement role-based access control

### Data Protection
- Encrypt sensitive data at rest and in transit
- Use HTTPS for all communications
- Implement proper session management
- Regular security audits

### Content Security Policy
Implement CSP headers to prevent XSS attacks:

\`\`\`javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
\`\`\`

Security should be a priority from the beginning of development.`,
    author: 'Robert Garcia',
    tags: ['security', 'web-security', 'authentication', 'cybersecurity']
  },
  {
    title: 'Performance Optimization Techniques for Web Applications',
    content: `Performance is crucial for user experience and business success. In this article, we'll explore various techniques to optimize web application performance.

## Frontend Optimization

### Code Splitting
Split your JavaScript bundles to load only what's needed:

\`\`\`javascript
// React example
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

### Image Optimization
- Use modern image formats (WebP, AVIF)
- Implement lazy loading
- Use appropriate image sizes
- Compress images without quality loss

### Caching Strategies
- Browser caching with proper headers
- Service worker caching
- CDN caching for static assets

## Backend Optimization

### Database Optimization
- Use proper indexing
- Optimize queries
- Implement connection pooling
- Use database caching (Redis)

### API Optimization
- Implement pagination
- Use compression (gzip)
- Cache frequently accessed data
- Optimize response payloads

## Monitoring and Metrics

- **Core Web Vitals**: LCP, FID, CLS
- **Server response times**: Monitor API performance
- **Error rates**: Track and fix errors quickly
- **User experience metrics**: Real user monitoring

Performance optimization is an ongoing process that requires continuous monitoring and improvement.`,
    author: 'Lisa Wang',
    tags: ['performance', 'optimization', 'web-development', 'frontend']
  },
  {
    title: 'The Future of Web Development: Trends to Watch',
    content: `Web development is constantly evolving with new technologies and trends emerging regularly. In this article, we'll explore the key trends that are shaping the future of web development.

## Emerging Technologies

### WebAssembly (WASM)
WebAssembly allows running high-performance code in browsers:

\`\`\`javascript
// Example of using WASM
WebAssembly.instantiateStreaming(fetch('app.wasm'))
  .then(obj => {
    const result = obj.instance.exports.add(1, 2);
    console.log(result); // 3
  });
\`\`\`

### Progressive Web Apps (PWAs)
PWAs provide native app-like experience:

- Offline functionality
- Push notifications
- App-like interface
- Fast loading times

### Serverless Architecture
Serverless computing is gaining popularity:

- Automatic scaling
- Pay-per-use pricing
- Reduced operational overhead
- Focus on business logic

## Development Trends

### TypeScript Adoption
TypeScript is becoming the standard for large applications:

- Better developer experience
- Improved code quality
- Enhanced tooling support
- Growing ecosystem

### Component-Driven Development
- Reusable components
- Design systems
- Storybook for component documentation
- Consistent user experience

### AI-Powered Development
- Code generation with AI
- Automated testing
- Intelligent debugging
- Performance optimization

## Future Outlook

The future of web development is focused on:

- **Performance**: Faster, more efficient applications
- **Accessibility**: Inclusive design for all users
- **Security**: Enhanced security measures
- **Sustainability**: Environmentally conscious development

Staying updated with these trends is essential for modern web developers.`,
    author: 'Tom Anderson',
    tags: ['web-development', 'trends', 'future', 'technology']
  }
];

export const seedBlogs = async (categories: ICategory[]): Promise<any[]> => {
  try {
    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('🗑️ Cleared existing blogs');
    
    // Map categories to blog data
    const categoryMap = new Map(categories.map(cat => [cat.name.toLowerCase(), cat._id]));
    
    const blogsWithCategories = blogData.map(blog => {
      // Assign a category based on tags or content
      let categoryId = categoryMap.get('technology'); // default
      
      if (blog.tags.includes('mongodb') || blog.tags.includes('database')) {
        categoryId = categoryMap.get('data science');
      } else if (blog.tags.includes('docker') || blog.tags.includes('devops')) {
        categoryId = categoryMap.get('devops');
      } else if (blog.tags.includes('security') || blog.tags.includes('cybersecurity')) {
        categoryId = categoryMap.get('cybersecurity');
      } else if (blog.tags.includes('machine-learning') || blog.tags.includes('ai')) {
        categoryId = categoryMap.get('artificial intelligence');
      } else if (blog.tags.includes('typescript') || blog.tags.includes('javascript')) {
        categoryId = categoryMap.get('programming');
      } else if (blog.tags.includes('web-development') || blog.tags.includes('frontend')) {
        categoryId = categoryMap.get('web development');
      }
      
      // Ensure we have a valid category ID
      if (!categoryId) {
        console.warn(`⚠️ No category found for blog "${blog.title}", using default Technology category`);
        categoryId = categoryMap.get('technology');
      }
      
      return {
        ...blog,
        category: categoryId
      };
    });
    
    // Insert blogs
    const blogs = await Blog.insertMany(blogsWithCategories);
    console.log(`✅ Created ${blogs.length} blogs`);
    
    // Log created blogs with their categories
    blogs.forEach(blog => {
      const category = categories.find(cat => (cat._id as any).toString() === (blog.category as any).toString());
      console.log(`  - "${blog.title}" by ${blog.author} (Category: ${category?.name})`);
    });
    
    return blogs;
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    throw error;
  }
};

export const clearBlogs = async (): Promise<void> => {
  try {
    await Blog.deleteMany({});
    console.log('🗑️ All blogs cleared');
  } catch (error) {
    console.error('❌ Error clearing blogs:', error);
    throw error;
  }
};
