import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import friendModel from "../models/friendRequestModel";
import userModel from "../models/userModel";

const sendFriendRequest = asyncHandler(async (req: Request, res: Response) => {
  // check if req.body.id is a valid user so
  // we don't create a friend request for a non-existent user
  const exists = await userModel.exists({ username: req.body.username });
  if (!exists) {
    res.status(400);
    throw new Error(
      "The user you are trying to send a friend request to does not exist",
    );
  }

  // take in username instead of id (since username is unique)
  // eeehh maybe I should just have used id instead, oh well  ¯\_(ツ)_/¯
  const sender = req.session.userId;
  const receiver = exists._id;

  // check if already friends
  const alreadyFriends = await friendModel.findOne({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  });

  if (alreadyFriends) {
    res.status(400);
    throw new Error("You are already friends");
  }

  // create the friend request
  const result = await friendModel.create({
    receiver,
    sender,
  });

  res.status(200).json({
    message: "Friend request sent successfully",
  });
});

const acceptFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const username = req.body.username;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sender = await userModel.findOne({ username });
      if (!sender) {
        res.status(400);
        throw new Error("User does not exist");
      }
      const from = sender._id;
      const to = req.session.userId;
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

const declineFriendRequest = asyncHandler(
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
      throw new Error("Friend request not found");
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({
      message: "Friend request declined successfully",
    });
  },
);

const fetchPendingFriendRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await friendModel
      .find({
        receiver: req.session.userId,
        status: "pending",
      })
      .populate("sender", "username")
      .populate("receiver", "username");

    const friendRequests = data.map((friendRequest) => {
      return {
        _id: friendRequest._id,
        sender: friendRequest.sender,
        receiver: friendRequest.receiver,
        status: friendRequest.status,
      };
    });

    res.status(200).json({
      message: "Friend requests found successfully",
      friendRequests,
    });
  },
);

const findUsersNotFriended = asyncHandler(
  async (req: Request, res: Response) => {
    // returns a list of users matching username
    // that are not friends with the current user (req.session.userId)
    // and with status information

    const myUser = await userModel.findById(req.session.userId);
    if (!myUser) {
      res.status(400);
      throw new Error("User does not exist");
    }

    const myUsername = myUser.username;

    // Find users who are not friends with the current user (req.session.userId)
    // and match the given username
    const users = await userModel.find({
      $and: [
        { friends: { $nin: [req.session.userId] } },
        { username: { $regex: "^" + req.params.username, $options: "i" } },
        { username: { $ne: myUsername } },
      ],
    });

    const friendRequests = await friendModel.find({
      sender: req.session.userId,
    });

    const match = users.map((user) => {
      let status = "none";

      // Check if there is a friend request from the current user to this user
      const foundRequest = friendRequests.find(
        (request) => request.receiver.toString() === user._id.toString(),
      );

      // Set the status if we have sent a friend request to this user
      if (foundRequest) {
        status = foundRequest.status;
      }

      // otherwise, set the status to none

      return {
        username: user.username,
        _id: user._id,
        status,
      };
    });

    res.status(200).json({
      message: "Users found successfully",
      users: match,
    });
  },
);

const getUserFriends = asyncHandler(async (req: Request, res: Response) => {
  const user = await userModel.findById(req.session.userId).populate({
    path: "friends",
    select: "username",
  });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  res.status(200).json({
    message: "Friends found successfully",
    friends: user.friends as unknown as string[],
  });
});

export {
  acceptFriendRequest,
  declineFriendRequest,
  fetchPendingFriendRequests,
  findUsersNotFriended,
  getUserFriends,
  sendFriendRequest,
};
