import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Class from "../models/class.model.js";
import { stripe } from "../lib/stripe.js";
import { sendEmail } from "../utils/emailService.js";

 // Creates a Stripe checkout session for a list of products from a shopping cart.
export const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products array is required" });
        }

        const lineItems = products.map((product) => {
            const amount = Math.round(product.productPrice * 100);

            // Create the base product data object
            const productData = {
                name: product.productName,
            };

            // Conditionally add the images array ONLY if a valid, non-empty image URL exists.
            if (product.img) {
                productData.images = [product.img];
            }

            return {
                price_data: {
                    currency: "usd",
                    product_data: productData, // Use the conditionally built object
                    unit_amount: amount,
                },
                quantity: product.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            metadata: {
                userId: req.user._id.toString(),
                products: JSON.stringify(
                    products.map((p) => ({
                        productId: p._id,
                        quantity: p.quantity,
                        price: p.productPrice,
                    }))
                ),
            },
        });

        // ✅ UPDATED: Return the full URL to make testing easy.
        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.log("Error in createCheckoutSession:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


//Verifies a successful product payment, creates an order, and clears the user's cart.

export const checkoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            const products = JSON.parse(session.metadata.products);
            const userId = session.metadata.userId;

            const existingOrder = await Order.findOne({ stripeSessionId: session.id });
            if (existingOrder) {
                return res.status(200).json({ success: true, message: "Order already exists.", orderId: existingOrder._id });
            }

            const newOrder = new Order({
                user: userId,
                products: products.map((product) => ({
                    product: product.productId,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: session.id,
            });

            await newOrder.save();
            await User.updateOne({ _id: userId }, { $set: { cartItems: [] } });

            // sending order confirmation email to the user
            try {
                const user = await User.findById(userId);
                if (user) {
                    const subject = `Your ABC Fitness Order Confirmation #${newOrder._id}`;
                    const text = `Hi ${user.username},\n\nThank you for your purchase! We've received your order and are getting it ready.\n\nOrder ID: ${newOrder._id}\nTotal Amount: $${newOrder.totalAmount.toFixed(2)}\n\nYou can view your order details in your profile.\n\nThanks for shopping with us!`;
                    
                    await sendEmail(user.email, subject, text);
                    console.log(`Order confirmation email sent to ${user.email}`);
                }
            } catch (emailError) {
                // If the email fails, the order should still succeed.
                console.error("Failed to send order confirmation email, but order was created:", emailError);
            }

            res.status(200).json({
                success: true,
                message: "Payment successful and order created",
                orderId: newOrder._id,
            });
        } else {
            res.status(400).json({ success: false, message: "Payment not successful" });
        }
    } catch (error) {
        console.log("Error in checkoutSuccess:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


//Creates a Stripe checkout session for a single class booking.
export const createBookingCheckoutSession = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user._id;

        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        const booking = await Booking.findOne({ _id: bookingId, user: userId });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found or not owned by user." });
        }
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ message: "This booking has already been paid for." });
        }

        const classDetails = await Class.findById(booking.class);
        if (!classDetails) {
            return res.status(404).json({ message: "Associated class not found." });
        }

        const lineItems = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: classDetails.classTitle,
                    images: [classDetails.classPic],
                },
                unit_amount: Math.round(classDetails.price * 100),
            },
            quantity: 1,
        }];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/booking-cancel`,
            metadata: {
                bookingId: bookingId,
            },
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.log("Error in createBookingCheckoutSession:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


//Verifies a successful booking payment and updates the booking status.

export const bookingCheckoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            const bookingId = session.metadata.bookingId;

            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { $set: { paymentStatus: 'paid', status: 'upcoming' } },
                { new: true }
            ).populate('user').populate({
                path: 'class',
                populate: {
                    path: 'trainer',
                    populate: {
                        path: 'user',
                        select: 'username email'
                    }
                }
            });

            if (!updatedBooking) {
                return res.status(404).json({ message: "Booking not found to update." });
            }

            // --- SEND CONFIRMATION EMAILS ---
            const user = updatedBooking.user;
            const classDetails = updatedBooking.class;
            const trainerUser = updatedBooking.class.trainer.user;

            // 1. Send email to the CUSTOMER
            try {
                const subject = `Booking Confirmation: ${classDetails.classTitle}`;
                const text = `Hi ${user.username},\n\nThis confirms your booking for the class:\n\nClass: ${classDetails.classTitle}\nDate: ${updatedBooking.startTime.toDateString()}\nTime: ${classDetails.timeSlot.startTime}\n\nWe look forward to seeing you!`;
                await sendEmail(user.email, subject, text);
            } catch (emailError) {
                console.error("Failed to send booking confirmation email to user:", emailError);
            }

            // 2. Send notification email to the TRAINER
            try {
                const subject = `New Booking for Your Class: ${classDetails.classTitle}`;
                const text = `Hi ${trainerUser.username},\n\nA new user, ${user.username}, has just booked your class "${classDetails.classTitle}" for ${updatedBooking.startTime.toDateString()} at ${classDetails.timeSlot.startTime}.\n\nYour class roster has been updated.`;
                await sendEmail(trainerUser.email, subject, text);
            } catch (emailError) {
                console.error("Failed to send new booking notification to trainer:", emailError);
            }

            res.status(200).json({
                success: true,
                message: "Payment successful and booking confirmed",
                bookingId: updatedBooking._id,
            });
        } else {
            res.status(400).json({ success: false, message: "Payment not successful" });
        }
    } catch (error) {
        console.log("Error in bookingCheckoutSuccess:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
