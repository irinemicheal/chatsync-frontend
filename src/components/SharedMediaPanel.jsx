import { useEffect, useState } from "react";
import useChatStore from "../store/useChatStore";
import MediaViewer from "./MediaViewer";

const SharedMediaPanel = ({ onClose }) => {
  const { selectedUser, sharedMedia, fetchSharedMedia } = useChatStore();
  const [viewing, setViewing] = useState(null);
  const [tab, setTab] = useState("images");

  useEffect(() => {
    if (selectedUser) fetchSharedMedia(selectedUser.id);
  }, [selectedUser]);

  const images = sharedMedia.filter((m) => m.fileType?.startsWith("image"));
  const docs = sharedMedia.filter((m) => !m.fileType?.startsWith("image") && m.fileUrl);

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h3 style={styles.title}>Shared Media</h3>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === "images" ? styles.activeTab : {}) }}
          onClick={() => setTab("images")}
        >
          🖼️ Images ({images.length})
        </button>
        <button
          style={{ ...styles.tab, ...(tab === "docs" ? styles.activeTab : {}) }}
          onClick={() => setTab("docs")}
        >
          📄 Docs ({docs.length})
        </button>
      </div>

      <div style={styles.content}>
        {tab === "images" && (
          images.length === 0 ? (
            <p style={styles.empty}>No images shared yet</p>
          ) : (
            <div style={styles.imageGrid}>
              {images.map((m) => (
                <img
                  key={m._id}
                  src={m.fileUrl}
                  alt="shared"
                  style={styles.thumbnail}
                  onClick={() => setViewing(m.fileUrl)}
                />
              ))}
            </div>
          )
        )}

        {tab === "docs" && (
          docs.length === 0 ? (
            <p style={styles.empty}>No documents shared yet</p>
          ) : (
            <div style={styles.docList}>
              {docs.map((m) => (
                <a
                  key={m._id}
                  href={m.fileUrl}
                  download={m.fileName}
                  style={styles.docItem}
                >
                  <span style={styles.docIcon}>📄</span>
                  <div>
                    <p style={styles.docName}>{m.fileName || "Document"}</p>
                    <p style={styles.docDate}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={styles.downloadIcon}>⬇️</span>
                </a>
              ))}
            </div>
          )
        )}
      </div>

      {viewing && <MediaViewer url={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
};

const styles = {
  panel: {
    width: "280px",
    backgroundColor: "#1a1d27",
    borderLeft: "1px solid #2e3044",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid #2e3044",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "16px",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #2e3044",
  },
  tab: {
    flex: 1,
    padding: "12px",
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
    fontSize: "13px",
  },
  activeTab: {
    color: "#7c6af7",
    borderBottom: "2px solid #7c6af7",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
  },
  empty: {
    color: "#888",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "40px",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "4px",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "6px",
    cursor: "pointer",
  },
  docList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  docItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    backgroundColor: "#0f1117",
    borderRadius: "8px",
    textDecoration: "none",
  },
  docIcon: {
    fontSize: "24px",
  },
  docName: {
    color: "white",
    fontSize: "13px",
    fontWeight: "bold",
    margin: 0,
    maxWidth: "140px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  docDate: {
    color: "#888",
    fontSize: "11px",
    margin: 0,
  },
  downloadIcon: {
    marginLeft: "auto",
    fontSize: "16px",
  },
};

export default SharedMediaPanel;