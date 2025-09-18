import { Response } from "express";
import Conversation from "../models/conversation";

export const getMessage = async (req: any, res: Response) => {
  try {
    const {toId} = req.params;
    const fromId = req.user.id;

    let conversation = await Conversation.findOne({
      $or: [
        { userId1: fromId, userId2: toId },
        { userId1: toId, userId2: fromId }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId1: fromId,
        userId2: toId,
        conversation: []
      });
    } else {
      conversation = await Conversation.findById(conversation._id).select('+conversation')
    }
    return res.json({
      message: "get Messages successfully",
      data: conversation,
      toId
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createMessage = async (req: any, res: Response) => {
  try {
    const { toId, chat } = req.body;
    const fromId = req.user.id;

    let conversation = await Conversation.findOne({
      $or: [
        { userId1: fromId, userId2: toId },
        { userId1: toId, userId2: fromId }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId1: fromId,
        userId2: toId,
        conversation: [{ fromId, toId, chat }]
      });
    } else {
      conversation = await Conversation.findByIdAndUpdate(
        conversation._id,
        { $push: { conversation: { fromId, toId, chat, time:Date.now()} } },
        { new: true }
      );
    }
    return res.json({
      message: "Message saved successfully",
      data: conversation,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req: any, res: Response) => {
  try {
    const {chatId} = req.query;
    const {toId} = req.params;
    const fromId = req.user.id;

    let conversation = await Conversation.findOneAndUpdate(
      {
        $or: [
          { userId1: fromId, userId2: toId },
          { userId1: toId, userId2: fromId }
        ]
      },
      {
        $pull: { conversation: { _id: chatId } }
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.json({
      message: "Message deleted successfully",
      data: conversation,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};




