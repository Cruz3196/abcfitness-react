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
        // if user is a trainer then they can create a class 
        const trainer = await Trainer.findOne({ user: req.user._id });
        if(!trainer){
            return res.status(403).json({ message: "Only trainers can create classes." });

        }
        const { classTitle, classDescription, classType, duration, timeSlot, classPic,capacity, price} = req.body;

        const newClass = await Class.create({
           trainer: trainer._id, // This is the verified ID of the logged-in trainer.
            classTitle, // Assuming schema field is classTitle
            classDescription,
            classType,
            duration,
            timeSlot,
            classPic,
            capacity,
            price
        });
        res.status(201).json(newClass);
    }catch (error){
        console.log("Error in creating class controller", error);
        res.status(500).json({ error: "Error creating class" });
    }
}