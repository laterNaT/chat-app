import { NextFunction, Request, Response } from "express";

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
};

export default logRequest;
