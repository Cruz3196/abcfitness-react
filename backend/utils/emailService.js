import { transporter } from "./nodemailerConfig.js";

export const sendEmail = async (to, subject, text) => {
    try {
        console.log('📧 Attempting to send email to:', to);
        console.log('📧 Subject:', subject);
        
        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        
        console.log('✅ Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error; 
    }
};

// Add the missing booking confirmation email function
export const sendBookingConfirmationEmail = async (email, username, booking, classDetails) => {
    try {
        console.log('📧 Sending booking confirmation to:', email);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Booking Confirmation - ${classDetails.classTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                        <h1 style="color: #333;">ABC Fitness</h1>
                        <h2 style="color: #28a745;">Booking Confirmed!</h2>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Hi ${username},</p>
                        <p>Your class booking has been confirmed!</p>
                        
                        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin: 0 0 10px 0; color: #333;">Booking Details</h3>
                            <p><strong>Class:</strong> ${classDetails.classTitle}</p>
                            <p><strong>Type:</strong> ${classDetails.classType}</p>
                            <p><strong>Date:</strong> ${new Date(booking.sessionDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> ${classDetails.timeSlot?.startTime || 'TBD'} - ${classDetails.timeSlot?.endTime || 'TBD'}</p>
                            <p><strong>Trainer:</strong> ${classDetails.trainer?.user?.username || 'TBD'}</p>
                            <p><strong>Booking ID:</strong> ${booking._id}</p>
                        </div>
                        
                        <p>We're excited to see you in class!</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL}/profile" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View My Bookings</a>
                        </div>
                    </div>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Booking confirmation email sent:', result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Error sending booking confirmation:', error);
        throw error;
    }
};

export const sendOrderConfirmationEmail = async (email, orderId, products, totalAmount) => {
    try {
        // Create products HTML
        const productsHTML = products.map(product => `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    <img src="${product.img}" alt="${product.productName}" style="width: 50px; height: 50px; object-fit: cover;">
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${product.productName}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${product.productPrice.toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(product.productPrice * product.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Confirmation - ABC Fitness (Order #${orderId})`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                        <h1 style="color: #333; margin: 0;">ABC Fitness</h1>
                        <h2 style="color: #28a745; margin: 10px 0;">Order Confirmation</h2>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear Customer,</p>
                        <p>Thank you for your order! We're excited to get your fitness gear to you.</p>
                        
                        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin: 0 0 10px 0; color: #333;">Order Details</h3>
                            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
                            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
                        </div>

                        <h3 style="color: #333;">Items Ordered:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                            <thead>
                                <tr style="background-color: #f8f9fa;">
                                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Image</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsHTML}
                            </tbody>
                            <tfoot>
                                <tr style="background-color: #f8f9fa; font-weight: bold;">
                                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd; text-align: right;">Grand Total:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${totalAmount.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="margin: 0 0 10px 0;">What's Next?</h4>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li>Your order is being processed</li>
                                <li>You'll receive a shipping confirmation email once your order ships</li>
                                <li>Estimated delivery: 3-5 business days</li>
                            </ul>
                        </div>

                        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p>Thank you for choosing ABC Fitness!</p>
                            <p style="color: #666; font-size: 14px;">
                                Visit us at: <a href="${process.env.CLIENT_URL}" style="color: #28a745;">${process.env.CLIENT_URL}</a>
                            </p>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px;">
                        <p>This is an automated email. Please do not reply to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} ABC Fitness. All rights reserved.</p>
                    </div>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent successfully:', result.messageId);
        return result;

    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
        throw error;
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        console.log('📧 Sending welcome email to:', email);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to ABC Fitness!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                        <h1 style="color: #333;">Welcome to ABC Fitness!</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hi ${name},</p>
                        <p>Welcome to ABC Fitness! We're excited to have you join our community.</p>
                        <p>Start exploring our fitness products and achieve your goals!</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${process.env.CLIENT_URL}/store" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Shop Now</a>
                        </div>
                    </div>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        throw error;
    }
};