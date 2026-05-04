import useAuthStore from "../store/useAuthStore";

const LogoutModal = ({ onClose }) => {
  const { logout } = useAuthStore();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Logout</h2>
        <p style={styles.text}>Are you sure you want to logout?</p>
        <div style={styles.buttonRow}>
          <button onClick={logout} style={styles.logoutBtn}>
            Yes, Logout
          </button>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#1a1d27",
    borderRadius: "16px",
    padding: "32px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  title: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
  },
  text: {
    color: "#888",
    fontSize: "14px",
    textAlign: "center",
    margin: 0,
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  logoutBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff4d4d22",
    color: "#ff4d4d",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #2e3044",
    backgroundColor: "transparent",
    color: "#888",
    cursor: "pointer",
  },
};

export default LogoutModal;