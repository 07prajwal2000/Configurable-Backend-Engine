---
title: Installation & Setup
---

# Installation & Setup

This guide will help you get the Configurable Backend Engine up and running on your system. The engine consists of multiple components that work together to provide a complete low-code API development platform.

## 📋 Prerequisites

Before installing, ensure you have the following:

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 12.0 or higher
- **Git**: For cloning the repository

### Hardware Requirements
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: 500MB free space for installation
- **CPU**: Any modern processor (x64 architecture)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/07prajwal2000/Configurable-Backend-Engine.git
cd Configurable-Backend-Engine
```

### 2. Install Dependencies
```bash
# Install all dependencies (server, UI, and shared packages)
npm install
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb configurable_backend

# Or using psql
psql -U postgres -c "CREATE DATABASE configurable_backend;"
```

### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 5. Database Migration
```bash
# Run database migrations
npm run db:migrate
```

### 6. Start Development Server
```bash
# Start all services
npm run dev

# Or start individual services
npm run dev:server  # Start backend server
npm run dev:ui      # Start UI development server
```

### 7. Access the Application
- **UI Editor**: http://localhost:3000
- **API Documentation**: http://localhost:3001/_/admin/openapi/ui
- **API Base URL**: http://localhost:3001/_/admin

## ⚙️ Detailed Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/configurable_backend"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# JWT Configuration (if using authentication)
JWT_SECRET="your-super-secret-jwt-key-here"

# File Upload Configuration
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760

# Logging Configuration
LOG_LEVEL=info
LOG_FILE="./logs/app.log"
```

### Database Configuration

The application uses PostgreSQL with Drizzle ORM. Ensure your database user has the following permissions:

```sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE configurable_backend TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

### Port Configuration

By default, the services run on these ports:
- **UI**: 3000
- **Server**: 3001
- **Database**: 5432 (PostgreSQL default)

You can change these in the respective configuration files or environment variables.

## 🏗️ Project Structure

After installation, your project structure should look like this:

```
Configurable-Backend-Engine/
├── apps/
│   ├── server/          # Backend API server
│   └── ui/             # Frontend editor
├── packages/
│   ├── blocks/         # Block definitions and engine
│   └── lib/            # Shared utilities
├── docs/               # Documentation
├── docker/             # Docker configuration
├── .env                # Environment variables
├── package.json        # Root package configuration
└── turbo.json         # Monorepo configuration
```

## 🐳 Docker Installation (Alternative)

If you prefer using Docker:

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Setup
```bash
# Build the application
docker build -t configurable-backend .

# Run the container
docker run -p 3000:3000 -p 3001:3001 configurable-backend
```

## 🔧 Development Setup

### Installing Development Dependencies
```bash
# Install additional dev tools
npm install -g @types/node typescript nodemon
```

### Setting up VS Code
1. Install recommended extensions:
   - TypeScript and JavaScript Language Features
   - Prettier - Code formatter
   - ESLint

2. Configure workspace settings:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test -- --testPathPattern=blocks
```

## 🚀 Production Deployment

### Build for Production
```bash
# Build all packages
npm run build

# Build specific package
npm run build:server
npm run build:ui
```

### Environment Setup
```bash
# Set production environment
export NODE_ENV=production
export DATABASE_URL="postgresql://prod_user:prod_pass@prod_host:5432/prod_db"
```

### Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Or using systemd
sudo cp configurable-backend.service /etc/systemd/system/
sudo systemctl enable configurable-backend
sudo systemctl start configurable-backend
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql -U your_user -d configurable_backend -c "SELECT 1;"
```

#### Port Conflicts
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :3001

# Kill process using port
kill -9 <PID>
```

#### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean
npm run build
```

### Getting Help

- **Documentation**: Check the [docs](./../index.md) folder
- **Issues**: Report bugs on [GitHub Issues](https://github.com/07prajwal2000/Configurable-Backend-Engine/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/07prajwal2000/Configurable-Backend-Engine/discussions)

## 📋 System Requirements Check

Run this script to verify your system meets all requirements:

```bash
#!/bin/bash
echo "Checking system requirements..."

# Check Node.js version
node_version=$(node -v | sed 's/v//')
required_version="18.0.0"
if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ Node.js version: $node_version"
else
    echo "❌ Node.js version $node_version is below required $required_version"
fi

# Check npm version
npm_version=$(npm -v)
required_npm="8.0.0"
if [ "$(printf '%s\n' "$required_npm" "$npm_version" | sort -V | head -n1)" = "$required_npm" ]; then
    echo "✅ npm version: $npm_version"
else
    echo "❌ npm version $npm_version is below required $required_npm"
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
else
    echo "❌ PostgreSQL is not installed"
fi

echo "System check complete!"
```

## 🎯 Next Steps

After successful installation:

1. **Explore the UI**: Visit http://localhost:3000 to see the visual editor
2. **Read the Documentation**: Check out [block documentation](./../blocks/index.md)
3. **Create Your First API**: Follow the [quick start guide](./../index.md#quick-start)
4. **Join the Community**: Connect with other users and contributors

## 📞 Support

- **Documentation**: [Full Documentation](./../index.md)
- **API Reference**: [OpenAPI Specification](./../concepts/context.md#api-reference)
- **Community**: [GitHub Discussions](https://github.com/07prajwal2000/Configurable-Backend-Engine/discussions)
- **Issues**: [GitHub Issues](https://github.com/07prajwal2000/Configurable-Backend-Engine/issues)

Happy coding with the Configurable Backend Engine! 🚀
