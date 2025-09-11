import User from "../models/user.model.js";
import Class from "../models/class.model.js";


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