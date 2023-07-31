import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.username) {
    res.status(400);
    throw new Error("Username is required");
  }

  if (!req.body.password) {
    res.status(400);
    throw new Error("Password is required");
  }

  if (req.body.password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

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

  if (!newUser) {
    res.status(400);
    throw new Error("Error creating user");
  }

  // send the response
  res.status(201).json({
    message: "User created successfully",
  });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
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

  req.session.save((err) => {
    if (err) {
      res.status(400);
      throw new Error("Error saving session");
    }
  });

  // send the response
  res.status(200).json({
    message: "User logged in successfully",
    session: req.sessionID,
  });
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
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

const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const myUser = await User.findById(req.session.userId);
  if (!myUser) {
    res.status(400);
    throw new Error("User does not exist");
  }
  const myUsername = myUser.username;

  // find users that match the username and is not the current user
  const users = await User.find({
    $and: [
      { username: { $regex: "^" + req.params.username, $options: "i" } },
      { username: { $ne: myUsername } },
    ],
  });

  const match = users.map((user) => {
    return {
      username: user.username,
      _id: user._id,
    };
  });

  res.status(200).json({
    message: "Users found successfully",
    users: match,
  });
});

export { loginUser, logoutUser, registerUser, searchUsers };
