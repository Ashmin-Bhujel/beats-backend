import mongoose from "mongoose";
import { User } from "../models/user.model";
import { CreateUserType, UserResponseType, UserType } from "../types/user.type";
import { APIError } from "../utils/apiError";
import { APIResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { config } from "dotenv";
import { CookieOptions } from "express";
import "../types/express.type";

// Accessing environment variables
config();
const nodeEnvironment = process.env.NODE_ENV;
const cookiesOptions: CookieOptions = {
  httpOnly: true,
  secure: nodeEnvironment === "production",
  sameSite: nodeEnvironment === "production" ? "none" : "lax",
};

// Tokens generator
async function generateTokens(userId: mongoose.Types.ObjectId) {
  try {
    // Get user from database
    const user: UserType | null = await User.findById(userId);

    // Check user exist or not
    if (!user) {
      throw new APIError(404, "Failed to get user");
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Check if the tokens are generated or not
    if (!accessToken || !refreshToken) {
      throw new APIError(500, "Failed to generate tokens");
    }

    // Save the refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Return the generated tokens
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw new APIError(
      500,
      error instanceof Error
        ? error.message
        : "Something went wrong while generating tokens"
    );
  }
}

// Create user controller
const createUser = asyncHandler(async (req, res) => {
  // Get new user data from request body
  const newUser: CreateUserType = req.body;

  // Validate the received data
  if (
    !newUser.name ||
    !newUser.email ||
    !newUser.fullName ||
    !newUser.password ||
    !newUser.avatar ||
    !newUser.role
  ) {
    throw new APIError(400, "Please provide all the required data");
  }

  // Check for existing user
  const existingUser: UserResponseType | null = await User.findOne({
    $or: [{ name: newUser.name }, { email: newUser.email }],
  }).select("-password -refreshToken");
  if (existingUser) {
    throw new APIError(409, "User with same email or username already exists");
  }

  // Create a new user
  const user: UserType | null = await User.create(newUser);

  // Get created user
  const createdUser: UserResponseType | null = await User.findById(
    user?._id
  ).select("-password -refreshToken");

  // Check created user
  if (!createdUser) {
    throw new APIError(400, "Failed to get created user");
  }

  // Send response back
  res.status(201).json(
    new APIResponse(201, "Successfully created a new user", {
      createdUser: createdUser,
    })
  );
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  // Get name/email and password from request body
  const { name, email, password } = req.body;

  // Validate received data
  if (!name && !email) {
    throw new APIError(400, "Username or email is required");
  }
  if (!password) {
    throw new APIError(400, "Password is required");
  }

  // Get user from database
  const user: UserType | null = await User.findOne({
    $or: [{ name }, { email }],
  });

  // Check if user exist or not
  if (!user) {
    throw new APIError(404, "Invalid user credentials or user does not exits");
  }

  // Validate with original password
  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    throw new APIError(401, "Incorrect password");
  }

  // Generate JWT tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Get the logged in user
  const loggedInUser: UserResponseType | null = await User.findById(
    user._id
  ).select("-password -refreshToken");

  // Send back response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new APIResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      })
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // Unset the refresh token in database
  await User.findByIdAndUpdate(req.user?._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  // Clear cookies and send back response
  res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(new APIResponse(200, "User logged out successfully"));
});

export { createUser, loginUser, logoutUser };
