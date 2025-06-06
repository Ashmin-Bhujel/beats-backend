import { config } from "dotenv";
import mongoose from "mongoose";
import { UserType } from "../types/user.type";
import jwt, { SignOptions } from "jsonwebtoken";
import { APIError } from "../utils/apiError";

// Accessing environment variables
config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

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
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
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

// Method for generating access token
userSchema.methods.generateAccessToken = function () {
  if (!accessTokenSecret || !accessTokenExpiry) {
    throw new APIError(400, "JWT configurations are missing");
  }

  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiry,
    } as SignOptions
  );
};

// Method for generating refresh token
userSchema.methods.generateRefreshToken = function () {
  if (!refreshTokenSecret || !refreshTokenExpiry) {
    throw new APIError(400, "JWT configurations are missing");
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiry } as SignOptions
  );
};

export const User = mongoose.model<UserType>("User", userSchema);
