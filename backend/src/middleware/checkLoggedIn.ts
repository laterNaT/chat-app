import { NextFunction, Request, Response } from "express";

const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isAuthorized) {
    res.status(400);
    throw new Error("Already logged in");
  }
  next();
};

export default checkLoggedIn;
