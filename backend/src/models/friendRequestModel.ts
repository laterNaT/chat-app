import mongoose, { Schema } from "mongoose";

type TFriendRequest = {
  sender: typeof Schema.Types.ObjectId;
  receiver: typeof Schema.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
};

const friendRequestSchema = new mongoose.Schema<TFriendRequest>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: [true, "Please enter a sender"],
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: [true, "Please enter a receiver"],
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model<TFriendRequest>(
  "FriendRequest",
  friendRequestSchema,
);
