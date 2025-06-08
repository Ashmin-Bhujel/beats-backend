# 🎯 Checkpoints

## [ 1 ] Basic Project Setup

The goal was to initialize and configure the basic setup of the project.

- [x] Initialize the project

- [x] Install basic dependencies

  - [x] Dependencies
    - `express`
    - `mongoose`
    - `dotenv`
    - `cors`
    - `cookie-parser`
  - [x] Dev dependencies
    - `typescript`
    - `nodemon`
    - `ts-node`
    - `prettier`
    - `@types/express`
    - `@types/cors`
    - `@types/cookie-parser`

- [x] Configure `tsconfig.json` file

  Initialize the `tsconfig.json` file using `pnpm tsc --init` command and configure these properties.

  ```json
  {
    "compilerOptions": {
      "target": "esnext",
      "module": "commonjs",
      "rootDir": "./src",
      "outDir": "./build",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "skipLibCheck": true
    }
  }
  ```

- [x] Add scripts inside `package.json` file

  ```json
  "scripts": {
    "dev": "nodemon ./src/index.ts",
    "start": "node ./build/index.js",
    "build": "tsc -p ."
  }
  ```

- [x] Configure `.gitignore`, `.prettierrc` and `.prettierignore` files

- `.gitignore` file

  ```
  node_modules
  build
  .env
  ```

- `.prettierrc` file

  ```json
  {
    "tabWidth": 2,
    "semi": true,
    "singleQuote": false,
    "bracketSpacing": true,
    "trailingComma": "es5"
  }
  ```

- `.prettierignore` file

  ```
  node_modules
  build
  ```

- [x] Configure `.env` file

  **Note**: Replace with appropriate value of variables. This is an example of `.env.example` file.

  ```
  # Node
  NODE_ENV="<development|production>"

  # Express
  PORT=5000
  CORS_ORIGIN="*"
  ```

- [x] Setup `src/app.ts` file

  Mostly setup related to Express is done inside this file.

  ```ts
  import { config } from "dotenv";
  import express, { Response } from "express";
  import cors from "cors";
  import cookieParser from "cookie-parser";

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
    res.status(404).json({ message: "This route is not defined" });
  });

  export { app };
  ```

- [x] Setup `src/index.ts` file

  This file is the entrypoint of the entire backend service.

  ```ts
  import { config } from "dotenv";
  import { app } from "./app";

  // Accessing environment variables
  config();
  const port = process.env.PORT;

  // Testing the setup
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  ```

- [x] Test the setup

## [ 2 ] Create `asyncHandler` and Custom Class for API Error and Response

### `asyncHandler` Function

- This utility function helps to handle asynchronous request and errors.
- It reduces the redundant use of `try...catch`.

  ```ts
  import { Request, Response, NextFunction } from "express";

  type Handler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any> | void;

  const asyncHandler = (handler: Handler) => {
    return (req: Request, res: Response, next: NextFunction) => {
      return Promise.resolve(handler(req, res, next)).catch(next);
    };
  };

  export { asyncHandler };
  ```

### Custom APIError Class

- This custom class helps to send back error response in a specified standard format throughout the project.

  ```ts
  class APIError extends Error {
    statusCode: number;
    data: Record<string, any> | null;
    errors: string[];
    success: boolean;

    constructor(
      statusCode: number,
      message: string = "Something went wrong",
      data: Record<string, any> | null = null,
      errors: string[] = []
    ) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.data = data;
      this.errors = errors;
      this.success = false;
      Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
      return {
        statusCode: this.statusCode,
        message: this.message,
        data: this.data,
        errors: this.errors,
        success: this.success,
      };
    }
  }

  export { APIError };
  ```

### Custom APIResponse Class

- This custom class helps to send back api response in a specified standard format throughout the project.

  ```ts
  class APIResponse {
    statusCode: number;
    message: string;
    data: Record<string, any> | null;
    success: boolean;

    constructor(
      statusCode: number,
      message: string,
      data: Record<string, any> | null = null
    ) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = statusCode < 400;
    }

    toJSON() {
      return {
        statusCode: this.statusCode,
        message: this.message,
        data: this.data,
        success: this.success,
      };
    }
  }

  export { APIResponse };
  ```

## [ 3 ] Connect to Database and Create User Types, Model

### Connect to The Database

- Used MongoDB with docker image to locally run database and connect to it using mongoose in the backend service.

  ```yml
  services:
    mongo:
      image: mongo
      container_name: mongodb
      restart: unless-stopped
      ports:
        - 27017:27017
      environment:
        - MONGO_INITDB_ROOT_USERNAME=<db_username>
        - MONGO_INITDB_ROOT_PASSWORD=<db_password>
      volumes:
        - ./db/data:/data/db
  ```

### Create function to connect to MongoDB database.

