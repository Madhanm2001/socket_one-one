import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId1: {
      type: String,
      required: true,
    },
    userId2: {
      type: String,
      required: true,
    },
    conversation: [
      {
        fromId: {
          type: String,
          required: true,
        },
        toId: {
          type: String,
          required: true,
        },
        chat: {
          type: String,
          required: true,
          default: "start your chat",
        },
        time:{
          type:String,
          require:true
        }
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation
