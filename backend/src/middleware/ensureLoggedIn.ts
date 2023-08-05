import { NextFunction, Request, Response } from "express";

function ensureLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (!req.session.isAuthorized) {
    res.status(400);
    throw new Error("Not logged in");
  }
  next();
}

export { ensureLoggedIn };
