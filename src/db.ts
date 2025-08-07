import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Connection management
async function connectWithRetry(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      // Test the connection
      await prisma.$connect();
      console.log("Successfully connected to database");
      return;
    } catch (error) {
      console.error(`Failed to connect to database (attempt ${i + 1}/${retries}):`, error);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to connect to database after multiple retries");
}

// Initialize connection
connectWithRetry().catch((error) => {
  console.error("Fatal database connection error:", error);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
