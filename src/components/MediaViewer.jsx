const MediaViewer = ({ url, onClose }) => {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <img src={url} alt="media" style={styles.image} />
        <a href={url} download style={styles.downloadBtn}>
          ⬇️ Download
        </a>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    maxWidth: "90vw",
    maxHeight: "90vh",
  },
  closeBtn: {
    position: "absolute",
    top: "-40px",
    right: "0px",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
  },
  image: {
    maxWidth: "90vw",
    maxHeight: "80vh",
    borderRadius: "12px",
    objectFit: "contain",
  },
  downloadBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#7c6af7",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default MediaViewer;