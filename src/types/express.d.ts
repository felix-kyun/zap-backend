import type { Payload } from "@services/auth.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        payload?: Payload;
    }
}
