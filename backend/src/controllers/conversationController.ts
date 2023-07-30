import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import conversationModel from "../models/conversationModel";
import userModel from "../models/userModel";

type ID = string;

const createConversation = asyncHandler(async (req: Request, res: Response) => {
  let conversationId: string;

  const { conversationName, participants } = req.body as {
    conversationName: string;
    participants: ID[];
  };
  if (!conversationName || !participants) {
    res.status(400);
    throw new Error("No name or members");
  }

  participants.push(req.session.userId!.toString());

  const conversationStarter = req.session.userId;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const conversation = await conversationModel.create(
      [
        {
          conversationName,
          participants,
        },
      ],
      { session },
    );

    if (!conversation) {
      res.status(400);
      throw new Error("Could not create conversation");
    }

    const createdConversation = await conversationModel
      .findOne({
        conversationName,
      })
      .session(session);

    if (!createdConversation) {
      res.status(400);
      throw new Error("Could not find created conversation");
    }

    conversationId = createdConversation._id.toString();
    const users = await userModel
      .find({ _id: { $in: participants } })
      .session(session);

    await Promise.all(
      users.map(async (user) => {
        user.conversations.push(createdConversation._id);
        await user.save({ session });
      }),
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  // return the id of the created conversation and a success message
  res.status(200).json({
    message: "Conversation created successfully",
    conversationId,
  });
});

const fetchConversations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.userId;

  const conversations = await userModel
    .findById(userId)
    .populate({
      path: "conversations",
    })
    .select("conversations");

  res.status(200).json({
    message: "Conversations found successfully",
    conversations,
  });
});

export { createConversation, fetchConversations };
