// importing models 
import User from "../models/user.model.js";

// importing utilities
import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";

// import nodemailer transporter
import { sendEmail } from "../utils/emailService.js";

// 15 minutes for storage to host the token
const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
// 7 days for storage to host the token
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    //returning the tokens
    return {accessToken, refreshToken};
};

// 7 days for storage to host the token, function for storing the refresh token
const storageRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken,"EX", 7 * 24 * 60 * 60); 
}
//* "accessToken" is the key name, and accessToken is the value, function for setting the cookies 
const setCookies = (res, accessToken, refreshToken) => {
    //setting the access token
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //preventing xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attacks, cross site request forgery
        maxAge: 15 * 60 * 1000, // expires in 15 minutes 
    });
    //setting the refresh token
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //preventing xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attacks, cross site request forgery
        maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7 days 
    });
};

export const createUser = async (req, res) => {
    // getting the email, password and username
    const {email, password, username} = req.body;
    try{
        // testing to see the data is being displayed
        const userExists = await User.findOne({email});

        // checking if the user already exists 
        if(userExists){
            // returning an error if the user already exists
            return res.status(400).json({message: "User already exists" })
        }
        //creating the user
        const user = await User.create({email, password, username});

        // after the user is successfully created, send a welcome email
        try {
            const subject = "Welcome to ABC Fitness!";
            const text = `Hi ${username},\n\nThank you for signing up. We're excited to have you!`;
            await sendEmail(user.email, subject, text);
            console.log(`Welcome email sent to ${user.email}`);
        } catch (emailError) {
            // Log the error but don't stop the signup process if the email fails.
            console.error("Failed to send welcome email:", emailError);
        }

        //authenticate user .id is how mongodb stores the id
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storageRefreshToken(user._id, refreshToken);
        //setting the cookies
        setCookies(res,accessToken, refreshToken);
        // returning the user message, displaying the user, email and role
        res.status(201).json({ user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, message: "Thanks for signing up for ABC Fitness!"});

    }catch (error){
        // returing an error in the message, if their is an error in creating the user
        console.log("Error in create user controller", error.message);
        res.status(500).json({message: "Error in creating user"});
    }
};

export const loginUser = async (req, res) => {
    try{
        // getting the email and password from the body
        const {email, password} = req.body;
        // finding the user from the database
        const user = await User.findOne({email});
        // if the user exists and the password is correct
        if(user && (await user.comparePassword(password))) {
            // generating the token for the user
            const {accessToken, refreshToken} = generateTokens(user._id);
            // storing the refresh token
            await storageRefreshToken(user._id, refreshToken);
            // setting the cookies
            setCookies(res,accessToken, refreshToken);
            // if the user exists and the password is correct then return the user
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            })
        } else {
            return res.status(401).json({message: "Invalid email or password"});
        }
    }catch (error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Error in logging in user"});
    };
};

export const logoutUser = async (req, res) => {
    try {
        // creating a variable for the refresh token
		const refreshToken = req.cookies.refreshToken;
        // if the refresh token exists then will decode and delete the refresh token
		if (refreshToken) {
            // jwt verifying the refresh token
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
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
}
// this will refresh the access token
export const refresh = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        // checking if the refresh token exists
        if(!refreshToken){
            return res.status(401).json({message: "No refresh token provided"});
        }
        // jwt verifying the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
        // checking if the stored token is the same as the refresh token
        if(storedToken !== refreshToken){
            return res.status(401).json({message: "Invalid refresh token"});
        }
        // generating a new access token
        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        });
        // setting the new access token
        res.cookie("accessToken", accessToken, {
            httpOnly: true, //preventing xss attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // prevent CSRF attacks, cross site request forgery
            maxAge: 15 * 60 * 1000, // expires in 15 minutes 
        });
        // returning the message
        res.json({message: "Token refreshed successfully"});

    }catch (error){
        console.log("Error in refresh controller", error.message);
        res.status(500).json({message: "Error in refreshing token"});
    }
}
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
