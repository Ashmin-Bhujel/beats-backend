import mongoose, { Document } from "mongoose";

export interface UserType extends Document {
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
  validatePassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

export type CreateUserType = Partial<
  Omit<
    UserType,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "validatePassword"
    | "generateAccessToken"
    | "generateRefreshToken"
  >
>;

export type UserResponseType = Omit<
  UserType,
  | "password"
  | "refreshToken"
  | "validatePassword"
  | "generateAccessToken"
  | "generateRefreshToken"
>;
