import type { IUser } from "@models/user.model.ts";
import type { Request } from "express";

// older approach, both works
// declare global {
//     namespace Express {
//         interface Request {
//             payload?: Payload;
//         }
//     }
// }

declare module "express" {
    interface Request {
        user?: IUser;
    }
}
