import mongoose from "mongoose";
import { UserType } from "../types/user.type";

// Email validator regex
const emailValidatorRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [emailValidatorRegex, "Please enter a valid email"],
    },
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    avatar: {
      type: String,
      required: [true, "User avatar is required"],
    },
    coverImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "artist"],
      required: true,
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserType>("User", userSchema);
