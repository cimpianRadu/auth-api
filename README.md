# Auth API

A secure authentication API built with Express.js, TypeScript, Prisma, and Clerk authentication.

## Features

- User authentication with Clerk
- Protected and public routes
- PostgreSQL database with Prisma ORM
- Docker support for easy deployment
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker and Docker Compose (optional)

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd auth-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start the development server:
```bash
npm run dev
```

### Docker Development

Run the application with Docker Compose:
```bash
docker-compose up --build
```

## Deployment

See [deployment.md](deployment.md) for detailed deployment instructions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run deploy:test` - Deploy to test environment
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client

## Project Structure

```
auth-api/
├── prisma/              # Database schema and migrations
├── src/
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   └── generated/      # Generated Prisma client
├── Dockerfile          # Docker configuration
└── docker-compose.yml  # Docker Compose configuration
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

ISC