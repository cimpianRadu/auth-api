import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint — no auth needed." });
});

router.post("/create-user", async (req, res) => {
  const { clerkId, email } = req.body;
  const user = await prisma.user.create({
    data: { clerkId, email },
  });
  res.json({ user });
});

export default router;
