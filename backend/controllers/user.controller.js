import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";
import Class from "../models/class.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
// services
import { sendEmail } from "../utils/emailService.js";
import crypto from "crypto";
import cloudinary from "../lib/cloudinaryConfig.js";

// getting user info by id 
export const getProfile = async (req, res) => {
    try {
        // ✅ Just fetch user data, no bookings population
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'trainer') {
            const trainerProfile = await Trainer.findOne({ user: user._id });
            const trainerClasses = trainerProfile ? await Class.find({ trainer: trainerProfile._id }) : [];
            
            const fullProfile = {
                ...user.toObject(),
                hasTrainerProfile: !!trainerProfile,
                trainerProfile: trainerProfile ? {
                    ...trainerProfile.toObject(),
                    user: {
                        username: user.username,
                        email: user.email
                    }
                } : null,
                classes: trainerClasses
            };
            return res.status(200).json(fullProfile);
        }
        
        // ✅ For customers, just return user data
        const userProfile = {
            ...user.toObject(),
            hasTrainerProfile: false
        };
        
        res.status(200).json(userProfile);

    } catch (error) {
        console.log("Error in getting profile", error.message);
        res.status(500).json({ message: "Error in getting profile" });
    }
};

// forgot password 
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "If a user with that email exists, a password reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const passwordResetExpires = Date.now() + 10 * 60 * 1000;

        user.passwordResetToken = passwordResetToken;
        user.passwordResetExpires = passwordResetExpires;
        await user.save();
        // sending the reset link to the user via email 
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const subject = "Your Password Reset Link (Valid for 10 Minutes)";
        const text = `Hi ${user.username},\n\nYou requested a password reset. Please click on the following link to reset your password:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

        await sendEmail(user.email, subject, text);

        res.status(200).json({ message: "If a user with that email exists, a password reset link has been sent." });

    } catch (error) {
        // This is a safety measure. req.user will likely not exist here.
        // The core logic is to prevent leaving hanging tokens in the DB if something fails.
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save();
            }
        } catch (cleanupError) {
            console.log("Error during forgotPassword cleanup:", cleanupError);
        }
        console.log("Error in forgotPassword controller:", error);
        res.status(500).json({ message: "An error occurred." });
    }
};


// reset password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // 1. Hash the incoming token to match the one stored in the database
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 2. Find the user by the hashed token and check if it's still valid
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Check if token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        // 3. Set the new password
        user.password = password; // The pre-save hook will hash this automatically

        // 4. Clear the reset token fields from the user document
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        // (Optional) Log the user in by generating new tokens
        // const { accessToken, refreshToken } = generateTokens(user._id); ...

        res.status(200).json({ message: "Password has been successfully reset." });

    } catch (error) {
        console.log("Error in resetPassword controller:", error);
        res.status(500).json({ message: "An error occurred." });
    }
};

// editing user info by id
export const editUserInfo = async (req, res) => {
    try {
        const { username, email, goals, availability, currentPassword, newPassword, profileImage } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // --- PROFILE IMAGE UPLOAD LOGIC ---
        if (profileImage) {
            // If the user already has a profile image, delete the old one from Cloudinary.
            if (user.profileImage) {
                try {
                    const publicId = user.profileImage.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`user_profiles/${publicId}`);
                } catch (cloudinaryError) {
                    console.error("Failed to delete old profile image from Cloudinary:", cloudinaryError);
                    // Don't block the update if deletion fails, just log it.
                }
            }
            // Upload the new image to a 'user_profiles' folder in Cloudinary.
            const uploadedImage = await cloudinary.uploader.upload(profileImage, {
                folder: "user_profiles",
            });
            user.profileImage = uploadedImage.secure_url;
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

        // --- GENERAL PROFILE UPDATES ---
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
            profileImage: savedUser.profileImage, // Include the new image URL
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
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Store the details for the email in a separate, simple object before deleting anything.
        const emailDetails = {
            email: user.email,
            username: user.username
        };

        // If the user is a trainer, delete their profile and classes first.
        if (user.role === 'trainer') {
            const trainerProfile = await Trainer.findOne({ user: userId });
            if (trainerProfile) {
                await Class.deleteMany({ trainer: trainerProfile._id });
                await Trainer.findByIdAndDelete(trainerProfile._id);
            }
        }

        // Also delete all bookings made by this user to clean up the database.
        await Booking.deleteMany({ user: userId });

        // Finally, delete the main User document.
        await User.findByIdAndDelete(userId);

        // good bye email to the user
        try {
            const subject = "Your ABC Fitness Account Has Been Deleted";

            const text = `Hi ${emailDetails.username},\n\nThis is a confirmation that your account with the email ${emailDetails.email} has been permanently deleted as you requested.`;
            await sendEmail(emailDetails.email, subject, text);
            console.log(`Goodbye email sent to ${emailDetails.email}`);
        } catch (emailError) {
            console.error("Failed to send goodbye email, but account was deleted.", emailError);
        }
        // Clear authentication cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({ message: "Your account has been successfully deleted." });

    } catch (error) {
        console.log("Error in deleting account", error);
        res.status(500).json({ message: "An error occurred while deleting your account." });
    }
};

//viewing classes on the customer facing 
export const viewAllClasses = async (req, res) => {
    try{
        // getting the classes that show available from the database, along with presenting the trainers profile that is hosting the class
        const classes = await Class.find({ status: "available" })
            .populate({
                path: 'trainer',
                populate:{
                    path:'user',
                    select: 'username'
                }
            })
            .populate('attendees', 'username email'); 
        
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
        const { startTime, endTime } = req.body;
        const classId = req.params.classId;
        const userId = req.user._id;

        console.log('🔍 Booking request:', { classId, startTime, endTime, userId });

        // Validate inputs
        if (!startTime || !endTime) {
            return res.status(400).json({ message: "Start time and end time are required" });
        }

        // Check if class exists
        const classToBook = await Class.findById(classId)
            .populate({
                path: 'trainer',
                populate: { path: 'user', select: 'username email' }
            });

        if (!classToBook) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Check if class is full
        if (classToBook.attendees.length >= classToBook.capacity) {
            return res.status(400).json({ message: "Class is full" });
        }

        // ✅ SIMPLE: Try to create booking - if duplicate, it will fail
        const newBooking = new Booking({
            user: userId,
            class: classId,
            sessionDate: new Date(startTime),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            paymentStatus: 'paid'
        });

        const savedBooking = await newBooking.save();

        // Add user to class attendees
        await Class.findByIdAndUpdate(classId, {
            $addToSet: { attendees: userId }
        });

        console.log(' Booking created:', savedBooking._id);

        res.status(201).json({
            message: "Class booked successfully",
            booking: savedBooking
        });

    } catch (error) {
        console.error("❌ Error in bookClass:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "You already have a booking for this class" 
            });
        }
        
        res.status(500).json({ message: "Server error" });
    }
};

// viewing the classes the user has booked in his profile
export const viewBookedClasses = async (req, res) => {
    try {
        const userId = req.user._id;

        console.log('🔍 Fetching bookings for user:', userId);

        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'class',
                select: 'classTitle description capacity price timeSlot',
                populate: {
                    path: 'trainer',
                    populate: {
                        path: 'user',
                        select: 'username'
                    }
                }
            })
            .sort({ createdAt: -1 });

        console.log('✅ Found bookings:', bookings.length);

        res.status(200).json({ 
            success: true,
            bookings 
        });
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// Update your cancelBooking function:
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        console.log('🔍 Cancelling booking:', { bookingId, userId });

        // Find and delete the booking
        const booking = await Booking.findOneAndDelete({ 
            _id: bookingId, 
            user: userId 
        }).populate('class', 'classTitle price');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Remove user from class attendees
        await Class.findByIdAndUpdate(booking.class._id, {
            $pull: { attendees: userId }
        });

        console.log('✅ Booking deleted and user removed from attendees');

        res.status(200).json({ 
            message: "Booking cancelled successfully",
            refundAmount: booking.class.price
        });

    } catch (error) {
        console.error("❌ Error cancelling booking:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// submitting feed back to the class 
export const submitFeedback = async (req, res) => {
    try {
        // Getting the class ID from the URL and the feedback from the body.
        const { classId } = req.params;
        const { rating: ratingStr, reviewText } = req.body;
        const userId = req.user._id;

        // ✅ Parse and validate rating
        const rating = parseInt(ratingStr, 10);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
        }


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


        // ✅ Populate the user data before sending response
        const populatedReview = await Review.findById(newReview._id)
            .populate({
                path: 'user',
                select: 'username profileImage'
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

        // ✅ Return the populated review instead of the raw one
        res.status(201).json({ 
            message: "Feedback submitted successfully!", 
            review: populatedReview 
        });

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

// fetching a review by class id 
export const fetchFeedBackByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        
        const reviews = await Review.find({ class: classId })
            .populate({
                path: 'user',
                select: 'username profileImage'
            })
            .sort({ createdAt: -1 });
            
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews" });
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
    const { trainerId } = req.params;
    
    try {
        // searching for the trainer, if he does exist return his profile with user info, username and email
        const trainer = await Trainer.findById(trainerId)
            .populate({
                path: 'user',
                select: 'username email'
            });

        // user does not exist return a status of not found
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        // Find all classes where the 'trainer' field matches the Trainer's PROFILE ID.
        const classes = await Class.find({ 
            trainer: trainerId, 
            status: 'available' 
        }).select('classTitle classType duration timeSlot price classPic capacity attendees');

        // ✅ Return the trainer data in a consistent format
        const response = {
            _id: trainer._id,
            user: {
                username: trainer.user.username,
                email: trainer.user.email
            },
            specialization: trainer.specialization,
            bio: trainer.bio,
            yearsOfExperience: trainer.yearsOfExperience, // ✅ Fixed field name
            certifications: trainer.certifications,
            trainerProfilePic: trainer.trainerProfilePic,
            rating: trainer.rating,
            availability: trainer.availability,
            classes: classes
        };

        res.status(200).json(response);

    } catch (error) {
        console.log("Error in viewTrainerById controller", error.message);
        res.status(500).json({ message: "Error in the view trainer controller" });
    }
};

export const getOrderHistory = async (req, res) => {
    try {
        console.log('🔍 Fetching orders for user:', req.user._id);

        // Find all orders for this user and populate product details
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: 'products.product',
                select: 'productName productPrice productImage'
            })
            .sort({ createdAt: -1 }); // Most recent first

        console.log('✅ Found orders:', orders.length);

        // Format orders for frontend
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderId: order._id,
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,
            status: 'completed', // You can add a status field to your Order model
            stripeSessionId: order.stripeSessionId,
            itemCount: order.products.length,
            items: order.products.map(item => ({
                name: item.product?.productName || 'Unknown Product',
                image: item.product?.productImage || '/api/placeholder/48/48',
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.price * item.quantity
            }))
        }));

        res.status(200).json({
            success: true,
            orders: formattedOrders
        });

    } catch (error) {
        console.error('❌ Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order history',
            error: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        console.log('🔍 Fetching order:', orderId, 'for user:', req.user._id);

        // Find the specific order for this user
        const order = await Order.findOne({ 
            _id: orderId, 
            user: req.user._id 
        }).populate({
            path: 'products.product',
            select: 'productName productImage productPrice'
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('✅ Order found:', order._id);

        // Format order for frontend
        const formattedOrder = {
            _id: order._id,
            orderId: order._id,
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,
            status: 'completed', // You can add a status field to your Order model
            stripeSessionId: order.stripeSessionId,
            itemCount: order.products.length,
            items: order.products.map(item => ({
                name: item.product?.productName || 'Unknown Product',
                image: item.product?.productImage || '/api/placeholder/64/64',
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.price * item.quantity,
                productId: item.product?._id
            }))
        };

        res.status(200).json({
            success: true,
            order: formattedOrder
        });

    } catch (error) {
        console.error('❌ Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order details',
            error: error.message
        });
    }
};