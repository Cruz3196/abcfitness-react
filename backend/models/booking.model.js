import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true,
        default: 60
    }
}, {timestamps: true}
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;