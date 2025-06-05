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
