import mongoose from "mongoose";

const eventScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    category:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Event = mongoose.model("Event", eventScheme);

export default Product;