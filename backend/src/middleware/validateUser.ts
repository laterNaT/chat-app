import { NextFunction, Request, Response } from "express";

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isAuthorized) {
    res.status(401);
    throw new Error("Not authorized");
  }
  next();
};

export default validateUser;
