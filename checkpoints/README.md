# 🎯 Checkpoints

## [ 1 ] Basic Project Setup

The goal was to initialize and configure the basic setup of the project.

- [x] Initialize the project

- [x] Install basic dependencies

  - [x] Dependencies
    - `express`
    - `mongoose`
    - `dotenv`
    - `cors`
    - `cookie-parser`
  - [x] Dev dependencies
    - `typescript`
    - `nodemon`
    - `ts-node`
    - `prettier`
    - `@types/express`
    - `@types/cors`
    - `@types/cookie-parser`

- [x] Configure `tsconfig.json` file

  Initialize the `tsconfig.json` file using `pnpm tsc --init` command and configure these properties.

  ```json
  {
    "compilerOptions": {
      "target": "esnext",
      "module": "commonjs",
      "rootDir": "./src",
      "outDir": "./build",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "skipLibCheck": true
    }
  }
  ```

- [x] Add scripts inside `package.json` file

  ```json
  ...
  "scripts": {
    "dev": "nodemon ./src/index.ts",
    "start": "node ./build/index.js",
    "build": "tsc -p ."
  }
  ...
  ```

- [x] Configure `.gitignore`, `.prettierrc` and `.prettierignore` files

- `.gitignore` file

  ```
  node_modules
  build
  .env
  ```

- `.prettierrc` file

  ```json
  {
    "tabWidth": 2,
    "semi": true,
    "singleQuote": false,
    "bracketSpacing": true,
    "trailingComma": "es5"
  }
  ```

- `.prettierignore` file

  ```
  node_modules
  build
  ```

- [x] Configure `.env` file

  **Note**: Replace with appropriate value of variables. This is an example of `.env.example` file.

  ```
  # Node
  NODE_ENV="<development|production>"

  # Express
  PORT=5000
  CORS_ORIGIN="*"
  ```

- [x] Setup `src/app.ts` file

  Mostly setup related to Express is done inside this file.

  ```ts
  import { config } from "dotenv";
  import express, { Response } from "express";
  import cors from "cors";
  import cookieParser from "cookie-parser";

  // Accessing environment variables
  config();
  const corsOrigin = process.env.CORS_ORIGIN;

  // Express app
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // Root route
  app.get("/", (_, res: Response) => {
    res.status(200).json({
      message: "Hello, World",
    });
  });

  // API v1 route
  app.get("/api/v1", (_, res: Response) => {
    res.status(200).json({ message: "API v1" });
  });

  // Handle undefined routes
  app.use((_, res: Response) => {
    res.status(404).json({ message: "This route is not defined" });
  });

  export { app };
  ```

- [x] Setup `src/index.ts` file

  This file is the entrypoint of the entire backend service.

  ```ts
  import { config } from "dotenv";
  import { app } from "./app";

  // Accessing environment variables
  config();
  const port = process.env.PORT;

  // Testing the setup
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  ```

- [x] 🧪 Test the setup
