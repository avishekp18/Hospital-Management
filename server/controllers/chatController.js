import Chat from "../models/Chat.js";

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Chat.find({ userId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const postAIResponse = async (req, res) => {
  try {
    const { message } = req.body;
    let aiReply;

    // Simple logic to detect appointment booking intent
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("book") || lowerMessage.includes("appointment")) {
      // Simulate booking logic (replace with actual appointment creation later)
      const appointmentDetails = {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(), // Tomorrow
        time: "10:00 AM",
        doctor: "Dr. Smith",
      };
      aiReply = `I've scheduled your appointment for ${appointmentDetails.date} at ${appointmentDetails.time} with ${appointmentDetails.doctor}. Please confirm or let me know if you'd like a different time.`;
    } else {
      // Default response for other messages
      aiReply = "How can I assist you today? For example, say 'Book an appointment' to schedule a visit.";
    }

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI response error:", error);
    res.status(500).json({ error: "AI error" });
  }
};

export { getMessages, postAIResponse };