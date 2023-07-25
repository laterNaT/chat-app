import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

//todo: create unified response type

const registerUserPost = asyncHandler(async (req: Request, res: Response) => {
  // check if the username is already taken
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    res.status(400);
    throw new Error("Username is already taken");
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // create the user
  const newUser = await User.create({
    username: req.body.username,
    password: hashedPassword,
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
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    res.status(400);
    throw new Error("Password is incorrect");
  }

  // set the user as authorized
  req.session.isAuthorized = true;
  // save the user id
  req.session.userId = user._id;

  // send the response
  res.status(200).json({
    message: "User logged in successfully",
    session: req.sessionID,
  });
});

const logoutUserDelete = asyncHandler(async (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        throw new Error("Error destroying session");
      } else {
        res.clearCookie("session");
        res.status(200).json({
          message: "User logged out successfully",
        });
      }
    });
  } else {
    res.status(400);
    throw new Error("Session does not exist");
  }
});

const findUsersGet = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({
    username: { $regex: "^" + req.params.username, $options: "i" },
  });

  if (users.length === 0) {
    res.status(400);
    throw new Error("No users found");
  }

  const match = users.map((user) => {
    return {
      username: user.username,
      id: user._id,
    };
  });

  res.status(200).json({
    message: "Users found successfully",
    users: match,
  });
});

export { findUsersGet, loginUserPost, logoutUserDelete, registerUserPost };
