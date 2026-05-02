import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>💬 ChatSync</h1>
        <p style={styles.subtitle}>Welcome back</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f1117",
  },
  card: {
    backgroundColor: "#1a1d27",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  logo: {
    fontSize: "28px",
    textAlign: "center",
    marginBottom: "8px",
    color: "#7c6af7",
  },
  subtitle: {
    textAlign: "center",
    color: "#888",
    marginBottom: "28px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #2e3044",
    backgroundColor: "#0f1117",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#7c6af7",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "4px",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    color: "#888",
    fontSize: "14px",
  },
  link: {
    color: "#7c6af7",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default LoginPage;