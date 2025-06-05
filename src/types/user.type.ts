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
