import { MAIL_PASSWORD, MAIL_USER } from "@config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
    },
});

export async function sendMail(
    to: string,
    subject: string,
    text: string,
): Promise<void> {
    await transporter.sendMail({
        from: MAIL_USER,
        to,
        subject,
        text,
    });
}
