import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { prisma } from "../db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

router.delete("/delete-item", requireAuth, async (req: Request, res: Response) => {
  const { itemId } = req.body;
  const clerkId = (req as any).userId;
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return res.status(404).json({ message: "Attepted to delete item without being authenticated" });
  }

  await prisma.item.delete({
    where: { id: itemId },
  });
  res.status(200).json({ message: "Item deleted successfully" });
});

router.post("/payment-sheet", requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId, email, amount, currency, description, paymentMethod } = req.body;
    const clerkId = (req as any).userId;

    // Validate required fields
    if (!email || !amount || !currency || !description) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Email, amount, currency, and description are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User not found in database",
      });
    }

    // Create Stripe customer
    let customer;
    try {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          clerkId,
        },
      });
    } catch (stripeError: any) {
      console.error("Stripe customer creation failed:", stripeError);
      return res.status(400).json({
        error: "Customer creation failed",
        message: stripeError.message || "Failed to create customer",
        stripeError: stripeError.type || "unknown_error",
      });
    }

    // Create ephemeral key
    let ephemeralKey;
    try {
      ephemeralKey = await stripe.ephemeralKeys.create(
        {
          customer: customer.id,
        },
        {
          apiVersion: "2025-04-30.basil",
        }
      );
    } catch (stripeError: any) {
      console.error("Stripe ephemeral key creation failed:", stripeError);
      return res.status(400).json({
        error: "Ephemeral key creation failed",
        message: stripeError.message || "Failed to create ephemeral key",
        stripeError: stripeError.type || "unknown_error",
      });
    }

    // Create payment intent
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        customer: customer.id,
        description: description,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });
    } catch (stripeError: any) {
      console.error("Stripe payment intent creation failed:", stripeError);
      return res.status(400).json({
        error: "Payment intent creation failed",
        message: stripeError.message || "Failed to create payment intent",
        stripeError: stripeError.type || "unknown_error",
        code: stripeError.code || null,
      });
    }

    res.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error: any) {
    console.error("Unexpected error in payment-sheet route:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while processing payment",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
