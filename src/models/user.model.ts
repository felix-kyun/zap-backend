import { AuthSchema, type IAuth } from "@models/auth.schema.js";
import { Document, Model, model, Schema, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    auth: IAuth;
    vault: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    auth: AuthSchema,
    vault: {
        type: String,
        required: false,
    },
});

export const User: Model<IUser> = model<IUser>("User", userSchema);
