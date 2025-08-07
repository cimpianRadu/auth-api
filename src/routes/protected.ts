import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { prisma } from "../db";

const router = Router();

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).userId;

  let user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });
  if (!user) {
    const email = `${clerkId}@placeholder.dev`;
    user = await prisma.user.create({
      data: {
        clerkId,
        email,
      },
    });
  }
  res.json({ message: "You are authenticated!", user });
});

router.get("/items", requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).userId;
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const items = await prisma.item.findMany({
    where: {
      userId: user.id,
    },
  });
  res.json({ items });
});

router.post("/create-item", requireAuth, async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const clerkId = (req as any).userId;

  // Find the user by clerkId
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create the item associated with the user
  const newItem = await prisma.item.create({
    data: {
      title,
      content,
      userId: user.id,
    },
  });

  res.status(201).json({ item: newItem });
});

export default router;