- Inside `database/index.ts` file

  ```ts
  import { config } from "dotenv";
  import mongoose from "mongoose";

  // Accessing environment variables
  config();
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT || 27017;
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;

  // Database connection string
  const connectionString = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/?authSource=admin`;

  async function connectDatabase() {
    try {
      await mongoose.connect(connectionString, { dbName });
      console.log("Connected to the database successfully");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1);
    }
  }

  export { connectDatabase };
  ```

### Connect and Run Express server.

- Inside `index.ts` file

  ```ts
  import { config } from "dotenv";
  import { app } from "./app";
  import { connectDatabase } from "./database";

  // Accessing environment variables
  config();
  const port = process.env.PORT || 5000;

  // Running the server
  connectDatabase()
    .then(() => {
      app.on("error", (error) => {
        console.error("Failed to start the server", error);
        process.exit(1);
      });

      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("Failed to connect to the database:", error);
    });
  ```

### Types for User

- These types helps to write type safe code and give autocomplete suggestions, Both are great to have.

- Inside `types/user.type.ts` file

  ```ts
  import mongoose from "mongoose";

  export interface UserType {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    fullName: string;
    password: string;
    avatar: string;
    coverImage?: string;
    role: "user" | "artist";
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export type CreateUserType = Omit<
    UserType,
    "_id" | "createdAt" | "updatedAt"
  > & {
    role?: "user" | "artist";
  };

  export type UpdateUserType = Partial<
    Omit<UserType, "_id" | "createdAt" | "updatedAt">
  >;

  export type UserResponseType = Omit<UserType, "password" | "refreshToken">;
  ```

### Model for User

- Inside `models/user.model.ts` file

  ```ts
  import mongoose from "mongoose";
  import { UserType } from "../types/user.type";

  // Email validator regex
  const emailValidatorRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

  export const User = mongoose.model<UserType>("User", userSchema);
  ```

- Test the Database Connection

## [ 4 ] Hash Password and User Login Controller

### Hash Password

- Used `bcrypt` library to hash the user password before saving to the database

- Inside `user.model.ts` file

  ```ts
  // Hashing the password before saving the data
  userSchema.pre("save", async function (next) {
    // Skip if password is not modified
    if (!this.isModified("password")) {
      next();
    }

    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  ```

- Also made a method to validate user input password to the original password

  ```ts
  // Password validator
  userSchema.methods.validatePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
  };
  ```

### User Login Controller

- Before writing controller for user login, created methods inside `user.model.ts` file to generate access and refresh token using JWT.

  ```ts
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
        role: this.role,
      },
      refreshTokenSecret,
      { expiresIn: refreshTokenExpiry } as SignOptions
    );
  };
  ```

- Created a function called `generateTokens` to generate and save refresh token into the database inside the `user.controller.ts` file.

  ```ts
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
  ```

- Create controller for user login

  ```ts
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
      throw new APIError(
        404,
        "Invalid user credentials or user does not exits"
      );
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
  ```

- Test the controller

## [ 5 ] User Logout Controller and Cloudinary Setup

### User Logout Controller

- Create controller for user logout, before that created middleware for auth so that when a user is logged in some of the user data is accessible through the request object which in injected by the auth middleware.

- Inside `auth.middleware.ts` file

  ```ts
  import { config } from "dotenv";
  import { APIError } from "../utils/apiError";
  import { asyncHandler } from "../utils/asyncHandler";
  import jwt, { JwtPayload } from "jsonwebtoken";
  import { UserResponseType } from "../types/user.type";
  import { User } from "../models/user.model";
  import "../types/express.type";

  // Accessing environment variables
  config();
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new APIError(400, "JWT configurations are missing");
  }

  const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
      // Get access token from cookies for request header (authorization header)
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      // Check if have accessToken or not
      if (!accessToken) {
        throw new APIError(401, "Unauthorized request");
      }

      // Decode the accessToken
      const decodedAccessToken = jwt.verify(
        accessToken,
        accessTokenSecret
      ) as JwtPayload;

      // Get user from database
      const user: UserResponseType | null = await User.findById(
        decodedAccessToken?._id
      ).select("-password -refreshToken");

      // Check for user
      if (!user) {
        throw new APIError(401, "Invalid access token");
      }

      // Add user to request object
      req.user = user;

      // Pass the control to next
      next();
    } catch (error) {
      // If it's already an APIError, re-throw it
      if (error instanceof APIError) {
        throw error;
      }

      // Handle JWT-specific errors
      if (error instanceof jwt.JsonWebTokenError) {
        throw new APIError(401, "Invalid access token");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new APIError(401, "Access token expired");
      }

      // Handle other errors (likely database errors)
      throw new APIError(500, "Internal server error");
    }
  });

  export { verifyJWT };
  ```

- Inside `user.controller.ts` file

  ```ts
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
  ```

### Cloudinary Setup

- Before setting up Cloudinary created a middleware for multer.

- Inside `multer.middleware.ts` file

  ```ts
  import multer from "multer";

  // Configure disk storage for multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  export const upload = multer({ storage });
  ```

- Create util function for cloudinary

- Inside `utils/cloudinary.ts` file

  ```ts
  import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
  import { config } from "dotenv";
  import fs from "fs";

  // Accessing environment variables
  config();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const mainFolder = process.env.CLOUDINARY_MAIN_FOLDER;

  // Configure cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  // Asset type
  export type AssetType = "image" | "raw" | "video";

  // Method for uploading
  async function uploadOnCloudinary(
    localFilePath: string,
    folder: string
  ): Promise<UploadApiResponse | null> {
    try {
      if (!localFilePath) {
        throw new Error("Invalid file path");
      }

      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: `${mainFolder}/${folder}`,
      });

      // Remove file from disk after uploading
      fs.unlinkSync(localFilePath);
      return response;
    } catch (error) {
      // Remove file from disk after failed to upload
      fs.unlinkSync(localFilePath);
      console.error("Failed to upload file:", error);
      return null;
    }
  }

  // Delete image file
  async function deleteAssetOnCloudinary(
    publicId: string,
    assetType: AssetType = "image"
  ) {
    try {
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: assetType,
      });

      return response;
    } catch (error) {
      console.error("Failed to delete the asset:", error);
      return null;
    }
  }

  export { uploadOnCloudinary, deleteAssetOnCloudinary };
  ```

- Previously when creating a user the avatar and coverImage files were not uploaded, It was just a field. After this we can use `uploadOnCloudinary` utility function to upload user's avatar and coverImage to Cloudinary to storage.

- Modifications inside `loginUser` controller

  ```ts
  // After checking for existing user
  // Upload images to server's local path
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const avatarLocalPath =
    files?.avatar && Array.isArray(files?.avatar) && files?.avatar?.length > 0
      ? files?.avatar[0]?.path
      : "";

  const coverImageLocalPath =
    files?.coverImage &&
    Array.isArray(files.coverImage) &&
    files.coverImage.length > 0
      ? files.coverImage[0]?.path
      : "";

  // Upload images to cloudinary
  const avatar =
    avatarLocalPath &&
    (await uploadOnCloudinary(avatarLocalPath, `users/${newUser.name}`));
  const coverImage =
    coverImageLocalPath &&
    (await uploadOnCloudinary(coverImageLocalPath, `users/${newUser.name}`));

  // Check if avatar image is uploaded successfully
  if (!avatar) {
    throw new APIError(
      400,
      "Avatar image is required, while uploading to Cloudinary"
    );
  }

  // Create a new user
  Object.assign(newUser, {
    ...newUser,
    avatar: avatar.secure_url,
    coverImage: coverImage ? coverImage.secure_url : "",
  });
  const user: UserType | null = await User.create(newUser);

  // Then rest is same
  ```

- Test the configurations

## [ 6 ] User Refresh Access Token Controller and Song Model

- Create a controller for refreshing user access token

- Inside `user.controller.ts` file

  ```ts
  // Refresh access token for user
  const refreshAccessToken = asyncHandler(async (req, res) => {
    // Get refresh token from cookies or request object
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    // Check the received refresh token
    if (!incomingRefreshToken) {
      throw new APIError(401, "Unauthorized request");
    }

    // Decode the refresh token
    if (!refreshTokenSecret) {
      throw new APIError(400, "JWT configurations are missing");
    }
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      refreshTokenSecret
    ) as JwtPayload;

    // Check decoded refresh token
    if (!decodedRefreshToken) {
      throw new APIError(
        500,
        "Something went wrong while decoding refresh token"
      );
    }

    // Get user from database
    const user: UserType | null = await User.findById(decodedRefreshToken?._id);

    // Check user
    if (!user) {
      throw new APIError(401, "Invalid refresh token");
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await generateTokens(user?._id);

    // Send back response
    res
      .status(200)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new APIResponse(200, "Refreshed access token successfully", {
          accessToken,
          refreshToken,
        })
      );
  });
  ```

- Types for song entity

- inside `song.type.ts` file

  ```ts
  import mongoose from "mongoose";

  export interface SongType {
    _id: mongoose.Types.ObjectId;
    name: string;
    songFile: string;
    duration: number;
    artist: mongoose.Types.ObjectId;
    image: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export type CreateSongType = Omit<
    SongType,
    "_id" | "createdAt" | "updatedAt"
  >;
  ```

- Used the types of song to create model for song entity

- inside `song.model.ts` file

  ```ts
  import mongoose from "mongoose";
  import { CreateSongType } from "../types/song.type";

  const songSchema = new mongoose.Schema<CreateSongType>(
    {
      name: {
        type: String,
        required: [true, "Song name is required"],
        trim: true,
      },
      songFile: {
        type: String,
        required: [true, "Song file is required"],
      },
      duration: {
        type: Number,
        required: [true, "Song duration is required"],
        default: 0,
      },
      artist: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "Song artist is required"],
      },
      image: {
        type: String,
        required: [true, "Song image is required"],
      },
      isPublished: {
        type: Boolean,
        required: [true, "Song published status is required"],
        default: false,
      },
    },
    { timestamps: true }
  );

  export const Song = mongoose.model("Song", songSchema);
  ```
