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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const friendRequest = await friendModel.findOne({
        sender: from,
        receiver: to,
        status: "pending",
      });
      if (!friendRequest) {
        throw new Error("Friend request not found");
      }
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
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    res.status(200).json({
      message: "Friend request accepted successfully",
    });
  },
);

const getFriendRequestsGet = asyncHandler(
  async (req: Request, res: Response) => {
    const friendRequests = await friendModel.find({
      receiver: req.session.userId,
      status: "pending",
    });

    // todo: maybe not send everything

    res.status(200).json({
      friendRequests,
    });
  },
);

export { friendRequestAcceptPost, friendRequestPost, getFriendRequestsGet };
