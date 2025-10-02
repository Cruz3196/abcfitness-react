import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Class from "../models/class.model.js";
import { stripe } from "../lib/stripe.js";
import { sendOrderConfirmationEmail } from "../utils/nodemailerConfig.js";

 // Creates a Stripe checkout session for a list of products from a shopping cart.
export const createCheckoutSession = async (req, res) => {
    
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            console.log('❌ Invalid products array');
            return res.status(400).json({ message: "Products array is required" });
        }

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.productName,
                    images: [product.img],
                },
                unit_amount: Math.round(product.productPrice * 100), // Convert to cents
            },
            quantity: product.quantity,
        }));

        console.log('🔍 Line items created:', lineItems.length);

        // ✅ Prepare metadata with all required fields
        const metadataProducts = products.map(p => ({
            _id: p._id,
            productName: p.productName,
            productPrice: p.productPrice, // ✅ This will map to 'price' in Order
            quantity: p.quantity,
            img: p.img
        }));

        console.log('🔍 Metadata products:', metadataProducts);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            metadata: {
                userId: req.user._id.toString(),
                products: JSON.stringify(metadataProducts)
            },
        });

        console.log('✅ Stripe session created:', session.id);
        console.log('🔍 Session metadata:', session.metadata);

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("❌ Error in createCheckoutSession:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//Verifies a successful product payment, creates an order, and clears the user's cart.

export const checkoutSuccess = async (req, res) => {
    console.log('🚀 checkoutSuccess endpoint hit!');
    console.log('Request body:', req.body);
    
    try {
        const { session_id } = req.body;
        
        if (!session_id) {
            console.log('❌ No session_id provided');
            return res.status(400).json({ 
                success: false, 
                message: "Session ID is required" 
            });
        }

        // ✅ First, check if order already exists
        const existingOrder = await Order.findOne({ stripeSessionId: session_id });
        if (existingOrder) {
            console.log('✅ Order already exists:', existingOrder._id);
            return res.status(200).json({
                success: true,
                message: "Order already processed",
                orderId: existingOrder._id,
            });
        }

        console.log('🔍 Verifying session:', session_id);

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        console.log('✅ Stripe session retrieved');

        if (session.payment_status === "paid") {
            console.log('✅ Payment confirmed as paid');
            
            const userId = session.metadata.userId;
            console.log('🔍 User ID from metadata:', userId);
            
            if (!userId) {
                console.log('❌ No userId in session metadata');
                return res.status(400).json({ 
                    success: false, 
                    message: "User ID not found in session" 
                });
            }

            // Parse products from metadata
            const products = JSON.parse(session.metadata.products);
            console.log('🔍 Parsed products:', products);

            // Create order with correct field mapping
            const newOrder = new Order({
                user: userId,
                products: products.map(product => ({
                    product: product._id,
                    quantity: product.quantity,
                    price: product.productPrice
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: session_id,
            });

            const savedOrder = await newOrder.save();
            console.log('✅ Order saved:', savedOrder._id);

            // Clear user's cart
            await User.findByIdAndUpdate(userId, { cartItems: [] });
            console.log('✅ Cart cleared');

            // Send confirmation email
            try {
                console.log('📧 Attempting to send confirmation email...');
                await sendOrderConfirmationEmail(
                    session.customer_details.email,
                    savedOrder._id,
                    products,
                    session.amount_total / 100
                );
                console.log('✅ Order confirmation email sent successfully');
            } catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
                // Don't fail the entire request if email fails
            }

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                orderId: savedOrder._id,
            });
        } else {
            console.log('❌ Payment not completed. Status:', session.payment_status);
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }
    } catch (error) {
        console.error("❌ Error in checkoutSuccess:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
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
