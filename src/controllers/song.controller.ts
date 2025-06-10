import { Song } from "../models/song.model";
import { CreateSongType, SongType } from "../types/song.type";
import { APIError } from "../utils/apiError";
import { APIResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const addSong = asyncHandler(async (req, res) => {
  // Check if user is normal user or artist
  if (req?.user?.role !== "artist") {
    throw new APIError(401, "Unauthorized request");
  }

  // Get song data from user
  const { name, isPublished } = req.body;

  // Validate received song data
  if (!name) {
    throw new APIError(400, "Please provide all the required data");
  }

  // Upload song related files to server's local path
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const songFileLocalPath =
    files?.songFile &&
    Array.isArray(files?.songFile) &&
    files?.songFile?.length > 0
      ? files?.songFile[0]?.path
      : "";

  const imageLocalPath =
    files?.image && Array.isArray(files?.image) && files?.image?.length > 0
      ? files?.image[0]?.path
      : "";

  // Upload files to the cloudinary
  const songFile =
    songFileLocalPath &&
    (await uploadOnCloudinary(
      songFileLocalPath,
      `users/${req?.user?.name}/songs/${name}`,
      "video"
    ));
  const image =
    imageLocalPath &&
    (await uploadOnCloudinary(
      imageLocalPath,
      `users/${req?.user?.name}/songs/${name}`
    ));

  // Check if files uploaded successfully or not
  if (!songFile || !image) {
    throw new APIError(
      400,
      "Song file and image is required while uploading to Cloudinary"
    );
  }

  // Add new song
  const newSong: CreateSongType = {
    name,
    artist: req?.user?._id,
    songFile: songFile?.secure_url,
    duration: songFile?.duration,
    image: image?.secure_url,
    isPublished,
  };
  const song: SongType = await Song.create(newSong);

  // Check added song
  if (!song) {
    throw new APIError(400, "Failed to get added song");
  }

  // Send response back
  res.status(201).json(
    new APIResponse(201, "Successfully added a new song", {
      song: song,
    })
  );
});

export { addSong };
