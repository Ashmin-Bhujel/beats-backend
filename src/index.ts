import { config } from "dotenv";
import { app } from "./app";

// Accessing environment variables
config();
const port = process.env.PORT;

// Testing the setup
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
