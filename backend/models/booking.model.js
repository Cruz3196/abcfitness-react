import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    // Reference to the user who made the booking.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Reference to the class template that was booked.
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    // Denormalized reference to the trainer for easier queries.
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true
    },

    // --- REVISED DATE/TIME (Recommended) ---
    // The exact start date and time of the booked session.
    startTime: {
        type: Date,
        required: true
    },
    // The exact end time of the session.
    endTime: {
        type: Date,
        required: true
    },

    // --- REVISED STATUS ---
    // A single, clear status for the booking.
    status: {
        type: String,
        enum: ["upcoming", "completed", "cancelled", "no-show"],
        default: "upcoming"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending",
    },
    stripePaymentIntentId: {
        type: String,
    }


}, { timestamps: true });

// Prevents a user from booking the exact same class session twice.
// This is very precise and reliable.
bookingSchema.index({ class: 1, user: 1, startTime: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;