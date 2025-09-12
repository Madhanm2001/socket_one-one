import express from "express";
import { signUp, signIn, getUsersListWithRecentMessage } from '../controllers/user'
import { authMiddleware } from "../middlewares/authentication";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/",authMiddleware,getUsersListWithRecentMessage);

export default router;
