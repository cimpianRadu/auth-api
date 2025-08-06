import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

// Check for required environment variables
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is not set in environment variables");
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format. Use Bearer token" });
    }

    // Extract the token
    const sessionToken = authHeader.split(" ")[1];
    if (!sessionToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      // Verify the session token
      const { sub: userId } = await verifyToken(sessionToken, { secretKey: process.env.CLERK_SECRET_KEY });

      // Attach user data to request
      (req as any).userId = userId;

      next();
    } catch (verifyError) {
      console.error("Session verification failed:", verifyError);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
}
