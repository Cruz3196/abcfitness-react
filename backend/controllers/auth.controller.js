import User from "../models/user.model.js";
import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";

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

        //authenticate user .id is how mongodb stores the id
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storageRefreshToken(user._id, refreshToken);
        //setting the cookies
        setCookies(res,accessToken, refreshToken);
        console.log(email, password, username);
        // returning the user message, displaying the user, email and role
        res.status(201).json({ user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, message: "User created successfully"});

    }catch (error){
        // returing an error in the message, if their is an error in creating the user
        res.status(500).json({message: "Error in creating user"});
    }
};

export const loginUser = async (req, res) => {
    res.json({message: "User has been logged in"}); 
}

export const logoutUser = async (req, res) => {
    res.json({message: "User has been logged out"}); 
}