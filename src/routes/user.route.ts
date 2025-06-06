import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
