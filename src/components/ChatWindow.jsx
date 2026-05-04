import { useState, useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import useSocketStore from "../store/useSocketStore";
import MediaViewer from "./MediaViewer";
import SharedMediaPanel from "./SharedMediaPanel";

const ChatWindow = () => {
  const { selectedUser, messages, fetchMessages, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const { socket, onlineUsers } = useSocketStore();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewingMedia, setViewingMedia] = useState(null);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      setShowMediaPanel(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStopTyping", () => setIsTyping(false));
    return () => {
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [socket]);

  const getTime = (date) => {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

 const handleSend = async () => {
  if (inputText.trim() === "" || !selectedUser) return;
  const msg = await sendMessage(selectedUser.id, inputText);
  if (socket && msg) {
    socket.emit("sendMessage", {
      receiverId: selectedUser.id,
      message: {
        ...msg,
        senderId: user.id, // ensure string
      },
    });
  }
  setInputText("");
};

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const fileUrl = reader.result;
      const msg = await sendMessage(
        selectedUser.id, "", fileUrl, file.name, file.type
      );
      if (socket && msg) {
        socket.emit("sendMessage", {
          receiverId: selectedUser.id,
          message: {
            ...msg,
            senderId: user.id, // ensure string
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    if (socket && selectedUser) {
      socket.emit("typing", { receiverId: selectedUser.id, senderId: user.id });
      setTimeout(() => {
        socket.emit("stopTyping", { receiverId: selectedUser.id });
      }, 1000);
    }
  };

  if (!selectedUser) {
    return (
      <div style={styles.empty}>
        <p>👈 Select a user to start chatting</p>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser.id);

  return (
    <div style={{ display: "flex", flex: 1, height: "100vh" }}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>
              {selectedUser?.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.name}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                selectedUser.name[0]
              )}
            </div>
            <div>
              <p style={styles.name}>{selectedUser.name}</p>
              <p style={{ ...styles.status, color: isOnline ? "#22c55e" : "#888" }}>
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMediaPanel(!showMediaPanel)}
            style={styles.mediaBtn}
            title="View shared media"
          >
            🖼️
          </button>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg) => {
            const isMe = msg.senderId === user.id || msg.senderId?._id === user.id;
            return (
              <div
                key={msg._id}
                style={{
                  ...styles.messageRow,
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                {/* Other user avatar */}
                {!isMe && (
  <div style={styles.msgAvatar}>
    {selectedUser?.profilePic ? (
      <img
        src={selectedUser.profilePic}
        alt={selectedUser.name}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ) : (
      <span>{selectedUser?.name?.[0]}</span>
    )}
  </div>
)}

                <div
                  style={{
                    ...styles.bubble,
                    backgroundColor: isMe ? "#7c6af7" : "#2e3044",
                  }}
                >
                  {/* Image message */}
                  {msg.fileUrl && msg.fileType?.startsWith("image") && (
                    <img
                      src={msg.fileUrl}
                      alt="shared"
                      style={styles.sharedImage}
                      onClick={() => setViewingMedia(msg.fileUrl)}
                    />
                  )}

                  {/* Document message */}
                  {msg.fileUrl && !msg.fileType?.startsWith("image") && (
                    <a href={msg.fileUrl} download={msg.fileName} style={styles.docBubble}>
                      <span style={{ fontSize: "20px" }}>📄</span>
                      <span style={styles.docBubbleName}>{msg.fileName || "Document"}</span>
                      <span>⬇️</span>
                    </a>
                  )}

                  {/* Text message */}
                  {msg.text && <p style={styles.text}>{msg.text}</p>}

                  <p style={styles.time}>{getTime(msg.createdAt)}</p>
                </div>

                {/* My avatar */}
                {isMe && (
  <div style={styles.msgAvatar}>
    {user?.profilePic ? (
      <img
        src={user.profilePic}
        alt={user.fullName}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ) : (
      <span>{user?.fullName?.[0]}</span>
    )}
  </div>
)}
              </div>
            );
          })}

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

        {/* Input Bar */}
        <div style={styles.inputBar}>
          <label style={styles.attachBtn} title="Send image or document">
            📎
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendBtn}>Send</button>
        </div>
      </div>

      {/* Shared Media Panel */}
      {showMediaPanel && (
        <SharedMediaPanel onClose={() => setShowMediaPanel(false)} />
      )}

      {/* Media Viewer */}
      {viewingMedia && (
        <MediaViewer url={viewingMedia} onClose={() => setViewingMedia(null)} />
      )}
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
    justifyContent: "space-between",
    backgroundColor: "#1a1d27",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
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
    overflow: "hidden",
  },
  mediaBtn: {
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "8px",
  },
  name: {
    fontWeight: "bold",
    fontSize: "15px",
    color: "white",
    margin: 0,
  },
  status: {
    fontSize: "12px",
    margin: 0,
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
  msgAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#7c6af7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
    flexShrink: 0,
    overflow: "hidden",
  },
  bubble: {
    maxWidth: "60%",
    padding: "10px 14px",
    borderRadius: "12px",
  },
  sharedImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "8px",
    cursor: "pointer",
    objectFit: "cover",
    display: "block",
    marginBottom: "4px",
  },
  docBubble: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "white",
    fontSize: "13px",
  },
  docBubbleName: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "120px",
  },
  text: {
    fontSize: "14px",
    color: "white",
    margin: 0,
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
    alignItems: "center",
  },
  attachBtn: {
    fontSize: "22px",
    cursor: "pointer",
    padding: "4px",
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