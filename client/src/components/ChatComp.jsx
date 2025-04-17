import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in ChatComp:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          Something went wrong.{" "}
          {/* eslint-disable-next-line no-undef */}
          {process.env.NODE_ENV === "development" && (
            <small>Error: {this.state.error.message}</small>
          )}
        </div>
      );
    }
    return this.props.children || <div>No content</div>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

const ChatComp = ({ messages, userId }) => {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const formatTimestamp = (isoTimestamp) =>
    isoTimestamp
      ? new Date(isoTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <ErrorBoundary>
      <div className="chat-messages">
        {safeMessages.length === 0 ? (
          <div className="no-messages">Start the conversation...</div>
        ) : (
          safeMessages.map((msg) => (
            <div
              key={msg._id || msg.timestamp || Math.random()}
              className={`message-container ${msg.senderId === userId ? "user" : "ai"}`}
            >
              <div className="sender-label">
                {msg.senderId === userId ? "You" : msg.senderId === "AI Assistant" ? "AI" : msg.senderId}
              </div>
              <div className="message-bubble">{msg.content || "No content"}</div>
              <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </ErrorBoundary>
  );
};

ChatComp.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      senderId: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      type: PropTypes.string,
      timestamp: PropTypes.string,
    })
  ).isRequired,
  userId: PropTypes.string.isRequired,
};

export default ChatComp;