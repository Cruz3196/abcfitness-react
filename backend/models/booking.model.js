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
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'paid'
    }
}, { 
    timestamps: true 
});

// ✅ SIMPLE: One user, one class = unique booking
bookingSchema.index({ user: 1, class: 1 }, { unique: true });

// Performance indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ class: 1, sessionDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;