import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true
    },
    rating: {
        type: Number
    },
    reviewText: {
        type: String,
    }
    }, {timestamps: true}
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;