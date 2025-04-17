const validateChatMessage = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Invalid message" });
  }
  next();
};

export { validateChatMessage };