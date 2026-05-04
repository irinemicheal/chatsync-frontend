import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const SignupPage = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (formData.fullName.trim().length < 2) return "Full name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Enter a valid email address";
    if (formData.password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(formData.password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(formData.password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(formData.password)) return "Password must contain at least one special character (!@#$%^&*)";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      await signup(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>💬 ChatSync</h1>
        <p style={styles.subtitle}>Create your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
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

          {/* Password strength indicator */}
          {formData.password && (
            <div style={{ fontSize: "12px", marginTop: "-8px" }}>
              {formData.password.length < 8 && (
                <p style={styles.invalid}>✗ At least 8 characters</p>
              )}
              {!/[A-Z]/.test(formData.password) && (
                <p style={styles.invalid}>✗ At least one uppercase letter</p>
              )}
              {!/[0-9]/.test(formData.password) && (
                <p style={styles.invalid}>✗ At least one number</p>
              )}
              {!/[!@#$%^&*]/.test(formData.password) && (
                <p style={styles.invalid}>✗ At least one special character (!@#$%^&*)</p>
              )}
              {formData.password.length >= 8 &&
                /[A-Z]/.test(formData.password) &&
                /[0-9]/.test(formData.password) &&
                /[!@#$%^&*]/.test(formData.password) && (
                  <p style={styles.valid}>✓ Strong password!</p>
                )}
            </div>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
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
  error: {
    backgroundColor: "#ff4d4d22",
    color: "#ff4d4d",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "13px",
    textAlign: "center",
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
  invalid: {
    color: "#ff4d4d",
    margin: "2px 0",
  },
  valid: {
    color: "#22c55e",
    margin: "2px 0",
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

export default SignupPage;
