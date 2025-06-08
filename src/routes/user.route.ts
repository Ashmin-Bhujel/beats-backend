import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const userRouter = Router();

userRouter.post(
  "/create",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  createUser
);
userRouter.post("/login", loginUser);
userRouter.post("/refreshAccessToken", refreshAccessToken);

// Protected routes
userRouter.post("/logout", verifyJWT, logoutUser);

export default userRouter;
