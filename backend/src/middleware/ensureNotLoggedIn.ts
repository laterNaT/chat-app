import { NextFunction, Request, Response } from "express";

function ensureNotLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.session.isAuthorized) {
    res.status(400);
    throw new Error("Already logged in");
  }
  next();
}

export { ensureNotLoggedIn };
