import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await login(form.email, form.password);
    
    if (result.success) {
      setDone(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.gridBg} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoFlip}>Flip</span>
            <span className={styles.logoIT}>IT</span>
          </Link>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to your account to continue</p>
        </div>

        {done ? (
          <motion.div
            className={styles.success}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className={styles.successIcon}>✓</span>
            <p className={styles.successTitle}>Welcome back!</p>
            <p className={styles.successSub}>Redirecting to home...</p>
          </motion.div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Email */}
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={styles.input}
                  required
                />
              </div>

              {/* Password */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Password</label>
                  <a href="#" className={styles.forgot}>Forgot password?</a>
                </div>
                <div className={styles.inputWrap}>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={styles.input}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  className={styles.errorMsg}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ⚠ {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <span className={styles.spinner} /> : "Sign In"}
              </motion.button>
            </form>

            <div className={styles.divider}><span>or continue with</span></div>

            <div className={styles.socialLogins}>
              {["Google", "Apple", "GitHub"].map((p) => (
                <button key={p} className={styles.socialBtn}>{p}</button>
              ))}
            </div>

            <p className={styles.switch}>
              Don't have an account?{" "}
              <Link to="/signup" className={styles.switchLink}>Create one →</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}