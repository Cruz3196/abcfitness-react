import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Class from "../models/class.model.js";
import { stripe } from "../lib/stripe.js";
import { sendOrderConfirmationEmail} from "../utils/nodemailerConfig.js";

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
//Creates a Stripe checkout session for a single class booking.
export const createClassCheckoutSession = async (req, res) => {
    try {
        const { classId, sessionDate } = req.body;
        const userId = req.user._id;

        console.log('🚀 Creating class checkout session:', { classId, sessionDate, userId });

        if (!classId || !sessionDate) {
            return res.status(400).json({ message: "Class ID and session date are required" });
        }

        // Fetch class details
        const classDetails = await Class.findById(classId);
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found." });
        }

        console.log('✅ Class details found:', classDetails.classTitle);

        // ✅ Check if user already has an ACTIVE (non-cancelled) booking for this session
        const existingBooking = await Booking.findOne({
            user: userId,
            class: classId,
            sessionDate: sessionDate,
            paymentStatus: 'paid',
            status: { $ne: 'cancelled' } // ✅ Exclude cancelled bookings
        });

        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this session." });
        }

        console.log('✅ No existing booking found, proceeding with checkout...');

        // ✅ Create Stripe line items
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

        console.log('✅ Line items created');

        // ✅ Create Stripe checkout session
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
                // ✅ Store additional info for easier access
                classTitle: classDetails.classTitle,
                startTime: classDetails.timeSlot?.startTime || "09:00",
                endTime: classDetails.timeSlot?.endTime || "10:00"
            },
        });

        console.log('✅ Stripe session created:', session.id);

        res.status(200).json({ 
            id: session.id, 
            url: session.url,
            success: true 
        });

    } catch (error) {
        console.error("❌ Error in createClassCheckoutSession:", error);
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message,
            success: false 
        });
    }
};

//Verifies a successful booking payment and updates the booking status.

export const classCheckoutSuccess = async (req, res) => {
    console.log('🚀 classCheckoutSuccess endpoint hit!');
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

        console.log('🔍 Retrieving Stripe session:', session_id);
        const session = await stripe.checkout.sessions.retrieve(session_id);
        console.log('✅ Stripe session retrieved:', session.payment_status);

        if (session.payment_status === "paid") {
            const { classId, sessionDate, userId } = session.metadata;
            console.log('📝 Session metadata:', { classId, sessionDate, userId });

            // Check if booking already exists (prevent duplicates)
            const existingBooking = await Booking.findOne({
                user: userId,
                class: classId,
                sessionDate: sessionDate,
                paymentStatus: 'paid'
            });

            if (existingBooking) {
                console.log('✅ Booking already exists:', existingBooking._id);
                return res.status(200).json({
                    success: true,
                    message: "Booking already confirmed",
                    bookingId: existingBooking._id,
                });
            }

            // ✅ Fetch class details to get the time information
            const classDetails = await Class.findById(classId);
            if (!classDetails) {
                return res.status(404).json({
                    success: false,
                    message: "Class not found"
                });
            }

            // ✅ Calculate start and end times
            const sessionDateObj = new Date(sessionDate);
            
            // Extract time from class timeSlot and create proper Date objects
            const startTimeStr = classDetails.timeSlot?.startTime || "09:00";
            const endTimeStr = classDetails.timeSlot?.endTime || "10:00";
            
            // Create start time by combining session date with class start time
            const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
            const startTime = new Date(sessionDateObj);
            startTime.setHours(startHours, startMinutes, 0, 0);
            
            // Create end time by combining session date with class end time
            const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
            const endTime = new Date(sessionDateObj);
            endTime.setHours(endHours, endMinutes, 0, 0);

            console.log('🕐 Calculated times:', {
                sessionDate: sessionDateObj,
                startTime: startTime,
                endTime: endTime,
                classTimeSlot: classDetails.timeSlot
            });

            // ✅ Create the booking with all required fields
            const newBooking = new Booking({
                user: userId,
                class: classId,
                sessionDate: sessionDateObj,
                startTime: startTime,
                endTime: endTime, // ✅ Now including the required endTime
                paymentStatus: 'paid',
                status: 'upcoming',
                stripeSessionId: session_id
            });

            const savedBooking = await newBooking.save();
            console.log('✅ New booking created:', savedBooking._id);

            // Populate for email sending
            const populatedBooking = await Booking.findById(savedBooking._id)
                .populate('user')
                .populate({
                    path: 'class',
                    populate: {
                        path: 'trainer',
                        populate: {
                            path: 'user',
                            select: 'username email'
                        }
                    }
                });

            // Send confirmation emails
            if (populatedBooking) {
                const user = populatedBooking.user;
                const classInfo = populatedBooking.class;
                
                // Only send emails if we have the email utility available
                if (typeof sendEmail === 'function') {
                    try {
                        // 1. Send email to the CUSTOMER
                        const customerSubject = `Booking Confirmation: ${classInfo.classTitle}`;
                        const customerText = `Hi ${user.username},\n\nThis confirms your booking for the class:\n\nClass: ${classInfo.classTitle}\nDate: ${new Date(populatedBooking.sessionDate).toDateString()}\nTime: ${startTimeStr} - ${endTimeStr}\n\nWe look forward to seeing you!`;
                        await sendEmail(user.email, customerSubject, customerText);

                        // 2. Send notification email to the TRAINER (if trainer exists)
                        if (classInfo.trainer?.user?.email) {
                            const trainerSubject = `New Booking for Your Class: ${classInfo.classTitle}`;
                            const trainerText = `Hi ${classInfo.trainer.user.username},\n\nA new user, ${user.username}, has just booked your class "${classInfo.classTitle}" for ${new Date(populatedBooking.sessionDate).toDateString()} at ${startTimeStr} - ${endTimeStr}.\n\nYour class roster has been updated.`;
                            await sendEmail(classInfo.trainer.user.email, trainerSubject, trainerText);
                        }
                    } catch (emailError) {
                        console.error("Failed to send confirmation emails:", emailError);
                        // Don't fail the booking if email fails
                    }
                }
            }

            res.status(200).json({
                success: true,
                message: "Payment successful and booking confirmed",
                bookingId: savedBooking._id,
            });
        } else {
            console.log('❌ Payment not successful:', session.payment_status);
            res.status(400).json({ 
                success: false, 
                message: "Payment not successful" 
            });
        }
    } catch (error) {
        console.error("❌ Error in classCheckoutSuccess:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};
