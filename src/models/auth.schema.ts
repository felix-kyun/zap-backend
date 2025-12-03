import { Schema } from "mongoose";

const AuthTypes = ["opaque", "google"] as const;

export interface IAuth {
    type: (typeof AuthTypes)[number];
    data: string;
}

export const AuthSchema = new Schema<IAuth>({
    type: {
        type: String,
        required: true,
        enum: AuthTypes,
    },
    data: {
        type: String,
        required: true,
    },
});
