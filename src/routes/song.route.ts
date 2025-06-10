import { Router } from "express";
import { addSong } from "../controllers/song.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const songRouter = Router();

// Protected routes
songRouter.post(
  "/add",
  verifyJWT,
  upload.fields([
    {
      name: "songFile",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addSong
);

export default songRouter;
