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

export type CreateSongType = Omit<SongType, "_id" | "createdAt" | "updatedAt">;
