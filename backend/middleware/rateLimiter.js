import rateLimit from "express-rate-limit";

/**
 * RATE LIMITING MIDDLEWARE
 *
 * Protects against brute force attacks and DoS attempts
 * Different limits for different endpoints based on sensitivity
 */

// Helper function to get the real client IP address
// Important for detecting the real IP in development with multiple devices
const getClientIP = (req) => {
  // Check for IP from various proxy headers (for production)
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Fallback to direct connection IP
  return req.socket.remoteAddress || req.ip || "127.0.0.1";
};

// General API rate limiter - 100 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => getClientIP(req), // Use real IP detection
  skip: (req) => process.env.NODE_ENV !== "production", // Only apply in production
});

// Strict limiter for authentication endpoints - 5 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req), // Use real IP detection
  skip: (req) => process.env.NODE_ENV !== "production",
});

// Strict limiter for password reset endpoints - 3 requests per hour
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: "Too many password reset attempts, please try again later.",
  standardHeaders: true,
  keyGenerator: (req) => getClientIP(req), // Use real IP detection
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== "production",
});

// Moderate limiter for payment endpoints - 20 requests per 15 minutes
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many payment requests, please try again later.",
  standardHeaders: true,
  keyGenerator: (req) => getClientIP(req), // Use real IP detection
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== "production",
});
