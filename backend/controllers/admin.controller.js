import User from "../models/user.model.js";
import Class from "../models/class.model.js";
import Order from "../models/order.model.js";
import Booking from "../models/booking.model.js";


// viewing all users including trainers from the data base 
export const viewAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password'); // Exclude password field
        res.status(200).json(users);
    } catch (error){
        res.status(500).json({message: error.message}); 
        console.log("Error in viewing all users in admin controller", error.message);
    }
}

// viewing incomplete profile setup trainer profile 
export const pendingTrainerProfiles = async (req, res) => {
    try{
        const pendingProfiles = await User.aggregate([
            {
                $match: { role: 'trainer' } // Match users with the 'trainer' role
            },
            {
                $lookup: {
                    from: 'trainers', // The collection to join with (use the plural name)
                    localField: '_id', // The field from the User collection
                    foreignField: 'user', // The field from the Trainer collection
                    as: 'trainerProfile' // The name for the new array field to add
                }
            },
            // Stage 3: Filter the results to find only those where the 'trainerProfile' array is EMPTY.
            // An empty array means no matching profile was found.
            {
                $match: { trainerProfile: { $size: 0 } }
            },
            // Stage 4 (Optional): Clean up the output to only send necessary fields.
            {
                $project: {
                    username: 1,
                    email: 1,
                    role: 1,
                    createdAt: 1
                }
            }
        ]);
        
        res.status(200).json(pendingProfiles);
    }catch (error){
        res.status(500).json({message: error.message});
        console.log("Error in viewing pending trainer profiles in admin controller", error.message);
    }
}

// viewing all trainers from the data base
export const viewAllTrainers = async (req, res) =>{
    try{
        const trainers = await User.find({ role: 'trainer' }).select('-password'); // Exclude password field
        res.status(200).json(trainers);
    } catch (error){
        res.status(500).json({message: error.message});
        console.log("Error in viewing all trainers in admin controller", error.message);
    }
}

// this is for the admin to promote a user to a trainer
export const changeUserStatus = async (req, res) => {
    try{
        const { userId } = req.params; // get User id from the URL

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { role: 'trainer' } },
            { new: true }
        ).select('-password');

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({ 
            message: `Successfully promoted ${user.username} to trainer.`,
            user 
        });

    } catch (error){
        console.log("Error in creating trainer in admin controller", error.message);
        res.status(500).json({message: "Server error in creating trainer"});
    }
};

// deleting a user from the data base
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete({ _id: req.params.userId });
        res.status(200).json({ message: "User deleted successfully" });
    }catch (error){
        res.status(500).json({message: error.message});
        console.log("Error in deleting user in admin controller", error.message);
    }
}

// viewing all the classes from the data base 
export const viewClassInsights = async (req, res) => {
    try {
        const viewClasses = await Class.find();
        res.status(200).json(viewClasses);
    } catch (error){
        console.log("Error in viewing class insights in admin controller", error.message);
        res.status(500).json({message: error.message});
    }
}

// getting dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // --- Financial Stats ---
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // ✅ NEW: Calculate total revenue from paid class bookings
        const bookingRevenueStats = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $lookup: { // Join with the classes collection to get the price
                    from: 'classes',
                    localField: 'class',
                    foreignField: '_id',
                    as: 'classDetails'
                }
            },
            { $unwind: '$classDetails' }, // Deconstruct the classDetails array
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$classDetails.price' }
                }
            }
        ]);

        const totalProductRevenue = orderStats[0]?.totalRevenue || 0;
        const totalClassRevenue = bookingRevenueStats[0]?.totalRevenue || 0; // Get the result
        const totalOrders = orderStats[0]?.totalOrders || 0;
        const totalPaidBookings = await Booking.countDocuments({ paymentStatus: 'paid' });

        // --- User Stats ---
        const totalUsers = await User.countDocuments();
        const totalTrainers = await User.countDocuments({ role: 'trainer' });
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        // --- Class Stats ---
        const mostBookedClasses = await Booking.aggregate([
            { $match: { status: 'upcoming' } },
            { $group: { _id: "$class", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'classes',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'classDetails'
                }
            },
            { $unwind: '$classDetails' },
            { 
                $project: {
                    _id: 0,
                    classId: '$_id',
                    className: '$classDetails.classTitle',
                    bookingCount: '$count'
                }
            }
        ]);

        // Combine all stats into a single response object
        const stats = {
            financials: {
                totalProductRevenue,
                totalClassRevenue, // ✅ ADDED: Include the new stat in the response
                totalOrders,
                totalPaidBookings
            },
            users: {
                totalUsers,
                totalTrainers,
                totalCustomers,
                newUsersThisMonth
            },
            classes: {
                mostBookedClasses
            }
        };

        res.status(200).json(stats);

    } catch (error) {
        console.log("Error in getDashboardStats controller:", error);
        res.status(500).json({ message: "Server Error" });
    }
};