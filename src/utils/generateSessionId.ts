import crypto from "crypto";

export function generateSessionId(): string {
    return crypto.randomBytes(48).toString("base64url");
}
