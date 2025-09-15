import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";
import Class from "../models/class.model.js";
import Booking from "../models/booking.model.js";

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
        console.log("Error in getting profile", error);
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
        console.log("Error in editing user info", error);
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
        console.log("Error in viewing all the classes", error);
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
        user: req.user._id,  // Changed from userId to user
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
        user: req.user._id,  // Changed from userId to user
        class: classId,      // Changed from classId to class
        bookingStatus: "confirmed",
        paymentStatus: paymentStatus || "pending", // Use provided value or default
        bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
        classDate: classDate ? new Date(classDate) : new Date(), // Proper Date object
    });

    // 7. Update class with attendee (fix the query)
    await Class.updateOne(
        { _id: classId }, // Fixed: use _id instead of classId
        { 
            $inc: { bookedCount: 1 }, 
            $push: { attendees: req.user._id } // Fixed: use _id
        }
    );

    // 8. Add booking to user's bookings array
    await User.updateOne(
      { _id: req.user._id }, // Fixed: use _id instead of id
      { $push: { bookings: booking._id } } // Use booking._id instead of classId
    );

    res.status(201).json({ 
        message: "Class booked successfully", 
        booking 
    });

    } catch (error) {
        console.log("Error in bookClass controller:", error);
        res.status(500).json({ message: "An error occurred while booking the class." });
    }
};

// viewing the classes the user has booked in his profile 
export const viewBookedClasses = async (req, res) => {
    try {
        // Extract userId from the token
        const userId = req.user._id; // Fixed: use _id

        // Find all bookings associated with the user
        const userBookings = await Booking.find({ user: userId }); // Fixed: use 'user'

        // Create an array to hold booked class details
        const bookedClasses = [];

    // Loop through each booking and find the associated class
    for (const booking of userBookings) {
      const selectedClass = await Class.findById(booking.class); // Fixed: use booking.class and findById
        if (selectedClass) {
            bookedClasses.push({
            bookingId: booking._id,
            classId: selectedClass._id, // Fixed: use _id
            className: selectedClass.classTitle, // Fixed: use classTitle
            classType: selectedClass.classType,
            duration: selectedClass.duration,
            timeSlot: selectedClass.timeSlot,
            capacity: selectedClass.capacity,
            price: selectedClass.price,
            attendeesCount: selectedClass.attendees?.length || 0, // Fixed: count attendees
            classPic: selectedClass.classPic,
            status: booking.bookingStatus,
            classDate: booking.classDate,
            paymentStatus: booking.paymentStatus,
            });
        }
    }

    // Rest of the function remains the same with the fixes from above...
    const now = new Date();
    const upcoming = bookedClasses.filter(
        (b) => new Date(b.classDate) > now && b.status !== "cancelled"
    );
    const history = bookedClasses.filter(
        (b) => new Date(b.classDate) <= now || b.status === "cancelled"
    );

    const bookedClassIds = bookedClasses.map((b) => b.classId);

    const user = await User.findById(userId); // Fixed: use findById
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const preferredTypes = user.preferences || [];
    const goalTypes = user.goals || [];

    const recommendedClasses = await Class.find({
        _id: { $nin: bookedClassIds }, // Fixed: use _id
        status: "available",
        $or: [
            { classType: { $in: preferredTypes } },
            { classType: { $in: goalTypes } },
        ],
    }).select("-createdAt -updatedAt -__v");

    res.json({ upcoming, history, recommended: recommendedClasses });

    } catch (error) {
        console.error("Error in viewBookedClasses:", error);
        res.status(500).json({ message: "An error occurred while fetching booked classes." });
    }
};