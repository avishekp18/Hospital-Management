import Chat from "../models/Chat.js";

const setupChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("sendMessage", async (msg) => {
      try {
        const chatMessage = new Chat({
          senderId: msg.senderId,
          content: msg.content,
          type: msg.type,
          userId: msg.senderId,
          timestamp: msg.timestamp || new Date(),
        });
        await chatMessage.save();
        io.emit("receiveMessage", chatMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("typing", ({ userId }) => {
      socket.broadcast.emit("typing", { userId });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export default setupChatSocket;