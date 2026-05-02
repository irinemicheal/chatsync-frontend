import { useState } from "react";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you?", fromMe: false, time: "10:01 AM" },
    { id: 2, text: "I'm good! What about you?", fromMe: true, time: "10:02 AM" },
    { id: 3, text: "Doing great, thanks!", fromMe: false, time: "10:03 AM" },
    { id: 4, text: "Let's catch up soon 😊", fromMe: true, time: "10:05 AM" },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      fromMe: true,
      time: getTime(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate reply after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        text: "Got your message! 😊",
        fromMe: false,
        time: getTime(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
  <div style={styles.avatar}>
    {selectedUser ? selectedUser.name[0] : "?"}
  </div>
  <div>
    <p style={styles.name}>
      {selectedUser ? selectedUser.name : "Select a chat"}
    </p>
    <p style={styles.status}>
      {selectedUser?.online ? "Online" : "Offline"}
    </p>
  </div>
</div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.messageRow,
              justifyContent: msg.fromMe ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.fromMe ? "#7c6af7" : "#2e3044",
              }}
            >
              <p style={styles.text}>{msg.text}</p>
              <p style={styles.time}>{msg.time}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={styles.typingBubble}>
              <span style={styles.dot} />
              <span style={styles.dot} />
              <span style={styles.dot} />
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={styles.inputBar}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#0f1117",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid #2e3044",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#1a1d27",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#7c6af7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
  },
  name: {
    fontWeight: "bold",
    fontSize: "15px",
    color: "white",
  },
  status: {
    fontSize: "12px",
    color: "#22c55e",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageRow: {
    display: "flex",
  },
  bubble: {
    maxWidth: "65%",
    padding: "10px 14px",
    borderRadius: "12px",
  },
  text: {
    fontSize: "14px",
    color: "white",
  },
  time: {
    fontSize: "10px",
    color: "#ccc",
    marginTop: "4px",
    textAlign: "right",
  },
  typingBubble: {
    backgroundColor: "#2e3044",
    borderRadius: "12px",
    padding: "12px 16px",
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#888",
    animation: "bounce 1s infinite",
    display: "inline-block",
  },
  inputBar: {
    padding: "16px 20px",
    borderTop: "1px solid #2e3044",
    display: "flex",
    gap: "12px",
    backgroundColor: "#1a1d27",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #2e3044",
    backgroundColor: "#0f1117",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  sendBtn: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#7c6af7",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ChatWindow;