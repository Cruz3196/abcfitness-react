import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

// 15 minutes for storage to host the token
export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  // 7 days for storage to host the token
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  //returning the tokens
  return { accessToken, refreshToken };
};

// 7 days for storage to host the token, function for storing the refresh token
export const storageRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
};

//* "accessToken" is the key name, and accessToken is the value, function for setting the cookies
export const setCookies = (res, accessToken, refreshToken) => {
  // Determine secure flag based on environment
  // In production: secure: true (requires HTTPS)
  // In development: secure: false (allows HTTP)
  const isProduction = process.env.NODE_ENV === "production";

  // cookie settings
  const cookieOptions = {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProduction, // Only send over HTTPS in production
    sameSite: "strict", // CSRF protection - strict mode prevents cross-site cookie sending
  };

  //setting the access token
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // expires in 15 minutes
  });

  //setting the refresh token
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7 days
  });

  console.log("Cookies set successfully");
};
