import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    age:{
        type: Number,
        required: true  
    },
    gender:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required: true,
        min: 0
    },
    speciality: {
        type: String,
        required: true
    },
    timeslot:{
        type: String,
        required: true
    }
}, {timestamps: true}
);

const Trainer = mongoose.model("Trainer", trainerSchema);

export default Trainer;