import { useEffect } from "react";
import axios from "axios";
import useChatStore from "../store/useChatStore";
import useSocketStore from "../store/useSocketStore";
import useAuthStore from "../store/useAuthStore";
import { create } from "zustand";

const useUserStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ users: res.data });
  },
}));

const Sidebar = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { user, logout } = useAuthStore();
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.title}>💬 ChatSync</h2>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.userList}>
        {users.length === 0 && (
          <p style={styles.noUsers}>No other users yet. Ask a friend to sign up!</p>
        )}
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser({ id: u._id, name: u.fullName, online: onlineUsers.includes(u._id) })}
            style={{
              ...styles.userItem,
              backgroundColor: selectedUser?.id === u._id ? "#2e3044" : "transparent",
            }}
          >
            <div style={styles.avatarWrapper}>
              <div style={styles.avatar}>{u.fullName[0]}</div>
              {onlineUsers.includes(u._id) && <span style={styles.onlineDot} />}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.nameRow}>
                <span style={styles.name}>{u.fullName}</span>
              </div>
              <p style={styles.lastMsg}>
                {onlineUsers.includes(u._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "300px",
    backgroundColor: "#1a1d27",
    borderRight: "1px solid #2e3044",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  header: {
    padding: "20px",
    borderBottom: "1px solid #2e3044",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#7c6af7",
    fontSize: "20px",
  },
  logoutBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ff4d4d22",
    color: "#ff4d4d",
    cursor: "pointer",
    fontSize: "12px",
  },
  noUsers: {
    color: "#888",
    fontSize: "13px",
    textAlign: "center",
    padding: "20px",
  },
  userList: {
    overflowY: "auto",
    flex: 1,
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    cursor: "pointer",
    gap: "12px",
    borderBottom: "1px solid #2e3044",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#7c6af7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
    color: "white",
  },
  onlineDot: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    border: "2px solid #1a1d27",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  name: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "white",
  },
  lastMsg: {
    fontSize: "12px",
    color: "#888",
  },
};

export default Sidebar;