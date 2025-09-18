
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import User from "../models/user";
import Conversation from "../models/conversation";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        if (!name || !email || !phoneNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User created successfully", userId: newUser._id });
    } catch (error: any) {
      console.log(error.message);
      
        return res.status(500).json({ error: error.message });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber, password } = req.body;

        if ((!email && !phoneNumber) || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({
            $or: [{ email }, { phoneNumber }],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET as string
        );
       console.log(token);
       
        return res.status(200).json({
            message: "User signed in successfully",
            token
        });
    } catch (err) {
        console.error("SignIn Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getUsersListWithRecentMessage = async (req: any, res: Response) => {
  try {
    const loginUserId = req.user.id;

    const users = await User.find({ _id: { $ne: loginUserId } })
      .select("_id name");

    const userList = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          $or: [
            { userId1: loginUserId, userId2: user._id },
            { userId1: user._id, userId2: loginUserId },
          ],
        })
          .sort({ updatedAt: -1 })
          .slice("conversation", -1)
          .lean();

        const recentMessage = conversation?.conversation?.[0] || null;

        return {
          user,
          recentMessage,
          recentTime: recentMessage?.time ? new Date(recentMessage.time) : null,
        };
      })
    );

    // 🔹 Sort by recentMessage.time descending (latest → oldest)
    userList.sort((a, b) => {
      if (!a.recentTime) return 1;
      if (!b.recentTime) return -1;
      return b.recentTime.getTime() - a.recentTime.getTime();
    });

    return res.json({ userList, loginUserId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};




// const userList = await User.aggregate([
//   { $match: { _id: { $ne: new mongoose.Types.ObjectId(fromId) } } },
//   {
//     $lookup: {
//       from: "conversations",
//       localField: "recentMessage",
//       foreignField: "_id",
//       as: "recentMessage"
//     }
//   },
//   { $unwind: "$recentMessage" },
//   {
//     $addFields: {
//       lastConversation: {
//         $arrayElemAt: ["$recentMessage.conversation", -1] // 👈 last chat only
//       }
//     }
//   },
//   { $sort: { updatedAt: 1 } }
// ]);

// return res.json(userList);

