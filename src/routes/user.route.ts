import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);

// Protected routes
userRouter.post("/logout", verifyJWT, logoutUser);

export default userRouter;
