import { useState, useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";

const ChatWindow = () => {
  const { selectedUser, conversations, addMessage } = useChatStore();
  const messages = selectedUser ? (conversations[selectedUser.id] || []) : [];

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = () => {
    if (inputText.trim() === "" || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      fromMe: true,
      time: getTime(),
    };

    addMessage(selectedUser.id, newMessage);
    setInputText("");

    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Got your message! 😊",
        fromMe: false,
        time: getTime(),
      };
      addMessage(selectedUser.id, reply);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (!selectedUser) {
    return (
      <div style={styles.empty}>
        <p>👈 Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>{selectedUser.name[0]}</div>
        <div>
          <p style={styles.name}>{selectedUser.name}</p>
          <p style={styles.status}>
            {selectedUser.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

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

        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={styles.typingBubble}>
              <span style={styles.dot} />
              <span style={styles.dot} />
              <span style={styles.dot} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBar}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  empty: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: "16px",
    backgroundColor: "#0f1117",
  },
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