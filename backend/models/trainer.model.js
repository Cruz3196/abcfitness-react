import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
    // The field links this trainer profile to specific user document.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },

    bio: {
        type: String,
    },

    specialization: {
        type: String,
        required: true
    },

    certifications: {
        type: String,
    },

    experience: {
        type: Number,
    },

    rating: {
        averageRating: { 
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },

    availability:[
        {
            day: {
                type: String,
            },
            timeSlots:{
                type: String,
            }
        }
    ],

    canceledUserIds: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    
}, {timestamps: true}
);

const Trainer = mongoose.model("Trainer", trainerSchema);

export default Trainer;