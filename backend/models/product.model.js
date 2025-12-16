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
    productImage:{
        type: String,
        default: "",
        required: true
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
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
