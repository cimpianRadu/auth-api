import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", error);

  // Database connection errors
  if (error.message.includes("Can't reach database server")) {
    return res.status(503).json({
      message: "Database connection error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }

  // Prisma specific errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma errors
    switch (error.code) {
      case "P2002": // Unique constraint violation
        return res.status(409).json({
          message: "A record with this value already exists",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      case "P2025": // Record not found
        return res.status(404).json({
          message: "Record not found",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      default:
        return res.status(400).json({
          message: "Database operation failed",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
  }

  // Default error response
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
}
