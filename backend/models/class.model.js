import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
// this is the title of the class
    classTitle: {
        type: String,
        required: true
    },
// this will refer to the trainer schema
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true
    },
// class description of the class
    classDescription:{
        type: String,
        required: true
    },
// 
    classType: {
        type: String,
        required: true
    },

    duration: {
        type: Number, // this will be in minutes 
    }, 
// the day and time of the class
    timeSlot: {
        day: {
            type: String,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },

    classPic: {
        type: String,
    },
// how many people can be in the class
    capacity: {
        type: Number,
        required: true,
        default: 0 // need to set a default value for required numbers

    },
// price of the class
    price: {
        type: Number,
        required: true,
        min: 0
    },
// how many people are in the class
    attendees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
// status of the class if booked or not
    status: {
        type: String,
        enum: ["available", "cancelled", "completed"],
        default: "available" // default when not booked.
    }
}, { timestamps: true });

const Class = mongoose.model("Class", classSchema);

export default Class;