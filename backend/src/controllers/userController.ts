import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

const registerUserPost = asyncHandler(async (req: Request, res: Response) => {
  // first check if the username is already taken
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    res.status(400);
    throw new Error("Username is already taken");
  }
  // create the user
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
  });
  res.status(201).json({
    message: "User created successfully",
  });
});

export { registerUserPost };
