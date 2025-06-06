import { User } from "../models/user.model";
import { CreateUserType, UserResponseType, UserType } from "../types/user.type";
import { APIError } from "../utils/apiError";
import { APIResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Tokens generator
async function generateTokens(userId: string) {
  try {
    // Get user from database
    const user: UserType | null = await User.findById(userId);

    // Check user exist or not
    if (!user) {
      throw new APIError(404, "Failed to get user");
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateAccessToken();

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

export { createUser };
