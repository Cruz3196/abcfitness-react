import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true
    },
    productPrice:{
        type: Number,
        required: true,
        min: 0 // Price cannot be negative
    },
    img:{
        type: String,
        // required: [true, "Image is required"]
    },
    productRating: { // THE OVERALL AVERAGE RATING
        type: Number,
        required: true,
        default: 0,
    },
    productCategory: {
        type: String,
        // required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    productReviews:[
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
