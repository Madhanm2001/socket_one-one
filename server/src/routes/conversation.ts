import express from "express";
import { getMessage, createMessage, deleteMessage } from "../controllers/conversation";
import { authMiddleware } from "../middlewares/authentication";

const router = express.Router();

router.post("/",authMiddleware, createMessage);
router.get("/:toId",authMiddleware, getMessage);
router.delete("/:toId",authMiddleware, deleteMessage);

export default router;
