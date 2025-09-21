import Trainer from "../models/trainer.model.js";
import Class from "../models/class.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import cloudinary from "../lib/cloudinaryConfig.js";

// in controllers/trainer.controller.js, setting up the trainers profile.
export const createTrainerProfile = async (req, res) => {
    try {
        const existingProfile = await Trainer.findOne({ user: req.user._id });
        if (existingProfile) {
            return res.status(400).json({ message: "Trainer profile already exists for this user." });
        }

        const { specialization, bio, certifications, experience, trainerProfilePic } = req.body;
        
        let imageUrl = "";
        if (trainerProfilePic) {
            // Upload the new image to a 'trainer_profiles' folder in Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(trainerProfilePic, {
                folder: "trainer_profiles",
            });
            imageUrl = uploadedImage.secure_url;
        }

        const newProfile = await Trainer.create({
            user: req.user._id,
            specialization,
            bio,
            certifications,
            experience,
            trainerProfilePic: imageUrl
        });

        res.status(201).json({ message: "Trainer profile created successfully", trainer: newProfile });

    } catch (error) {
        console.log("Error in creating trainer profile:", error.message);
        res.status(500).json({ error: "Error creating trainer profile" });
    }
};

// updating the trainer profile 
export const updateTrainerProfile = async (req, res) => {
    try {
        const { specialization, bio, certifications, experience, trainerProfilePic } = req.body;
        
        // 1. Find the full trainer document to access its properties.
        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) {
            return res.status(404).json({ message: "Trainer profile not found." });
        }

        // 2. --- TRAINER PROFILE PICTURE UPLOAD LOGIC ---
        if (trainerProfilePic) {
            // If the trainer already has a profile picture, delete the old one from Cloudinary.
            if (trainer.trainerProfilePic) {
                try {
                    // Extract the unique public_id from the full Cloudinary URL
                    const publicId = trainer.trainerProfilePic.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`trainer_profiles/${publicId}`);
                } catch (cloudinaryError) {
                    console.error("Failed to delete old trainer profile pic from Cloudinary:", cloudinaryError);
                    // Don't block the update if deletion fails, just log the error.
                }
            }
            // Upload the new image to a 'trainer_profiles' folder.
            const uploadedImage = await cloudinary.uploader.upload(trainerProfilePic, {
                folder: "trainer_profiles",
            });
            trainer.trainerProfilePic = uploadedImage.secure_url; // Save the new image URL
        }

        // 3. --- SECURE FIELD UPDATES ---
        // This pattern prevents mass assignment vulnerabilities.
        trainer.specialization = specialization || trainer.specialization;
        trainer.bio = bio || trainer.bio;
        trainer.certifications = certifications || trainer.certifications;
        trainer.experience = experience || trainer.experience;

        // 4. Save all the changes to the database.
        const savedTrainer = await trainer.save();
        res.status(200).json({ message: "Trainer profile updated successfully", trainer: savedTrainer });

    } catch (error) {
        console.log("Error in updating trainer profile:", error.message);
        res.status(500).json({ error: "Error updating trainer profile" });
    }
};

// creating a class
export const createClass = async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) {
            return res.status(403).json({ message: "You must have a trainer profile to create a class." });
        }

        const { classTitle, classDescription, classType, duration, timeSlot, classPic, capacity, price } = req.body;

        let imageUrl = "";
        if (classPic) {
            const uploadedImage = await cloudinary.uploader.upload(classPic, {
                folder: "classes" // Save images in a 'classes' folder
            });
            imageUrl = uploadedImage.secure_url;
        }

        const newClass = await Class.create({
            trainer: trainer._id,
            classTitle,
            classDescription,
            classType,
            duration,
            timeSlot,
            classPic: imageUrl,
            capacity,
            price
        });

        res.status(201).json(newClass);
    } catch (error) {
        console.log("Error in creating class controller", error);
        res.status(500).json({ error: "Error creating class" });
    }
};

// getting the trainers classes
// A more powerful version of getMyClasses
export const getMyClasses = async (req, res) => {
    try {
        const userId = req.user._id;
        const trainer = await Trainer.findOne({ user: userId });

        if (!trainer) {
            return res.status(404).json({ message: "Trainer profile not found." });
        }

        const classes = await Class.find({ trainer: trainer._id })
            .populate({
                path: 'trainer',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            });

        res.status(200).json(classes);
    } catch (error) {
        console.log("Error in getting classes controller", error);
        res.status(500).json({ error: "Error getting classes" });
    }
};

