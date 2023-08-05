import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import friendModel from "../models/friendRequestModel";
import userModel from "../models/userModel";

const sendFriendRequest = asyncHandler(async (req: Request, res: Response) => {
  const senderUser = await userModel.findById(req.session.userId);
  const receiverUser = await userModel.findOne({ username: req.body.username });

  if (!senderUser || !receiverUser) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const sender = senderUser._id;
  const receiver = receiverUser._id;

  const alreadyFriends =
    senderUser.friends.includes(receiver) ||
    receiverUser.friends.includes(sender);

  if (alreadyFriends) {
    res.status(400);
    throw new Error("You are already friends");
  }

  const weAlreadySentRequest = await friendModel.findOne({
    sender,
    receiver,
  });

  if (weAlreadySentRequest) {
    res.status(400);
    throw new Error("You have already sent a friend request to this user");
  }

  const theyAlreadySentRequest = await friendModel.findOne({
    sender: receiver,
    receiver: sender,
  });

  if (theyAlreadySentRequest) {
    res.status(400);
    throw new Error("This user has already sent you a friend request");
  }

  // create the friend request
  await friendModel.create({
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
      // check if the user we are accepting the friend request from exists
      const sender = await userModel.findOne({ username }).session(session);
      if (!sender) {
        res.status(400);
        throw new Error("User does not exist");
      }

      // check if already friends
      if (sender.friends.includes(req.session.userId)) {
        res.status(400);
        throw new Error("You are already friends");
      }

      // check if the friend request exists
      const from = sender._id;
      const to = req.session.userId;
      const friendRequest = await friendModel
        .findOne({
          sender: from,
          receiver: to,
          status: "pending",
        })
        .session(session);
      if (!friendRequest) {
        res.status(400);
        throw new Error("Friend request not found");
      }

      // set the status to accepted
      friendRequest.status = "accepted";
      await friendRequest.save({ session });

      // update the friends list for both users
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

      // check if the updates were successful
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
