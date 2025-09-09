import Trainer from "../models/trainer.model";
import User from "../models/user.model";

// creating trainer profile 

export const createTrainerProfile = async (req, res) => {
    try {
        const {
            user,
            specialization,
            bio,
            certifications,
            experience,
            // profilePictureUrl, //* this will be updated later after creating a trainer profile and rest of the backend
        } = req.body; 
// this is checking to to see if the user exists in the database
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        


    } catch (error){
        console.log("Error in creating trainer profile controller: ", error);
        res.status(500).json({ error: "Error creating trainer profile" });
    }
};