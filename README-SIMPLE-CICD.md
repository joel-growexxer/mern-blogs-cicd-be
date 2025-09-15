# Simple CI/CD Pipeline

A straightforward CI/CD pipeline that handles build, migration, and deployment.

## What it does

1. **Build**: Installs dependencies and builds the TypeScript application
2. **Migration**: Runs database seeders to set up initial data
3. **Deploy**: Deploys to your server using PM2

## Setup

### 1. GitHub Secrets
Add these secrets to your GitHub repository settings:

- `SERVER_HOST`: Your server IP address or domain
- `SERVER_USER`: SSH username for your server
- `SERVER_SSH_KEY`: Private SSH key content for server access

### 2. Server Setup
On your server, make sure you have:

```bash
# Install Node.js, npm, and PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Create project directory
sudo mkdir -p /var/www/blogs-backend
sudo chown $USER:$USER /var/www/blogs-backend

# Clone your repository
cd /var/www/blogs-backend
git clone <your-repo-url> .

# Install dependencies
npm ci --production
npm run build

# Start with PM2
pm2 start dist/server.js --name blogs-backend
pm2 save
pm2 startup
```

### 3. Environment Variables
Create `.env` file on your server:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogs
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## How it works

- **Pull Request**: Only runs the build job to verify code compiles
- **Push to main**: Runs build, then deploys to server
- **Deployment**: Pulls latest code, installs dependencies, builds, runs migrations, and restarts PM2

That's it! Simple and effective.
