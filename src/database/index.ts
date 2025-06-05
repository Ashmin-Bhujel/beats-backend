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
