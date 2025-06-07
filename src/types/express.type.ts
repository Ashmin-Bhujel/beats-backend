import { UserResponseType } from "./user.type";

// Extending request object to have user property
declare global {
  namespace Express {
    interface Request {
      user?: UserResponseType;
    }
  }
}
