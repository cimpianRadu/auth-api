import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "Getting Started with TypeScript",
    body: "TypeScript is a powerful superset of JavaScript that adds static typing...",
    author: "John Doe",
    isPublic: true,
  },
  {
    title: "Understanding REST APIs",
    body: "REST (Representational State Transfer) is an architectural style for designing networked applications...",
    author: "Jane Smith",
    isPublic: true,
  },
  {
    title: "Introduction to Docker",
    body: "Docker is a platform for developing, shipping, and running applications in containers...",
    author: "Mike Johnson",
    isPublic: true,
  },
  {
    title: "PostgreSQL Best Practices",
    body: "When working with PostgreSQL, it's important to follow these best practices for optimal performance...",
    author: "Sarah Wilson",
    isPublic: true,
  },
  {
    title: "Authentication with Clerk",
    body: "Clerk provides a comprehensive authentication and user management solution...",
    author: "Alex Brown",
    isPublic: true,
  },
];

async function main() {
  console.log("Start seeding...");

  // Clear existing posts
  await prisma.post.deleteMany();

  // Create new posts
  for (const post of posts) {
    const createdPost = await prisma.post.create({
      data: post,
    });
    console.log(`Created post with id: ${createdPost.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
