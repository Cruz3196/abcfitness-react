import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    
    return {accessToken, refreshToken};

};

export const createUser = async (req, res) => {
    const {email, password, username} = req.body;
    try{
        // testing to see the data is being displayed
        // console.log(email, password, username);
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message: "User already exists" })
        }
        const user = await User.create({email, password, username});

        //authenticate user .id is how mongodb stores the id
        const {accessToken, refreshToken} = generateTokens(user._id);

        res.status(201).json({user, message: "User created successfully"});

    }catch (error){
        res.status(500).json({message: "Error in creating user"});
    }
};

export const loginUser = async (req, res) => {
    res.json({message: "User has been logged in"}); 
}

export const logoutUser = async (req, res) => {
    res.json({message: "User has been logged out"}); 
}