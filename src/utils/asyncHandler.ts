import { Request, Response, NextFunction } from "express";

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | void;

const asyncHandler = (handler: Handler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export { asyncHandler };
