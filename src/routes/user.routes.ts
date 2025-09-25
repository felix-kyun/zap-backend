import { createUser, getUserById } from "@controllers/user.controller.js";
import { Router } from "express";

export const userRouter: Router = Router();

userRouter.route("/").post(createUser);
userRouter.route("/:id").get(getUserById);
