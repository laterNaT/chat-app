import mongoose from "mongoose";

type TConversation = {
  conversationName: string;
  conversationStarter: typeof mongoose.Schema.Types.ObjectId;
  participants: (typeof mongoose.Schema.Types.ObjectId)[];
  messages: {
    sender: typeof mongoose.Schema.Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];
};

const conversationSchema = new mongoose.Schema<TConversation>({
  conversationName: {
    type: String,
    required: [true, "Please enter a conversation name"],
  },
  conversationStarter: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter who started the conversation"],
    ref: "User",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please enter a participant"],
      ref: "User",
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please enter a sender"],
        ref: "User",
      },
      message: {
        type: String,
        required: [true, "Please enter a message"],
      },
      createdAt: {
        type: Date,
        required: [true, "Please enter a created at"],
      },
    },
  ],
});

export default mongoose.model<TConversation>(
  "Conversation",
  conversationSchema,
);
