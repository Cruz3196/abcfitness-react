import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: 0 // Price cannot be negative
    },
    img:{
        type: String,
        required: [true, "Image is required"]
    },
    rating: { // THE OVERALL AVERAGE RATING
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: { // THE TOTAL NUMBER OF REVIEWS
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    reviews:[
        {
            text: {
                type: String,
                required: true
            },
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }
    ]
}, { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
