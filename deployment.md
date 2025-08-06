# Deployment Guide for Testing Environment

## Prerequisites

1. Node.js (v18 or higher)
2. PostgreSQL database instance
3. Clerk account and API keys
4. Environment variables

## Environment Setup

Create a `.env.test` file in the root directory with the following variables:

```env
# Node environment
NODE_ENV=test
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/auth_api_test

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUB_KEY=your_clerk_pub_key

# JWT (if using)
JWT_SECRET=your_jwt_secret
```

## Database Setup

1. Create a new PostgreSQL database for testing:

```sql
CREATE DATABASE auth_api_test;
```

2. Run database migrations:

```bash
npx prisma migrate deploy
```

## Build and Start

1. Install dependencies:

```bash
npm install
```

2. Build the application:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

## Deployment Options

### 1. Manual Deployment

- Set up a Linux/Unix server
- Install Node.js and PostgreSQL
- Clone the repository
- Follow the setup steps above
- Use PM2 or similar for process management

### 2. Docker Deployment

Create a Dockerfile in the root directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

RUN npm install
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t auth-api:test .
docker run -p 3000:3000 --env-file .env.test auth-api:test
```

### 3. Cloud Platforms

The application can be deployed to:

- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run
- Railway.app

Choose based on your needs and budget.

## Health Checks

The application should implement health check endpoints:

- `/health` - Basic application health
- `/health/db` - Database connectivity
- `/health/auth` - Authentication service status

## Monitoring

Consider setting up:

1. Application monitoring (e.g., New Relic, Datadog)
2. Error tracking (e.g., Sentry)
3. Log management (e.g., ELK Stack, Papertrail)

## Backup and Recovery

1. Regular database backups
2. Application logs backup
3. Environment configuration backup

## Security Considerations

1. Enable CORS with appropriate origins
2. Set up rate limiting
3. Use HTTPS
4. Implement proper error handling
5. Regular security updates
