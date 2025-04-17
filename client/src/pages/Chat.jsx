import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ChatComp from "../components/ChatComp";
import api from "../services/api";
import { BsChatDotsFill, BsX, BsSend } from "react-icons/bs";
import "./CSS/Chat.css";

const socket = io("http://localhost:5000", { autoConnect: false });

const Chat = () => {
  const userId = localStorage.getItem("userId") || "user123";
  const [isOnline, setIsOnline] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);
  const hasCheckedServer = useRef(false);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const checkServer = async () => {
      if (hasCheckedServer.current) return;
      hasCheckedServer.current = true;
      try {
        const response = await api.get(`/chat/messages/${userId}`);
        setMessages(response.data);
        setIsOnline(true);
        socket.connect();
      } catch (error) {
        console.error("Server offline:", error.message);
        setIsOnline(false);
      }
    };

    checkServer();

    socket.on("connect", () => setIsOnline(true));
    socket.on("disconnect", () => setIsOnline(false));
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        if (!prev.some((m) => m._id === msg._id)) {
          return [...prev, msg];
        }
        return prev;
      });
      setIsTyping(false);
    });
    socket.on("typing", ({ userId: typingUserId }) => {
      if (typingUserId !== userId) setIsTyping(true);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim() || isSending || !isOnline) return;

    setIsSending(true);
    const userMsg = {
      senderId: userId,
      content: message,
      type: "user",
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", userMsg);
    setMessage("");

    try {
      setIsTyping(true);
      const response = await api.post("/chat/ai", { message });
      const aiMsg = {
        senderId: "AI Assistant",
        content: response.data.reply,
        type: "ai",
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", aiMsg);
    } catch (error) {
      console.error("AI response error:", error);
      const errorMsg = {
        senderId: "AI Assistant",
        content: "Sorry, I couldn’t process your request. Please try again.",
        type: "ai",
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", errorMsg);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim() && isOnline) socket.emit("typing", { userId });
  };

  return (
    <>
      <button
        className="chat-button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Open Chat"
        aria-label="Toggle chat window"
      >
        <BsChatDotsFill size={24} />
        {messages.length > 0 && (
          <span className="chat-badge">{messages.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="chat-modal">
          <div className="chat-header">
            <div className="header-content">
              <h2 className="header-title">Support Assistant</h2>
              <span
                className={`status-indicator ${isOnline ? "online" : "offline"}`}
                title={isOnline ? "Online" : "Offline"}
              ></span>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.length === 0 && !isTyping ? (
              <div className="welcome-message">
                <p>Welcome! How can I assist you today?</p>
              </div>
            ) : (
              <>
                <ChatComp messages={messages} userId={userId} />
                {isTyping && (
                  <div className="typing-indicator">
                    <span>AI is typing</span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="chat-footer">
            <textarea
              value={message}
              onChange={handleTyping}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type your message (e.g., 'Book an appointment')"
              className="message-input"
              disabled={!isOnline || isSending}
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
              }}
            />
            <button
              onClick={sendMessage}
              className="send-button"
              disabled={!isOnline || !message.trim() || isSending}
              aria-label="Send message"
            >
              <BsSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;