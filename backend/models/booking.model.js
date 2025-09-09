import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
// this will refer to the user schema 
    user: { // The user who books the class
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
// this will refer to the class schema for the class that the user is booking
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },

    bookingStatus: {
        type: String, 
        enum: ["confirmed", "cancelled", "pending", "completed"],
        default: "confirmed"
    },

    paymentStatus:{
        type: String,
        enum: ["none", "requested", "processed", "denied"],
        default: "none",
    },

    refundStatus: {
        type: String,
        enum: ["none", "requested", "processed", "denied"],
        default: "none",
    },

    cancellationReason: {
        type: String,
    },

    bookingDate: {
        type: Date,
        required: true
    },

    classDate: {
        type: Date,
        required: true
    },

    classStatus: {
        type: String, 
        enum: ["upcoming", "completed", "cancelled"],
        required: true,
        default: "upcoming", // default to upcoming when the booking is booked.
    }
}, {timestamps: true}
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;