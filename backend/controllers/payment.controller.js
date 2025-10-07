import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Class from "../models/class.model.js";
import { stripe } from "../lib/stripe.js";
import { sendOrderConfirmationEmail} from "../utils/emailService.js";

 // Creates a Stripe checkout session for a list of products from a shopping cart.
export const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products array is required" });
        }

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.productName,
                    images: [product.img],
                },
                unit_amount: Math.round(product.productPrice * 100),
            },
            quantity: product.quantity,
        }));
        const metadataProducts = products.map(p => ({
            _id: p._id,
            productName: p.productName,
            productPrice: p.productPrice,
            quantity: p.quantity
        }));
        // Creating a stripe checkout session
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

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//Verifies a successful product payment, creates an order, and clears the user's cart.

export const checkoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.body;
        
        if (!session_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Session ID is required" 
            });
        }
        // checking if the order already exists to prevent duplicates
        const existingOrder = await Order.findOne({ stripeSessionId: session_id });
        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already processed",
                orderId: existingOrder._id,
            });
        }

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            
            const userId = session.metadata.userId;
            
            if (!userId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "User ID not found in session" 
                });
            }

            // Parse products from metadata
            const products = JSON.parse(session.metadata.products);

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

            // Clear user's cart
            await User.findByIdAndUpdate(userId, { cartItems: [] });

            // Send confirmation email
            try {
                await sendOrderConfirmationEmail(
                    session.customer_details.email,
                    savedOrder._id,
                    products,
                    session.amount_total / 100
                );
            } catch (emailError) {
                // Don't fail the entire request if email fails
            }

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                orderId: savedOrder._id,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};


//Creates a Stripe checkout session for a single class booking.
export const createClassCheckoutSession = async (req, res) => {
    try {
        const { classId, sessionDate } = req.body;
        const userId = req.user._id;

        if (!classId || !sessionDate) {
            return res.status(400).json({ message: "Class ID and session date are required" });
        }

        // Fetch class details
        const classDetails = await Class.findById(classId);
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found." });
        }

        const existingBooking = await Booking.findOne({
            user: userId,
            class: classId,
            sessionDate: sessionDate,
            paymentStatus: 'paid',
            status: { $ne: 'cancelled' } 
        });

        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this session." });
        }

        // Create line items for Stripe
        const lineItems = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: classDetails.classTitle,
                    images: [classDetails.classPic],
                    description: `${classDetails.classType} - ${new Date(sessionDate).toLocaleDateString()} at ${classDetails.timeSlot?.startTime || 'TBD'}`
                },
                unit_amount: Math.round(classDetails.price * 100), // Convert to cents
            },
            quantity: 1,
        }];


        // Creating a stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/classes/${classId}`,
            metadata: {
                classId: classId,
                sessionDate: sessionDate,
                userId: userId.toString(),
                type: 'class_booking',
                classTitle: classDetails.classTitle,
                startTime: classDetails.timeSlot?.startTime || "09:00",
                endTime: classDetails.timeSlot?.endTime || "10:00"
            },
        });

        res.status(200).json({ 
            id: session.id, 
            url: session.url,
            success: true 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message,
            success: false 
        });
    }
};

//Verifies a successful booking payment and updates the booking status.

export const classCheckoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.body;
        
        if (!session_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Session ID is required" 
            });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            const { classId, sessionDate, userId } = session.metadata;

            const existingBooking = await Booking.findOne({
                stripeSessionId: session_id
            });

            if (existingBooking) {
                return res.status(200).json({
                    success: true,
                    message: "Booking already confirmed",
                    bookingId: existingBooking._id,
                });
            }

            const duplicateBooking = await Booking.findOne({
                user: userId,
                class: classId,
                sessionDate: sessionDate,
                paymentStatus: 'paid',
                status: { $ne: 'cancelled' }
            });

            if (duplicateBooking) {
                return res.status(200).json({
                    success: true,
                    message: "Booking already exists for this class and date",
                    bookingId: duplicateBooking._id,
                });
            }

            const classDetails = await Class.findById(classId)
                .populate({
                    path: 'trainer',
                    populate: {
                        path: 'user',
                        select: 'username email'
                    }
                });
                
            if (!classDetails) {
                return res.status(404).json({
                    success: false,
                    message: "Class not found"
                });
            }

            const sessionDateObj = new Date(sessionDate);
            
            const startTimeStr = classDetails.timeSlot?.startTime || "09:00";
            const endTimeStr = classDetails.timeSlot?.endTime || "10:00";
            
            const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
            const startTime = new Date(sessionDateObj);
            startTime.setHours(startHours, startMinutes, 0, 0);
            
            const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
            const endTime = new Date(sessionDateObj);
            endTime.setHours(endHours, endMinutes, 0, 0);

            let savedBooking;
            try {
                const newBooking = new Booking({
                    user: userId,
                    class: classId,
                    sessionDate: sessionDateObj,
                    startTime: startTime,
                    endTime: endTime,
                    paymentStatus: 'paid',
                    status: 'upcoming',
                    stripeSessionId: session_id
                });

                savedBooking = await newBooking.save();
            } catch (bookingError) {
                
                // If it's a duplicate key error, check if booking exists and return it
                if (bookingError.code === 11000) {
                    const existingBookingAfterError = await Booking.findOne({
                        $or: [
                            { stripeSessionId: session_id },
                            { 
                                user: userId,
                                class: classId,
                                sessionDate: sessionDate,
                                paymentStatus: 'paid'
                            }
                        ]
                    });
                    
                    if (existingBookingAfterError) {
                        savedBooking = existingBookingAfterError;
                    } else {
                        throw bookingError; // Re-throw if we can't find the existing booking
                    }
                } else {
                    throw bookingError; // Re-throw non-duplicate errors
                }
            }

            try {
                const user = await User.findById(userId);
                if (!user) {
                } else {
                    await sendBookingConfirmationEmail(
                        user.email,
                        user.username,
                        savedBooking,
                        classDetails
                    );
                }
            } catch (emailError) {
                console.error('Email failed but booking succeeded:', emailError);
                // Don't fail the entire request if email fails
            }

            res.status(200).json({
                success: true,
                message: "Payment successful and booking confirmed",
                bookingId: savedBooking._id,
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: "Payment not successful" 
            });
        }
    } catch (error) {
        console.log("Error in classCheckoutSuccess:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};