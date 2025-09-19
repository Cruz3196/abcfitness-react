import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";
import Class from "../models/class.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";

// getting user info by id 
export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        // If the user is a trainer, get their profile AND their classes.
        if (user.role === 'trainer') {
            // Find the trainer profile document
            const trainerProfile = await Trainer.findOne({ user: user._id });
            
            let trainerClasses = [];
            // If the profile exists, find the classes linked to it
            if (trainerProfile) {
                trainerClasses = await Class.find({ trainer: trainerProfile._id });
            }


            const fullProfile = {
                ...user.toObject(),
                trainerProfile: trainerProfile,
                classes: trainerClasses
            };
            
            return res.status(200).json(fullProfile);
        }

        // If not a trainer, just return the basic user profile
        res.status(200).json(user);

    } catch (error) {
        console.log("Error in getting profile", error.message);
        res.status(500).json({ message: "Error in getting profile" });
    }
};

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
        console.log("Error in editing user info", error.message);
        res.status(500).json({ message: "An error occurred while editing the user profile" });
    }
};

// deleting the user profile 
export const deleteUserAccount = async (req, res) => {
    try {
        // 1. Get the user's ID securely from their token.
        const userId = req.user._id;

        // 2. Check if the user is a trainer.
        if (req.user.role === 'trainer') {
            // Find the associated trainer profile document.
            const trainerProfile = await Trainer.findOne({ user: userId });

            if (trainerProfile) {
                // If they have a profile, delete all classes created by this trainer.
                // This prevents orphaned class documents.
                await Class.deleteMany({ trainer: trainerProfile._id });

                // Now, delete the trainer profile itself.
                await Trainer.findByIdAndDelete(trainerProfile._id);
            }
        }

        // 3. Delete the main User document. This runs for ALL users.
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // 4. Clear the authentication cookies to log the user out.
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        // You can also delete the refresh token from Redis here if you wish.

        res.status(200).json({ message: "Your account and all associated data have been successfully deleted." });

    } catch (error) {
        console.log("Error in deleting account", error);
        res.status(500).json({ message: "An error occurred while deleting your account." });
    }
};

//viewing classes on the customer facing 
export const viewAllClasses = async (req, res) => {
    try{
    // getting the classes that show available from the database, along with presenting the trainers profile that is hosting the class
        const classes = await Class.find({ status: "available" }).populate({
            path: 'trainer',
            populate:{
                path:'user',
                select: 'username'
            }
        });
        // if no classes are found return this 
        if (classes.length === 0){
            return res.status(404).json({message: "No classes found"});
        }
    // if classes were found then return all the classes 
        res.status(200).json({message: "Classes Found", classes})
    }catch (error){
        console.log("Error in viewing all the classes", error.message);
        res.status(500).json({message: "Cannot fetch all classes"});
    }
};

//booking a class
export const bookClass = async (req, res) => {
    try {
        // 1. Get the class ID from the URL and any additional data from body
        const { classId } = req.params;
        const { classDate, bookingDate, paymentStatus } = req.body;

        // 2. Find the class template by its primary _id
        const selectedClass = await Class.findById(classId);
        if (!selectedClass || selectedClass.status !== "available") {
            return res.status(404).json({ message: "This class is not available for booking." });
    }

    // 3. Check if user already has a booking
    const existingBooking = await Booking.findOne({
        class: classId,  // Changed from classId to class
        user: req.user._id,  // Changed from userId to user\
        bookingStatus: "confirmed",
    });

    if (existingBooking) {
        return res.status(400).json({ message: "You have already booked this class" });
    }

    // 4. Find all confirmed bookings for the class
    const confirmedBookingsCount = await Booking.countDocuments({
        class: classId,  // Changed from classId to class
        bookingStatus: "confirmed",
    });

    // 5. Check if class has reached max capacity
    if (confirmedBookingsCount >= selectedClass.capacity) {
        return res.status(400).json({ message: "class capacity full" });
    }

    // 6. Create booking with proper field names and data types
    const booking = await Booking.create({
        user: req.user._id,
        class: classId,      
        bookingStatus: "confirmed",
        paymentStatus: paymentStatus || "pending", 
        bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
        classDate: classDate ? new Date(classDate) : new Date(), 
    });

    // 7. Update class with attendee (fix the query)
    await Class.updateOne(
        { _id: classId }, 
        { 
            $inc: { bookedCount: 1 }, 
            $push: { attendees: req.user._id } 
        }
    );

    // 8. Add booking to user's bookings array
    await User.updateOne(
        { _id: req.user._id }, 
        { $push: { bookings: booking._id } }
    );

    res.status(201).json({ 
        message: "Class booked successfully", 
        booking 
    });

    } catch (error) {
        console.log("Error in bookClass controller:", error.message);
        res.status(500).json({ message: "An error occurred while booking the class." });
    }
};

