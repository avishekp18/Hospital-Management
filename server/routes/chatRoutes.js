import express from "express";
import { getMessages, postAIResponse } from "../controllers/chatController.js";
import { validateChatMessage } from "../middleware/chatMessage.js";

const router = express.Router();

router.get("/messages/:userId", getMessages);
router.post("/ai", validateChatMessage, postAIResponse);

export default router;