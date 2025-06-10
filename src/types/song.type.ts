import mongoose, { Document } from "mongoose";

export interface SongType extends Document {
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

export type CreateSongType = Partial<
  Omit<SongType, "_id" | "createdAt" | "updatedAt">
>;
