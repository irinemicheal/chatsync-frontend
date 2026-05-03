import useChatStore from "../store/useChatStore";

const Sidebar = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  const users = [
    { id: 1, name: "Alice", lastMsg: "Hey there!", time: "2m ago", online: true },
    { id: 2, name: "Bob", lastMsg: "See you later", time: "10m ago", online: false },
    { id: 3, name: "Carol", lastMsg: "Sounds good!", time: "1h ago", online: true },
    { id: 4, name: "David", lastMsg: "Ok cool", time: "3h ago", online: false },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.title}>💬 ChatSync</h2>
      </div>

      <div style={styles.userList}>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            style={{
              ...styles.userItem,
              backgroundColor:
                selectedUser?.id === user.id ? "#2e3044" : "transparent",
            }}
          >
            <div style={styles.avatarWrapper}>
              <div style={styles.avatar}>{user.name[0]}</div>
              {user.online && <span style={styles.onlineDot} />}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.nameRow}>
                <span style={styles.name}>{user.name}</span>
                <span style={styles.time}>{user.time}</span>
              </div>
              <p style={styles.lastMsg}>{user.lastMsg}</p>
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
  },
  title: {
    color: "#7c6af7",
    fontSize: "20px",
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
  time: {
    fontSize: "11px",
    color: "#888",
  },
  lastMsg: {
    fontSize: "12px",
    color: "#888",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

export default Sidebar;