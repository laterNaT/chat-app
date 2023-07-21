import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

const registerUserPost = asyncHandler(async (req: Request, res: Response) => {
  // check if the username is already taken
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

  // send the response
  res.status(201).json({
    message: "User created successfully",
  });
});

const loginUserPost = asyncHandler(async (req: Request, res: Response) => {
  // check if the username exists
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.status(400);
    throw new Error("Username does not exist");
  }

  // check if the password is correct
  if (user.password !== req.body.password) {
    res.status(400);
    throw new Error("Password is incorrect");
  }

  // set the user as authorized
  req.session.isAuthorized = true;

  // send the response
  res.status(200).json({
    message: "User logged in successfully",
    session: req.sessionID,
  });
});

export { loginUserPost, registerUserPost };
