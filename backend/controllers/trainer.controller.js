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
            return res.status(400).json({ message: "Trainer profile already exists." });
        }

        const { specialization, bio, certifications, experience, trainerProfilePic } = req.body;

        // ✅ 2. Add basic validation for required fields
        if (!specialization || !bio) {
            return res.status(400).json({ message: "Please provide all required fields, including specialization and bio." });
        }

        let imageUrl = "";
        let imagePublicId = "";

        if (trainerProfilePic) {
            const uploadedImage = await cloudinary.uploader.upload(trainerProfilePic, {
                folder: "trainer_profiles",
            });
            imageUrl = uploadedImage.secure_url;
            imagePublicId = uploadedImage.public_id; 
        }

        const newProfile = await Trainer.create({
            user: req.user._id,
            specialization,
            bio,
            certifications,
            experience,
            trainerProfilePic: imageUrl,
            trainerProfilePublicId: imagePublicId
        });

        // ✅ 3. Update the user model to complete the setup flow
        await User.findByIdAndUpdate(req.user._id, { hasTrainerProfile: true });

        res.status(201).json({ message: "Trainer profile created successfully", trainer: newProfile });

    } catch (error) {
        console.log("Error in creating trainer profile:", error.message);
        res.status(500).json({ error: "Error creating trainer profile" });
    }
};

