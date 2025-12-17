// importing models
import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";

// importing utilities
import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";
import {
  generateTokens,
  storageRefreshToken,
  setCookies,
} from "../utils/tokenUtils.js";

// import nodemailer transporter
import { sendWelcomeEmail } from "../utils/emailService.js";

export const createUser = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, username });

    sendWelcomeEmail(user.email, username).catch((emailError) => {
      console.error("Failed to send welcome email:", emailError);
    });

    // Authenticate user immediately
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storageRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    // Respond immediately without waiting for email
    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "Thanks for signing up for ABC Fitness!",
    });
  } catch (error) {
    console.log("Error in create user controller", error.message);
    res.status(500).json({ message: "Error in creating user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // getting the email and password from the body
    const { email, password } = req.body;
    // finding the user from the database
    const user = await User.findOne({ email });
    // if the user exists and the password is correct
    if (user && (await user.comparePassword(password))) {
      // generating the token for the user
      const { accessToken, refreshToken } = generateTokens(user._id);
      // storing the refresh token
      await storageRefreshToken(user._id, refreshToken);
      // setting the cookies
      setCookies(res, accessToken, refreshToken);

      //Use stored value to eliminate delay
      const hasTrainerProfile = user.hasTrainerProfile || false;

      // if the user exists and the password is correct then return the user
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        hasTrainerProfile,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Error in logging in user" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // creating a variable for the refresh token
    const refreshToken = req.cookies.refreshToken;
    // if the refresh token exists then will decode and delete the refresh token
    if (refreshToken) {
      // jwt verifying the refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refreshToken:${decoded.userId}`);
    }
    // if the refresh token exists then will clear the cookies
    res.clearCookie("accessToken");
    // clearing the refresh token
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// this will refresh the access token
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (jwtError) {
      // Token is expired or invalid
      console.log("Refresh token verification failed:", jwtError.message);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res
        .status(401)
        .json({ message: "Refresh token expired or invalid" });
    }

    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refresh controller", error.message);
    res.status(500).json({ message: "Error in refreshing token" });
  }
};
// // getting the user profile
// export const getProfile = async (req,res) => {
//     try{
//         const user = req.user;
//         // if the user is a trainer then get the trainer profile
//         if(user.role === 'trainer'){
//             const trainerProfile = await Trainer.findOne({ user: user._id});
//             // combining the user and trainer profile data
//             const fullProfile = {
//                 ...user.toObject(), // conver the mongoose document to a plain object
//                 trainerProfile: trainerProfile // attaching the trainer specific data
//             }
//             // return the full trainer profile is they exist or a trainer
//             return res.status(200).json(fullProfile);
//         }
//         // if not trainer then return the user profile
//         res.status(200).json(user);
//     } catch (error){
//         res.status(500).json({message: "Error in getting profile"});
//     }
// }
