// importing modules
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//routes
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import trainerRoutes from "./routes/trainer.route.js";
import adminRoutes from "./routes/admin.route.js";
import cartRoutes from "./routes/cart.route.js";
import PaymentRoutes from "./routes/payment.route.js";

//database connection
import connectMongoDB from "./db/connectMongoDB.js";

// Security middleware
import {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  paymentLimiter,
} from "./middleware/rateLimiter.js";

//configuring the dotenv file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    }),
  );
}

// configuring the backend to the front end
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Security: Rate Limiting
// Apply general rate limiter to all routes
app.use("/api", generalLimiter);

// Apply stricter rate limiters to sensitive endpoints
app.use("/api/user/login", authLimiter);
app.use("/api/user/signup", authLimiter);
app.use("/api/user/forgotPassword", passwordResetLimiter);
app.use("/api/user/resetPassword", passwordResetLimiter);
app.use("/api/payment", paymentLimiter);

// API Routes (BEFORE static files)
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", PaymentRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Handle React Router - catch all non-API routes
  app.get("*", (req, res) => {
    console.log("📄 Serving React app for route:", req.path);
    res.sendFile(path.resolve(__dirname, "frontend/dist/index.html"));
  });
} else {
  // Development route
  app.get("/", (req, res) => {
    res.json({ message: "API is running in development mode" });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Serving from: ${path.join(__dirname, "frontend/dist")}`);
  connectMongoDB();
});
