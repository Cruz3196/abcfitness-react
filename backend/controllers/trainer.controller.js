import Trainer from "../models/trainer.model.js";
import Class from "../models/class.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";

// in controllers/trainer.controller.js, setting up the trainers profile.
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

// getting the trainers classes
export const getMyClasses = async (req, res) => {
    try{
        // requesting the user id from the token 
        const  userId  = req.user._id;
        // finding the trainer profile using the user id from the token
        const trainer = await Trainer.findOne({ user: userId });
        if(!trainer) {
        // if user is not a trainer then they can't view classes
            return res.status(200).json("Trainer needs to complete profile set up first, then is able to create and view classes");
        }
        const classes = await Class.find({ trainer: trainer._id });
        res.status(200).json(classes);
    }catch (error){
        console.log("Error in getting classes controller", error)
        res.status(500).json({ error: "Error getting classes" });;
    }
};

// viewing a class by id
export const viewClassById = async (req, res) => {
    try{
        // creating a variable to request the class id from the params.
        const {classId} = req.params;
        //creating another variable to get class information by its id.
        const classInfo = await Class.findById({ _id: classId });
        //now if the class if is not found then return an error.
        if(!classInfo){
            return res.status(404).json({ message: "Class not found"});
        }
        // returning the class information if found.
        res.json(classInfo);

    }catch (error){
        console.log("Error in viewing by class Id controller", error);
        res.status(500).json({ message: "Error viewing class by Id" });
    };
};

// viewing booked users in a specific class
export const viewClassAttendees = async (req, res) => {
    try {
        const { classId } = req.params;

        //Find the trainer profile of the currently logged-in user.
        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) {
            return res.status(403).json({ message: "You must have a trainer profile to view class attendees." });
        }

        // Find the class to ensure it exists.
        const classToCheck = await Class.findById(classId);

        // Verify that the class exists AND that its 'trainer' field matches the logged-in trainer's profile ID.
        if (!classToCheck || classToCheck.trainer.toString() !== trainer._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view attendees for this class." });
        }

        // Find all bookings for this class and populate the user's details in ONE efficient query.
        const bookings = await Booking.find({ class: classId })
            .populate({
                path: 'user', // In the Booking model, populate the 'user' field.
                select: 'username email' // Get the username and email of the user who booked.
            });

        // The 'bookings' array now contains all the user info you need.
        res.status(200).json(bookings);

    } catch (error) {
        console.log("Error in viewClassAttendees:", error);
        res.status(500).json({ message: "Error fetching class attendees." });
    }
};



// updating a class 
export const updatingClass = async (req, res) => {
        //* these are the parameters that are going to be updated

    const { classTitle, classDescription, classType, duration, timeSlot, capacity, price} = req.body;
        //* requesting the class id from the params 

    const classId = req.params.classId;

    try {
        // calling the class by its id
        let classToUpdate = await Class.findById(classId);
        // if the class does not exist then return the message
        if(!classToUpdate) return res.status(404).json({ message: "Class not found"});

        classToUpdate.classTitle = classTitle || classToUpdate.classTitle;
        classToUpdate.classDescription = classDescription || classToUpdate.classDescription;
        classToUpdate.classType = classType || classToUpdate.classType;
        classToUpdate.duration = duration || classToUpdate.duration;
        classToUpdate.timeSlot = timeSlot || classToUpdate.timeSlot;
        classToUpdate.capacity = capacity || classToUpdate.capacity;
        classToUpdate.price = price || classToUpdate.price;

        await classToUpdate.save();
        res.status(200).json({ message: "Class updated successfully", classToUpdate });

    }catch (error){
        console.log("Error in updating class controller", error);
        res.status(500).json({ error: "Error updating class"}); 
    }
}

// deleting a class 
export const deleteClass = async (req,res) => {
    try{
        // find the user of the logged in trainer 
        const trainer = await Trainer.findOne({ user: req.user._id });
        // if the trainer profile is not found then return this message
        if(!trainer){
            return res.status(403).json({ error: "Trainer profile not found"});
        }

        const deletingClass = await Class.findOneAndDelete({
            _id: req.params.classId, // looking for the class if in the database
            trainer: trainer._id // searching for the trainer id that is logged in and created the class
        })
        // if the class is not found then return this message
        if(!deletingClass){
            return res.status(404).json({ error: "Clas not found or you are not authorized to delete this class"});
        };
        // return a success code if the class is deleted
        res.status(200).json({ message: "Class has been deleted successfully"});

    } catch (error){
        console.log("Error in deleting class controller", error);
        res.status(500).json({ error: "Error deleting class"});
    }
}