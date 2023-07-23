import { NextFunction, Request, Response } from "express";

const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isAuthorized && req.method !== "DELETE") {
    res.status(400);
    throw new Error("Already logged in");
  }
  if (!req.session.isAuthorized && req.method === "DELETE") {
    res.status(400);
    throw new Error("Not logged in");
  }
  next();
};

export default checkLoggedIn;
