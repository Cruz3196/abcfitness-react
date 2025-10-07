import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No access token provided" });
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            // This case handles a valid token for a user that has since been deleted
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);

        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Access token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // Handle other potential errors
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// verify if the user matches the role of the admin allow access, if not access is denied.
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userRole = req.user.role;

        // Check if the user's role is in the list of allowed roles
        if (allowedRoles.includes(userRole)) {
            next(); 
        } else {
            // Access denied
            return res.status(403).json({ message: "Forbidden - You do not have permission to access this resource" });
        }
    };
}