// viewing the classes the user has booked in his profile 
export const viewBookedClasses = async (req, res) => {
    try {
        // Extract userId from the token
        const userId = req.user._id;

        // Find all bookings associated with the user
        const userBookings = await Booking.find({ user: userId }); 

        // Create an array to hold booked class details
        const bookedClasses = [];

    // Loop through each booking and find the associated class
    for (const booking of userBookings) {
        const selectedClass = await Class.findById(booking.class); 
            if (selectedClass) {
                bookedClasses.push({
                bookingId: booking._id,
                classId: selectedClass._id, 
                className: selectedClass.classTitle, 
                classType: selectedClass.classType,
                duration: selectedClass.duration,
                timeSlot: selectedClass.timeSlot,
                capacity: selectedClass.capacity,
                price: selectedClass.price,
                attendeesCount: selectedClass.attendees?.length || 0, 
                classPic: selectedClass.classPic,
                status: booking.bookingStatus,
                classDate: booking.classDate,
                paymentStatus: booking.paymentStatus,
            });
        }
    }

    const now = new Date();
    const upcoming = bookedClasses.filter(
        (b) => new Date(b.classDate) > now && b.status !== "cancelled"
    );
    const history = bookedClasses.filter(
        (b) => new Date(b.classDate) <= now || b.status === "cancelled"
    );

    const bookedClassIds = bookedClasses.map((b) => b.classId);

    const user = await User.findById(userId); 
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const preferredTypes = user.preferences || [];
    const goalTypes = user.goals || [];

    const recommendedClasses = await Class.find({
        _id: { $nin: bookedClassIds }, 
        status: "available",
        $or: [
            { classType: { $in: preferredTypes } },
            { classType: { $in: goalTypes } },
        ],
    }).select("-createdAt -updatedAt -__v");

    res.json({ upcoming, history, recommended: recommendedClasses });

    } catch (error) {
        console.error("Error in viewBookedClasses:", error.message);
        res.status(500).json({ message: "An error occurred while fetching booked classes." });
    }
};

export const cancelBooking = async (req,res) => {
    try{
        const { classId } = req.params;
        const userId = req.user._id;
        
        // Find the booking
        const booking = await Booking.findOne({ class: classId, user: userId});

        if(!booking){
            return res.status(404).json({message: "Booking not found"});
        };
        
        // Get the class and check if user is in attendees
        const selectedClass = await Class.findOne({_id: classId});
            if(!selectedClass){
        return res.status(404).json({message: "Class not found"});
        }
        
        // Check if user is actually in the attendees list
        if(!selectedClass.attendees.includes(userId)) {
            return res.status(400).json({message: "User not found in class attendees"});
        }
        
        // Update booking status
        booking.bookingStatus = "cancelled";
        booking.refundStatus = "processed";
        await booking.save();
        
        // Remove user from attendees array AND decrease booked count
        await Class.updateOne({ _id: classId }, { 
            $pull: { attendees: userId },
            $inc: { bookedCount: -1 }
        });
        
        // Remove booking from user's bookings array
        await User.updateOne({ _id: userId}, {$pull: {bookings: booking._id}});
        
        res.json({message: "Booking cancelled and user removed from attendees"});
    }catch(error){
        console.error("error in cancelling booking", error.message)
        res.status(500).json({message: "Error occurred while cancelling booking"});
    }
}

// submitting feed back to the class 
export const submitFeedback = async (req, res) => {
    try {
        // Getting the class ID from the URL and the feedback from the body.
        const { classId } = req.params;
        const { rating, reviewText } = req.body;
        const userId = req.user._id;

        //Finding the class by its primary _id.
        const classInstance = await Class.findById(classId);
        if (!classInstance) {
            return res.status(404).json({ message: "Class not found" });
        }
        
        // Verify that the user has actually booked this class before allowing a review.
        const booking = await Booking.findOne({ user: userId, class: classId });
        if (!booking) {
            return res.status(403).json({ message: "You must book a class before you can review it." });
        }

        // Create the new review document. This works perfectly with your schema.
        const newReview = await Review.create({
            user: userId,
            trainer: classInstance.trainer,
            class: classId,
            rating,
            reviewText,
        });

        const trainer = await Trainer.findById(classInstance.trainer);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer associated with this class not found" });
        }

        const oldTotalRating = trainer.rating.averageRating * trainer.rating.totalReviews;
        const newTotalReviews = trainer.rating.totalReviews + 1;
        const newAverageRating = (oldTotalRating + rating) / newTotalReviews;

        trainer.rating.averageRating = newAverageRating;
        trainer.rating.totalReviews = newTotalReviews;
        await trainer.save();

        res.status(201).json({ message: "Feedback submitted successfully!", review: newReview });

    } catch (error) {
        console.log("Error in submitFeedback controller:", error.message);
        res.status(500).json({ message: "An error occurred while submitting feedback." });
    }
};

