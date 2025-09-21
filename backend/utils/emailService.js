import { transporter } from "./nodemailerConfig.js"; // Assuming this is your config file

export const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
    } catch (error) {
        console.log("Error sending email", error);
        // It's good practice to throw the error so the caller knows it failed
        throw error; 
    }
};