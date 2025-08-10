import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint — no auth needed." });
});

router.post("/create-user", async (req, res) => {
  const { clerkId, email } = req.body;
  console.log("✅✅✅ clerkId, email", clerkId, email);
  try {
    if (!clerkId || !email) {
      return res.status(400).json({ message: "Clerk ID and email are required" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (user) {
      console.log("🔴🔴🔴 User already exists", user);
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: { clerkId, email },
    });
    console.log("🟢🟢🟢 User created successfully", newUser);
    return res.status(201).json({ message: "User created successfully", user: newUser.email });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
