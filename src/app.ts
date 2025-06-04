import { config } from "dotenv";
import express, { Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { APIError } from "./utils";

// Accessing environment variables
config();
const corsOrigin = process.env.CORS_ORIGIN;

// Express app
const app = express();

// Middlewares
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Root route
app.get("/", (_, res: Response) => {
  res.status(200).json({
    message: "Hello, World",
  });
});

// API v1 route
app.get("/api/v1", (_, res: Response) => {
  res.status(200).json({ message: "API v1" });
});

// Handle undefined routes
app.use((_, res: Response) => {
  res.status(404).json(new APIError(404, "This route is not defined"));
});

export { app };
