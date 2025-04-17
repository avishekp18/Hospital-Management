import PropTypes from "prop-types";

const formatAppointment = (appt) => {
  const date = appt.date ? new Date(appt.date).toLocaleDateString() : "N/A";
  const time = appt.time || "N/A";
  const reason = appt.reason || "No reason provided";
  const status = appt.status || "Unknown";
  const doctorId = appt.doctorId ? `Doctor ID: ${appt.doctorId}` : "Doctor: N/A";
  return `${doctorId} - Date: ${date}, Time: ${time}, Reason: ${reason}, Status: ${status}`;
};

const formatTimestamp = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleTimeString() : "N/A";

const ChatBox = ({ messages = [], appointments = [], isTyping = false }) => (
  <div className="crt-chatbox">
    {messages.length > 0 ? (
      messages.map((msg, index) => (
        <div
          key={`msg-${msg._id || index}`}
          className={`chat-message ${msg.user === "You" ? "user" : msg.user === "System" ? "system" : "ai"}`}
        >
          <span className="crt-user">{msg.user || "Unknown"}:</span>
          <span>{msg.text || "No content"}</span>
          <small className="crt-timestamp">{formatTimestamp(msg.timestamp)}</small>
        </div>
      ))
    ) : (
      <div className="chat-message system">No messages yet.</div>
    )}
    {appointments.length > 0 &&
      appointments.map((appt, index) => (
        <div key={`appt-${appt._id || index}`} className="chat-message system">
          <span className="crt-user">System:</span>
          <span>{formatAppointment(appt)}</span>
          <small className="crt-timestamp">{formatTimestamp(appt.timestamp)}</small>
        </div>
      ))}
    {isTyping && (
      <div className="chat-message ai">
        <span className="crt-user">AI:</span> <span>Typing...</span>
      </div>
    )}
  </div>
);

ChatBox.defaultProps = {
  messages: [],
  appointments: [],
  isTyping: false,
};

ChatBox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    })
  ),
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      doctorId: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      time: PropTypes.string,
      reason: PropTypes.string,
      status: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    })
  ),
  isTyping: PropTypes.bool,
};

export default ChatBox;