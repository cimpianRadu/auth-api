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

export default router;
