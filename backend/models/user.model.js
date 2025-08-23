import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        isAdmin:{ 
            type: Boolean,
            required: true,
            default: false //ensuring that not all users will be admins 
        }
    },
    {timestamps: true}
);

const User = mongoose.model("UserProduct", userSchema);

export default User;