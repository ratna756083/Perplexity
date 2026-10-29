
import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log("Email sent:", data?.id);
        return data;
    } catch (error) {
        console.error("EMAIL ERROR:", error.message);
        throw error;
    }
};
