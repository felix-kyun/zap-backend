import { Schema } from "mongoose";

const AuthTypes = ["opaque"] as const;

export interface IAuth {
    type: (typeof AuthTypes)[number];
    data: string;
}

export const AuthSchema: Schema<IAuth> = new Schema({
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
