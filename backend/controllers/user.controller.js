import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";
import Class from "../models/class.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";

// getting user info by id 
export const getProfile = async (req, res) => {
    try {
        // Fetch the user's core data and populate the bookings array.
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate({
                path: 'bookings',
                model: 'Booking',
                populate: {
                    path: 'class',
                    model: 'Class',
                    select: 'classTitle startTime'
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'trainer') {
            const trainerProfile = await Trainer.findOne({ user: user._id });
            const trainerClasses = trainerProfile ? await Class.find({ trainer: trainerProfile._id }) : [];
            
            const fullProfile = {
                ...user.toObject(),
                trainerProfile,
                classes: trainerClasses
            };
            return res.status(200).json(fullProfile);
        }
        
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
        const { classId } = req.params;
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ message: "A specific date must be provided to book a class." });
        }
        
        const selectedClass = await Class.findById(classId);
        if (!selectedClass || selectedClass.status !== "available") {
            return res.status(404).json({ message: "This class is not available for booking." });
        }

        const startTime = new Date(`${date}T${selectedClass.timeSlot.startTime}:00`);
        const endTime = new Date(`${date}T${selectedClass.timeSlot.endTime}:00`);

        // Check for double booking for this specific session
        const existingBooking = await Booking.findOne({ class: classId, user: req.user._id, startTime });
        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this specific class session." });
        }

        // Check capacity for this specific session
        // Note: This relies on the Booking collection, which is a good practice.
        const confirmedBookingsCount = await Booking.countDocuments({ class: classId, startTime, status: "upcoming" });
        if (confirmedBookingsCount >= selectedClass.capacity) {
            return res.status(400).json({ message: "Sorry, this class session is full." });
        }

        // 1. Create the booking document (the primary source of truth).
        const newBooking = await Booking.create({
            user: req.user._id,
            class: classId,
            trainer: selectedClass.trainer,
            startTime,
            endTime,
            status: "upcoming",
            paymentStatus: "pending",
        });

        // 2. Add the user's ID to the class's attendees array.
        await Class.updateOne({ _id: classId }, { $push: { attendees: req.user._id } });

        // 3. Add the new booking's ID to the user's bookings array.
        await User.updateOne({ _id: req.user._id }, { $push: { bookings: newBooking._id } });

        res.status(201).json({ message: "Class booked successfully", booking: newBooking });
    } catch (error) {
        console.log("Error in bookClass controller:", error);
        res.status(500).json({ message: "An error occurred while booking the class." });
    }
};
// viewing the classes the user has booked in his profile 
export const viewBookedClasses = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .sort({ startTime: 'desc' })
            .populate({
                path: 'class',
                select: 'classTitle timeSlot classPic',
                populate: {
                    path: 'trainer',
                    select: 'specialization',
                    populate: { path: 'user', select: 'username' }
                }
            });

        const now = new Date();
        const upcoming = bookings.filter(b => b.startTime > now && b.status === 'upcoming');
        const history = bookings.filter(b => b.startTime <= now || b.status !== 'upcoming');

        res.status(200).json({ upcoming, history });
    } catch (error) {
        console.error("Error in viewBookedClasses:", error);
        res.status(500).json({ message: "An error occurred while fetching your bookings." });
    }
};

// cancelling a booking by book id logged in as the user
export const cancelBooking = async (req,res) => {
    try{
        const { bookingId } = req.params;
        const userId = req.user._id;
        
        // Find the booking
        const booking = await Booking.findOne({ user: userId, _id: bookingId });
        if(!booking){
            return res.status(404).json({message: "Booking not found"});
        };
        
        // Get the class using booking.class (not undefined classId)
        const selectedClass = await Class.findOne({_id: booking.class});  // ✅ Fixed
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
        await Class.updateOne({ _id: booking.class }, {  // ✅ Use booking.class
            $pull: { attendees: userId },
            $inc: { bookedCount: -1 }
        });
        
        // Remove booking from user's bookings array
        await User.updateOne({ _id: userId}, {$pull: {bookings: booking._id}});  // ✅ Fixed _id fields
        
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