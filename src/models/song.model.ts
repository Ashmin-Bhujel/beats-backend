import mongoose from "mongoose";
import { SongType } from "../types/song.type";

const songSchema = new mongoose.Schema<SongType>(
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
