import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,

    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const info = await transporter.sendMail({
            from: {
                name: "PerplexCity",
                address: process.env.GOOGLE_USER
            },
            to,
            subject,
            html,
            text
        });

        console.log("Email sent:", info.messageId);

        return info;

    } catch (error) {
        console.error("EMAIL ERROR");
        console.error("Code:", error.code);
        console.error("Command:", error.command);
        console.error("Message:", error.message);

        throw error;
    }
};