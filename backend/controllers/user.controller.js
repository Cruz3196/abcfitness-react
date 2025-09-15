import User from "../models/user.model.js";

// editing user info by id
export const editUserInfo = async (req, res) => {
    try {
        // 1. Get all possible fields from the request body.
        const { username, email, goals, availability, currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // --- SECURITY CHECK: Prevent Duplicate Emails ---
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return res.status(400).json({ message: "This email is already in use by another account." });
            }
        }

        // --- PASSWORD CHANGE LOGIC ---
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "New password must be at least 6 characters long" });
            }
            user.password = newPassword;
        } else if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both the current and new password to change it" });
        }

        // --- GENERAL PROFILE UPDATES (USING || OPERATOR) ---
        // If a new value is provided, use it. Otherwise, keep the existing value.
        user.username = username || user.username;
        user.email = email || user.email;
        user.goals = goals || user.goals;
        user.availability = availability || user.availability;
        
        const savedUser = await user.save();

        // --- SECURITY: Create a Safe Response ---
        const userResponse = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            goals: savedUser.goals,
            availability: savedUser.availability
        };

        res.status(200).json({ message: "Profile updated successfully", user: userResponse });

    } catch (error) {
        console.log("Error in editing user info", error);
        res.status(500).json({ message: "An error occurred while editing the user profile" });
    }
};