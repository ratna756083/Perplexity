import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
});

export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const mailOptions = {
            from: {
                name: "PerplexCity",
                address: process.env.GOOGLE_USER
            },
            to,
            subject,
            html,
            text
        };

        const details = await transporter.sendMail(mailOptions);

        console.log("Email sent:", details.messageId);

        return details;

    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
};