import { redis } from "@utils/database/redis.js";
import { sendMail } from "@services/mail.js";
import { ServerError } from "@errors/ServerError.error.js";
import { StatusCodes } from "http-status-codes";

export async function generateOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await redis.set(`register-otp:${email}`, otp, {
        EX: 10 * 60,
    });

    await sendMail(
        email,
        "OTP for Zap Registration",
        `Your OTP for Zap registration is: ${otp}. It is valid for 10 minutes.`,
    );
}

export async function verifyOTP(email: string, otp: string) {
    const storedOTP = await redis.get(`register-otp:${email}`);

    if (!storedOTP)
        throw new ServerError("OTP has expired", StatusCodes.BAD_REQUEST);

    if (storedOTP !== otp)
        throw new ServerError("Invalid OTP", StatusCodes.BAD_REQUEST);

    await redis.del(`register-otp:${email}`);
}
