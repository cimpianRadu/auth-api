import { Router } from "express";

const router = Router();

router.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint — no auth needed." });
});

export default router;
