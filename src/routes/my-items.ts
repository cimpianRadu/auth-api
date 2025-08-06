import { prisma } from "../db";
import { requireAuth } from "../middleware/requireAuth";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/my-items", requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).userId;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { items: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ items: user.items });
});