// viewing a class by id
export const viewClassById = async (req, res) => {
    try {
        const { classId } = req.params;

        // ✅ IMPROVED: Use populate to also fetch the trainer's name.
        const classInfo = await Class.findById(classId).populate({
            path: 'trainer',
            populate: {
                path: 'user',
                select: 'username'
            }
        });

        if (!classInfo) {
            return res.status(404).json({ message: "Class not found" });
        }
        
        // This response will now include the classPic and the trainer's username.
        res.json(classInfo);

    } catch (error) {
        console.log("Error in viewing by class Id controller", error);
        res.status(500).json({ message: "Error viewing class by Id" });
    }
};

// viewing booked users in a specific class
export const viewClassAttendees = async (req, res) => {
    try {
        const { classId } = req.params;

        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) {
            return res.status(403).json({ message: "You must have a trainer profile to view class attendees." });
        }

        const classToCheck = await Class.findById(classId);
        if (!classToCheck || classToCheck.trainer.toString() !== trainer._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view attendees for this class." });
        }

        // ✅ IMPROVED: Populate both the user and class details in one efficient query.
        const bookings = await Booking.find({ class: classId })
            .populate({
                path: 'user',
                select: 'username email profileImage' // Get user's name, email, and profile pic
            })
            .populate({
                path: 'class',
                select: 'classTitle classPic' // ✅ Get the class title and its picture
            });

        // The 'bookings' array now contains all the info you need.
        res.status(200).json(bookings);

    } catch (error) {
        console.log("Error in viewClassAttendees:", error);
        res.status(500).json({ message: "Error fetching class attendees." });
    }
};



// updating a class 
export const updatingClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { classTitle, classDescription, classType, duration, timeSlot, capacity, price, classPic } = req.body;

        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) {
            return res.status(403).json({ message: "Trainer profile not found." });
        }

        let classToUpdate = await Class.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Security Check: Verify that the logged-in trainer owns this class.
        if (classToUpdate.trainer.toString() !== trainer._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this class." });
        }

        // --- CLASS PICTURE UPLOAD LOGIC ---
        if (classPic) {
            // If an old image exists, delete it from Cloudinary first.
            if (classToUpdate.classPic) {
                try {
                    const publicId = classToUpdate.classPic.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`classes/${publicId}`);
                } catch (cloudinaryError) {
                    console.error("Failed to delete old class pic from Cloudinary:", cloudinaryError);
                }
            }
            // Upload the new image.
            const uploadedImage = await cloudinary.uploader.upload(classPic, {
                folder: "classes",
            });
            classToUpdate.classPic = uploadedImage.secure_url;
        }

        // --- SECURE FIELD UPDATES ---
        classToUpdate.classTitle = classTitle ?? classToUpdate.classTitle;
        classToUpdate.classDescription = classDescription ?? classToUpdate.classDescription;
        classToUpdate.classType = classType ?? classToUpdate.classType;
        classToUpdate.duration = duration ?? classToUpdate.duration;
        classToUpdate.timeSlot = timeSlot ?? classToUpdate.timeSlot;
        classToUpdate.capacity = capacity ?? classToUpdate.capacity;
        classToUpdate.price = price ?? classToUpdate.price;

        const updatedClass = await classToUpdate.save();
        res.status(200).json({ message: "Class updated successfully", class: updatedClass });

    } catch (error) {
        console.log("Error in updating class controller", error);
        res.status(500).json({ error: "Error updating class" });
    }
};

// deleting a class 
export const deleteClass = async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) {
            return res.status(403).json({ error: "Trainer profile not found" });
        }

        const classToDelete = await Class.findOne({
            _id: req.params.classId,
            trainer: trainer._id
        });
        
        if (!classToDelete) {
            return res.status(404).json({ error: "Class not found or you are not authorized to delete it" });
        }

        // If the class has an image on Cloudinary, delete it first.
        if (classToDelete.classPic) {
            try {
                const publicId = classToDelete.classPic.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`classes/${publicId}`);
            } catch (error) {
                console.log("Error deleting image from Cloudinary: ", error);
            }
        }

        // Now, delete the class from the database.
        await Class.findByIdAndDelete(req.params.classId);

        res.status(200).json({ message: "Class has been deleted successfully" });

    } catch (error) {
        console.log("Error in deleting class controller", error);
        res.status(500).json({ error: "Error deleting class" });
    }
};