// updating the trainer profile 
export const updateTrainerProfile = async (req, res) => {
    try {

        const { specialization, bio, certifications, experience, trainerProfilePic, email, username } = req.body;
        
        const trainer = await Trainer.findOne({ user: req.user._id });
        
        if (!trainer) {
            console.log("❌ Trainer profile not found for user:", req.user._id);
            return res.status(404).json({ message: "Trainer profile not found." });
        }


        // will need to create a function that will update the user name and email in the user maodel 
        const user = await User.findById(req.user._id);

        if (!user) {
            console.log("❌ User not found with ID:", req.user._id);
            return res.status(404).json({ message: "User not found." });
        }

        // Update username and email if provided
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already taken." });
            }
            user.username = username;
            trainer.username = username; 
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already in use." });
            }
            user.email = email;
        }
        // saving the updated user information
        await user.save();


        // --- TRAINER PROFILE PICTURE UPLOAD LOGIC ---
        // ✅ FIX: Only upload if trainerProfilePic is a base64 string (new image)
        // If it's already a Cloudinary URL, don't try to upload it again
        if (trainerProfilePic && trainerProfilePic !== trainer.trainerProfilePic) {
            
            // Check if it's a base64 string (new image) or existing URL
            const isBase64 = trainerProfilePic.startsWith('data:image/');
            const isNewCloudinaryUrl = trainerProfilePic.startsWith('https://res.cloudinary.com/') && trainerProfilePic !== trainer.trainerProfilePic;
            
            if (isBase64) {
                
                // Delete old image if it exists
                if (trainer.trainerProfilePublicId) {
                    try {
                        console.log("🗑️ Deleting old image with public_id:", trainer.trainerProfilePublicId);
                        await cloudinary.uploader.destroy(trainer.trainerProfilePublicId);
                        console.log("✅ Old image deleted successfully");
                    } catch (cloudinaryError) {
                        console.error("❌ Failed to delete old trainer profile pic:", cloudinaryError);
                    }
                }

                // Upload new image
                try {
                    const uploadedImage = await cloudinary.uploader.upload(trainerProfilePic, {
                        folder: "trainer_profiles",
                    });

                    trainer.trainerProfilePic = uploadedImage.secure_url;
                    trainer.trainerProfilePublicId = uploadedImage.public_id;
                    console.log("✅ New image uploaded:", uploadedImage.secure_url);
                } catch (uploadError) {
                    console.error("❌ Failed to upload new image:", uploadError);
                    return res.status(500).json({ error: "Failed to upload profile picture", details: uploadError.message });
                }
            } else if (isNewCloudinaryUrl) {
                console.log("🔄 Using existing Cloudinary URL");
                // If it's a different Cloudinary URL, just update the reference
                trainer.trainerProfilePic = trainerProfilePic;
                // Note: We can't get the public_id from just the URL, so we'll leave it as is
            } else {
                console.log("ℹ️ No profile picture change needed");
            }
        }
        
        // Convert experience to number if it's a string
        const experienceValue = experience ? Number(experience) : trainer.experience;
        
        // Only update fields that are provided and not empty

        if (specialization !== undefined && specialization !== '') trainer.specialization = specialization;
        if (bio !== undefined) trainer.bio = bio; // Allow empty bio
        if (certifications !== undefined) trainer.certifications = certifications; // Allow empty certifications
        if (experienceValue !== undefined && !isNaN(experienceValue)) trainer.experience = experienceValue;

        const savedTrainer = await trainer.save();

        const response = {
            message: "Trainer profile updated successfully",
            trainer: {
                ...savedTrainer.toObject(),
                user: {
                    username: user.username,
                    email: user.email
                }
            }
        };

        res.status(200).json(response);

    } catch (error) {
        
        // Check if it's a validation error
        if (error.name === 'ValidationError') {
            console.error("Validation errors:", error.errors);
            return res.status(400).json({ 
                error: "Validation error",
                details: Object.keys(error.errors).map(field => ({
                    field,
                    message: error.errors[field].message
                }))
            });
        }
        
        res.status(500).json({ 
            error: "Error updating trainer profile",
            details: error.message,
            type: error.name
        });
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
        let imagePublicId = "";
        if (classPic) {
            const uploadedImage = await cloudinary.uploader.upload(classPic, {
                folder: "classes" // Save images in a 'classes' folder
            });
            imageUrl = uploadedImage.secure_url;
            imagePublicId = uploadedImage.public_id;
        }

        const newClass = await Class.create({
            trainer: trainer._id,
            classTitle,
            classDescription,
            classType,
            duration,
            timeSlot,
            classPic: imageUrl,
            classPicPublicId: imagePublicId,
            capacity,
            price
        });

        res.status(201).json(newClass);
    } catch (error) {
        console.log("Error in creating class controller", error);
        res.status(500).json({ error: "Error creating class" });
    }
};

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
        const classData = await Class.findById(req.params.classId)
            .populate({
                path: 'trainer',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
            .populate('attendees', 'username email');

        if (!classData) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Only return available classes to customers
        if (classData.status !== 'available') {
            return res.status(404).json({ error: "Class not available" });
        }

        res.status(200).json(classData);
    } catch (error) {
        console.log("Error in getting class by ID:", error);
        res.status(500).json({ error: "Error fetching class details" });
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
            return res.status(404).json({ error: "Trainer profile not found" });
        }

        let classToUpdate = await Class.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Security Check: Verify that the logged-in trainer owns this class.
        if (classToUpdate.trainer.toString() !== trainer._id.toString()) {
            return res.status(403).json({ error: "You don't have permission to update this class" });
        }

        // --- CLASS PICTURE UPLOAD LOGIC ---
        if (classPic && classPic !== classToUpdate.classPic) {
            // Only upload if classPic is a base64 string (new image)
            if (classPic.startsWith('data:image/')) {
                try {
                    // Delete old image if it exists
                    if (classToUpdate.classPicPublicId) {
                        await cloudinary.uploader.destroy(classToUpdate.classPicPublicId);
                    }
                    
                    // Upload new image
                    const uploadedResponse = await cloudinary.uploader.upload(classPic);
                    classToUpdate.classPic = uploadedResponse.secure_url;
                    classToUpdate.classPicPublicId = uploadedResponse.public_id;
                } catch (uploadError) {
                    console.log("Error uploading class picture:", uploadError);
                    return res.status(400).json({ error: "Failed to upload class picture" });
                }
            }
        }

        // --- SECURE FIELD UPDATES ---
        if (classTitle !== undefined) classToUpdate.classTitle = classTitle;
        if (classDescription !== undefined) classToUpdate.classDescription = classDescription;
        if (classType !== undefined) classToUpdate.classType = classType;
        if (duration !== undefined) classToUpdate.duration = duration;
        if (timeSlot !== undefined) classToUpdate.timeSlot = timeSlot;
        if (capacity !== undefined) classToUpdate.capacity = capacity;
        if (price !== undefined) classToUpdate.price = price;

        const updatedClass = await classToUpdate.save();
        res.status(200).json({ message: "Class updated successfully", class: updatedClass });

    } catch (error) {
        console.log("Error in updating class controller:", error);
        res.status(500).json({ error: "Error updating class", details: error.message });
    }
};

// deleting a class 
export const deleteClass = async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) {
            return res.status(404).json({ error: "Trainer profile not found" });
        }

        const classToDelete = await Class.findOne({
            _id: req.params.classId,
            trainer: trainer._id
        });
        
        if (!classToDelete) {
            return res.status(404).json({ error: "Class not found or you don't have permission to delete it" });
        }

        // If the class has an image on Cloudinary, delete it first.
        if (classToDelete.classPicPublicId) {
            try {
                await cloudinary.uploader.destroy(classToDelete.classPicPublicId);
            } catch (cloudinaryError) {
                console.log("Error deleting image from Cloudinary:", cloudinaryError);
                // Continue with class deletion even if image deletion fails
            }
        }

        // Delete any bookings associated with this class
        await Booking.deleteMany({ class: classToDelete._id });

        // Now, delete the class from the database.
        await Class.findByIdAndDelete(req.params.classId);

        res.status(200).json({ message: "Class deleted successfully" });

    } catch (error) {
        console.log("Error in deleting class controller:", error);
        res.status(500).json({ error: "Error deleting class", details: error.message });
    }
};