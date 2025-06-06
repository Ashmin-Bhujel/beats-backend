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
  validatePassword: (password: string) => boolean;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
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
