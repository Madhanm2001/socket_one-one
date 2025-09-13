import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Conversation from "./models/conversation";
import userRoutes from './routes/user'
import conversationRoutes from './routes/conversation'

const app = express();
const server = http.createServer(app);
dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/conversation', conversationRoutes);


mongoose.connect(process.env.MONGO_DB_URL || "");

const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
  },
});

const socketOneToOne = socketIO.of("/socket_one-one");
const userIdMatchList: any = new Map<string, string>();

socketOneToOne.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  try {
    const token =
      (socket.handshake.auth as any)?.token || socket.handshake.query?.token;

    if (!token) {
      console.log("❌ No token provided, disconnecting:", socket.id);
      socket.emit("system_message", "Authentication failed: token missing");
      socket.disconnect();
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const fromId = decoded.id;

    // save userId -> socketId mapping
    userIdMatchList.set(fromId, socket.id);

    setTimeout(() => {
      socket.emit("system_message", `Welcome! You are connected as ${socket.id}`);
      socket.emit(
        "system_message",
        `active client's count ${socketOneToOne.sockets.size}`
      );
    }, 100);

    socket.broadcast.emit("system_message", `🟢 A new user has joined the chat.`);

    socket.on("send_private_message", async (toId, chat, callback) => {
    try {
      if (!fromId) {
        if (callback) callback({ error: "Sender not found" });
        return;
      }

      const recipientSocketId = userIdMatchList.get(toId);
      if (recipientSocketId) {
        socketOneToOne.to(recipientSocketId).emit("receive_message", {
          fromId,
          toId,
          chat,
        });
        console.log(`📩 Message from ${fromId} -> ${toId}`);
      } else {
        console.log(`⚠️ User ${toId} not online`);
      }

      let conversation = await Conversation.findOne({
        $or: [
          { userId1: fromId, userId2: toId },
          { userId1: toId, userId2: fromId },
        ],
      });

      if (!conversation) {
        conversation = await Conversation.create({
          userId1: fromId,
          userId2: toId,
          conversation: [{ fromId, toId, chat }],
        });
      } else {
        conversation = await Conversation.findByIdAndUpdate(
          conversation._id,
          { $push: { conversation: { fromId, toId, chat } } },
          { new: true }
        );
      }

      if (callback) {
        callback({
          message: "Message saved successfully",
          data: conversation,
        });
      }
    } catch (error: any) {
      if (callback) callback({ error: error.message });
    }
  });

  socket.on("delete_private_message", async (chatId, toId, callback) => {
    const receiverSocketId = userIdMatchList.get(toId);
    if (receiverSocketId) {
      socketOneToOne
        .to(receiverSocketId)
        .emit("message_deleted", { _id:chatId, fromId });
      console.log(
        `🗑️ Delete request from ${fromId} -> ${toId}, chatId: ${chatId}`
      );
    } else {
      console.log(`⚠️ User ${toId} not online`);
    }

    try {
      let conversation = await Conversation.findOneAndUpdate(
        {
          $or: [
            { userId1: fromId, userId2: toId },
            { userId1: toId, userId2: fromId },
          ],
        },
        {
          $pull: { conversation: { _id: chatId } },
        },
        { new: true }
      );

      if (!conversation) {
        if (callback) callback({ error: "Conversation not found" });
        return;
      }

      if (callback) {
        callback({
          message: "Message deleted successfully",
          data: conversation,
        });
      }
    } catch (error: any) {
      if (callback) callback({ error: error.message });
    }
  });

    socket.on("disconnect", () => {
      userIdMatchList.delete(fromId);
      console.log("🔴 Client disconnected:", socket.id);
    });

  } catch (error: any) {
    console.error("❌ Socket authentication error:", error.message);
    socket.emit("system_message", "Authentication failed: invalid token");
    socket.disconnect();
  }
});


setInterval(() => {
  socketOneToOne.emit(
    "system_message",
    `active client's count ${socketOneToOne.sockets.size}`
  );
}, 10000);



server.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
