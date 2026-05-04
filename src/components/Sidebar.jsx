import axios from "axios";
import useChatStore from "../store/useChatStore";
import useSocketStore from "../store/useSocketStore";
import useAuthStore from "../store/useAuthStore";
import { create } from "zustand";
import { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import LogoutModal from "./LogoutModal";

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
  const { selectedUser, setSelectedUser, unreadCounts } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { user } = useAuthStore();
  const { users, fetchUsers } = useUserStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.title}>💬 ChatSync</h2>
        <div style={styles.headerButtons}>
          <button onClick={() => setShowProfile(true)} style={styles.profileBtn}>
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              user?.fullName?.[0]?.toUpperCase()
            )}
          </button>
          <button onClick={() => setShowLogout(true)} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}

      <div style={styles.userList}>
        {users.length === 0 && (
          <p style={styles.noUsers}>No other users yet. Ask a friend to sign up!</p>
        )}
        {users.map((u) => {
         const unread = unreadCounts[u._id?.toString()] || 0;
          return (
            <div
              key={u._id}
              onClick={() => setSelectedUser({
                id: u._id,
                name: u.fullName,
                online: onlineUsers.includes(u._id),
                profilePic: u.profilePic || "",
              })}
              style={{
                ...styles.userItem,
                backgroundColor: selectedUser?.id === u._id ? "#2e3044" : "transparent",
              }}
            >
              <div style={styles.avatarWrapper}>
                <div style={styles.avatar}>
                  {u.profilePic ? (
                    <img
                      src={u.profilePic}
                      alt={u.fullName}
                      style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    u.fullName[0]
                  )}
                </div>
                {onlineUsers.includes(u._id) && <span style={styles.onlineDot} />}
              </div>

              <div style={styles.userInfo}>
                <div style={styles.nameRow}>
                  <span style={{ ...styles.name, color: unread > 0 ? "white" : "#ccc" }}>
                    {u.fullName}
                  </span>
                  {unread > 0 && (
                    <span style={styles.badge}>{unread > 99 ? "99+" : unread}</span>
                  )}
                </div>
                <p style={{
                  ...styles.lastMsg,
                  color: unread > 0 ? "#7c6af7" : "#888",
                  fontWeight: unread > 0 ? "bold" : "normal",
                }}>
                  {onlineUsers.includes(u._id) ? "🟢 Online" : "Offline"}
                </p>
              </div>
            </div>
          );
        })}
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
  headerButtons: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  profileBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#7c6af7",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    overflow: "hidden",
    padding: 0,
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
    overflow: "hidden",
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
    alignItems: "center",
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
    margin: 0,
  },
  badge: {
    backgroundColor: "#7c6af7",
    color: "white",
    borderRadius: "50%",
    minWidth: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "bold",
    padding: "0 4px",
  },
};

export default Sidebar;