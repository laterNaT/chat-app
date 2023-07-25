import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
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

const friendRequestAcceptPost = asyncHandler(
  async (req: Request, res: Response) => {
    const from = req.body.id;
    const to = req.session.userId;
    const friendRequest = await friendModel.findOne({
      sender: from,
      receiver: to,
      status: "pending",
    });

    if (!friendRequest) {
      res.status(400);
      throw new Error("Friend request does not exist");
    }

    const session = await mongoose.startSession();

    try {
      friendRequest.status = "accepted";
      await friendRequest.save({ session });
      const update1 = await userModel.updateOne(
        { _id: from },
        { $push: { friends: to } },
        { new: true, session },
      );
      const update2 = await userModel.updateOne(
        { _id: to },
        { $push: { friends: from } },
        { new: true, session },
      );
      if (update1.modifiedCount === 0 || update2.modifiedCount === 0) {
        throw new Error("Failed to update friends");
      }
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

    await userModel.updateOne(
      { _id: from },
      { $push: { friends: to } },
      { new: true },
    );

    await userModel.updateOne(
      { _id: to },
      { $push: { friends: from } },
      { new: true },
    );

    res.status(200).json({
      message: "Friend request accepted successfully",
    });
  },
);

export { friendRequestAcceptPost, friendRequestPost };
