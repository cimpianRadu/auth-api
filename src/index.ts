import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import publicRouter from "./routes/public";
import protectedRouter from "./routes/protected";
import healthRouter from "./routes/health";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", healthRouter); // Health check route should be at root level
app.use("/public", publicRouter);
app.use("/protected", protectedRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
