import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
		hasTrainerProfile: { // ✅ Add this field
        type: Boolean,
        default: false
    }	,
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
		profileImage: {
			type: String,
			default: "",
		},
		password: {
            type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
        },
		passwordResetToken: {
			type: String,
		},
		passwordResetExpires: {
			type: Date,
		},
		goals: {
			type: String,
		},
		bookings: [
			{
				type: mongoose.Schema.Types.ObjectId, // ✅ Changed from String to ObjectId
				ref: "Booking",
			}
		],
		availability: {
			type: String,
			enum: ["morning", "afternoon", "evening"]
		},
		orderHistory: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Order",
			default: []
		},
        cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin", "trainer"],
			default: "customer",
		},
		
    },
    {timestamps: true}
);

//bycrpt for hashing password 
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;