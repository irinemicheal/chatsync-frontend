import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";

const ProfileModal = ({ onClose }) => {
  const { user, updateProfile, deleteAccount } = useAuthStore();
  const { updateSelectedUserPic } = useChatStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    profilePic: user?.profilePic || "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
  setLoading(true);
  try {
    const updated = await updateProfile(formData);
    updateSelectedUserPic(updated.profilePic);
    setEditing(false);
    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <h2 style={styles.title}>My Profile</h2>

        {successMsg && <p style={styles.success}>{successMsg}</p>}

        {/* Avatar */}
        <div style={styles.avatarWrapper}>
          {formData.profilePic ? (
            <img src={formData.profilePic} alt="profile" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarLarge}>
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
          )}
          {editing && (
            <label style={styles.uploadLabel}>
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        {!editing ? (
          <>
            <h3 style={styles.name}>{user?.fullName}</h3>
            <p style={styles.email}>{user?.email}</p>
            {user?.bio && <p style={styles.bio}>"{user.bio}"</p>}

            <div style={styles.infoBox}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Full Name</span>
                <span style={styles.value}>{user?.fullName}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Email</span>
                <span style={styles.value}>{user?.email}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Status</span>
                <span style={{ ...styles.value, color: "#22c55e" }}>● Online</span>
              </div>
            </div>

            <div style={styles.buttonRow}>
              <button onClick={() => setEditing(true)} style={styles.editBtn}>
                ✏️ Edit Profile
              </button>
              <button onClick={() => setConfirmDelete(true)} style={styles.deleteBtn}>
                🗑️ Delete Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.editSection}>
              <label style={styles.inputLabel}>Full Name</label>
              <input
                style={styles.input}
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <label style={styles.inputLabel}>Bio</label>
              <input
                style={styles.input}
                placeholder="Write something about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <div style={styles.buttonRow}>
              <button onClick={handleSave} style={styles.editBtn} disabled={loading}>
                {loading ? "Saving..." : "✅ Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    fullName: user?.fullName || "",
                    bio: user?.bio || "",
                    profilePic: user?.profilePic || "",
                  });
                }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {confirmDelete && (
          <div style={styles.confirmBox}>
            <p style={styles.confirmText}>
              ⚠️ This will permanently delete your account and all your messages. This cannot be undone!
            </p>
            <div style={styles.buttonRow}>
              <button onClick={handleDelete} style={styles.deleteBtn} disabled={loading}>
                {loading ? "Deleting..." : "Yes, Delete Forever"}
              </button>
              <button onClick={() => setConfirmDelete(false)} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        )}
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
    width: "380px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    gap: "12px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  closeBtn: {
    position: "absolute",
    top: "16px", right: "16px",
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "18px",
    cursor: "pointer",
  },
  title: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
  },
  success: {
    backgroundColor: "#22c55e22",
    color: "#22c55e",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    width: "100%",
    textAlign: "center",
    margin: 0,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: "4px",
  },
  avatarLarge: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#7c6af7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "bold",
    color: "white",
  },
  avatarImg: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  uploadLabel: {
    position: "absolute",
    bottom: "0px", right: "0px",
    backgroundColor: "#7c6af7",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "12px",
  },
  name: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
    margin: 0,
  },
  email: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
  },
  bio: {
    fontSize: "13px",
    color: "#aaa",
    textAlign: "center",
    margin: 0,
    fontStyle: "italic",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#0f1117",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  label: {
    fontSize: "13px",
    color: "#888",
  },
  value: {
    fontSize: "13px",
    color: "white",
    fontWeight: "bold",
  },
  editSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  inputLabel: {
    fontSize: "12px",
    color: "#888",
    marginBottom: "2px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #2e3044",
    backgroundColor: "#0f1117",
    color: "white",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  editBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#7c6af7",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteBtn: {
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
  confirmBox: {
    width: "100%",
    backgroundColor: "#ff4d4d11",
    border: "1px solid #ff4d4d44",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  confirmText: {
    color: "#ff4d4d",
    fontSize: "13px",
    textAlign: "center",
    margin: 0,
  },
};

export default ProfileModal;