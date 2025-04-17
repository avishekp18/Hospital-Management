// server/models/Chat.js
import mongoose from "mongoose";

// Define the schema
const chatSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["user", "ai"], default: "user" },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Export the model, reusing it if already compiled
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);