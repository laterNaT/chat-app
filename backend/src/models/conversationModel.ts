import mongoose, { Schema } from "mongoose";

type TConversation = {
  conversationName: string;
  conversationStarter: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: {
    sender: mongoose.Types.ObjectId;
    message: string;
    date: Date;
  }[];
};

const conversationSchema = new mongoose.Schema<TConversation>({
  conversationName: {
    type: String,
    required: [true, "Please enter a conversation name"],
  },
  conversationStarter: {
    type: Schema.Types.ObjectId,
    required: [true, "Please enter who started the conversation"],
    ref: "User",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      required: [true, "Please enter a participant"],
      ref: "User",
    },
  ],
  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        required: [true, "Please enter a sender"],
        ref: "User",
      },
      message: {
        type: String,
        date: Date,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model<TConversation>(
  "Conversation",
  conversationSchema,
);
