import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    cancelledAt: {
        type: Date
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'paid'
    }
}, { 
    timestamps: true 
});

// ✅ Updated compound index - only apply to non-cancelled bookings
bookingSchema.index(
    { class: 1, user: 1, startTime: 1 }, 
    { 
        unique: true,
        partialFilterExpression: { status: { $ne: 'cancelled' } } // ✅ Exclude cancelled bookings from unique constraint
    }
);

// Index for efficient queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ class: 1, sessionDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;