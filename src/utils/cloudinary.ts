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
  folder: string,
  assetType: AssetType = "image"
): Promise<UploadApiResponse | null> {
  try {
    if (!localFilePath) {
      throw new Error("Invalid file path");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: assetType,
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
