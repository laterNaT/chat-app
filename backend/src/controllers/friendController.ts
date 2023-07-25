import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import friendModel from "../models/friendRequestModel";
import userModel from "../models/userModel";

const friendRequestPost = asyncHandler(async (req: Request, res: Response) => {
  // check if req.body.id is a valid user so
  // we don't create a friend request for a non-existent user
  const exists = await userModel.exists({ _id: req.body.id });
  if (!exists) {
    res.status(400);
    throw new Error(
      "The user you are trying to send a friend request to does not exist",
    );
  }

  // check if already friends
  const alreadyFriends = await friendModel.findOne({
    $or: [
      { sender: req.session.userId, receiver: req.body.id },
      { sender: req.body.id, receiver: req.session.userId },
    ],
  });

  if (alreadyFriends) {
    res.status(400);
    throw new Error("You are already friends");
  }

  // create the friend request
  const result = await friendModel.create({
    receiver: req.body.id,
    sender: req.session.userId,
  });

  // send the response
  res.status(200).json({
    message: "Friend request sent successfully",
  });
});

export { friendRequestPost };