// updating review post 
export const updateFeedback = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, reviewText } = req.body;
        const userId = req.user._id;

        // finding the review by its ID 
        const review = await Review.findById(reviewId);

        // Security Check: Does the review exist and does it belong to the logged-in user?
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to edit this review." });
        }

        const oldRating = review.rating;
        const trainer = await Trainer.findById(review.trainer);


        review.rating = rating ?? review.rating;
        review.reviewText = reviewText ?? review.reviewText;
        const updatedReview = await review.save();

        if (trainer && rating !== undefined) {
            const oldTotalScore = (trainer.rating.averageRating * trainer.rating.totalReviews) - oldRating;
            const newTotalScore = oldTotalScore + rating;
            trainer.rating.averageRating = newTotalScore / trainer.rating.totalReviews; // Total reviews stays the same
            await trainer.save();
        }

        res.status(200).json({ message: "Review updated successfully", review: updatedReview });

    } catch (error) {
        console.log("Error in updateReview controller:", error.message);
        res.status(500).json({ message: "An error occurred while updating the review." });
    }
};

// Allows a user to delete a review they have previously submitted.
export const deleteFeedback = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);

        // Security Check: Does the review exist and does it belong to the logged-in user?
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this review." });
        }

        const trainer = await Trainer.findById(review.trainer);
        if (trainer) {
            const oldTotalScore = trainer.rating.averageRating * trainer.rating.totalReviews;
            const newTotalReviews = trainer.rating.totalReviews - 1;

            if (newTotalReviews > 0) {
                trainer.rating.averageRating = (oldTotalScore - review.rating) / newTotalReviews;
            } else {
                trainer.rating.averageRating = 0; 
            }
            trainer.rating.totalReviews = newTotalReviews;
            await trainer.save();
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({ message: "Review deleted successfully." });

    } catch (error) {
        console.log("Error in deleteReview controller:", error);
        res.status(500).json({ message: "An error occurred while deleting the review." });
    }
};

// viewing all trainers from customer standpoint 
export const allTrainers = async(req, res) => {
    try{
    const trainers = await Trainer.find({})
        .populate({
            path: 'user',
            select: 'username email -_id' // Get username and email, exclude the user's _id since you have trainer _id
        })
      .select('-__v'); // Optionally exclude version key

    if (trainers.length === 0) {
        return res.status(404).json({ message: "No trainers found" });
    }

    res.status(200).json(trainers);
    }catch (error){
        console.log("Error in getting all trainers",error.message);
        res.status(500).json({message: "error in the view all trainers controller"});
    }
}

// viewing a specific trainer by their profile id
export const viewTrainer = async (req, res) => {
    //! testing to see if the server is receiving the request and the trainerId
    const { trainerId } = req.params;
    // debug statement
    //console.log("Server received request for trainerId:", req.params.trainerId);
    try {
        // searching for the trainer, if he does exist return his profile with user info, username and email
        const trainer = await Trainer.findById(trainerId)
            .populate({
                path: 'user', // In the Trainer model, populate the 'user' field.
                select: 'username email' // Only get the username and email from the User model.
            });

        // user does not exist return a status of not found
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        //Find all classes where the 'trainer' field matches the Trainer's PROFILE ID.
        // This is the corrected query. also added class data to be shown on the trainer profile
        const classes = await Class.find({ trainer: trainerId, status: 'available' }).select(
        "classType className duration timeSlot  price bookedCount classId classPic"
    );
;

        //Combine the data into a clean response object.
        const response = {
            trainer: {
                _id: trainer._id,
                username: trainer.user.username, // Get username from the populated user object
                email: trainer.user.email,       // Get email from the populated user object
                specialization: trainer.specialization,
                bio: trainer.bio,
                experience: trainer.experience,
                certifications: trainer.certifications,
                rating: trainer.rating,
                availability: trainer.availability
            },
            classes: classes // The array of classes taught by this trainer
        };

        res.status(200).json(response);

    } catch (error) {
        console.log("Error in viewTrainerById controller", error.message);
        res.status(500).json({ message: "Error in the view trainer controller" });
    }
};