import Trainer from "../models/trainer.model.js";
import Class from "../models/class.model.js";

// in controllers/trainer.controller.js
export const createTrainerProfile = async (req, res) => {
    try {
        // logic for checking if the trainer already exist, if the user does then it'll end here, if then proceed creating the profile 
        const existingTrainerProfile = await Trainer.findOne({ user: req.user._id });
        if (existingTrainerProfile) {
            return res.status(400).json({ message: "Trainer profile already exists for this user." });
        }

        const userId = req.user._id;
        // requesting the trainer data from the body 
        const { specialization, bio, certifications, experience } = req.body; 
        // this is locating the user ID in the trainer model and setting the data from the body
        const trainer = await Trainer.findOneAndUpdate(
            { user: userId }, // Find by the authenticated user's ID
            { 
                $set: { 
                    user: userId,
                    specialization,
                    bio,
                    certifications,
                    experience,
                },
            },
        
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ message: "Trainer profile saved successfully", trainer });
    } catch (error){
        console.log("Error in creating trainer profile controller: ", error);
        res.status(500).json({ error: "Error creating trainer profile" });
    }
};

// updating the trainer profile 
export const updateTrainerProfile = async (req, res) => {
    console.log("Testing update profile controller");
    try {
        // using the findByIdAndUpdate without upsert 
        const updatedTrainerProfile = await Trainer.findOneAndUpdate(
            { user: req.user._id }, // this will check the user id from the token and match it to the user id in the trainer model
            { $set: req.body }, // assuming req.body contains the fields to be updated
            { new: true, runValidators: true } // return the updated document
        ); 
        if(!updatedTrainerProfile){
            return res.status(404).json({ message: "Trainer profile not found" });
        };
        res.status(200).json({ message: "Trainer profile updated successfully", updatedTrainerProfile });
    }catch (error){
        res.status(500).json({message: error.message});
        console.log("Error in updating trainer profile in trainer controller", error.message);
    }
};

// creating a class
export const createClass = async (req, res) => {
    try {
        // this will create a new class and associate it with the trainer's user ID
        const newClass = await Class.create({
            trainer: req.user._id, // Assuming req.user contains the authenticated user's info
            ...req.body // Spread the rest of the class details from the request body
        });
        // if credentials are correct, it'll create the class
        res.status(201).json({ message: "Class created successfully", newClass });
    }catch (error){
        console.log("Error in creating class controller", error);
        res.status(500).json({ error: "Error creating class" });
    }
}