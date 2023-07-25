import mongoose, { Schema } from "mongoose";

type TFriendRequest = {
  sender: typeof Schema.Types.ObjectId;
  receiver: typeof Schema.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
};

const friendRequestSchema = new mongoose.Schema<TFriendRequest>({
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
});

export default mongoose.model<TFriendRequest>(
  "FriendRequest",
  friendRequestSchema,
);
