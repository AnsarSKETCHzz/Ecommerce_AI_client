import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Signup.module.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
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
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.sub}>Start shopping smarter today</p>
        </div>

        {done ? (
          <motion.div
            className={styles.success}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className={styles.successIcon}>✓</span>
            <p className={styles.successTitle}>Account created successfully!</p>
            <Link to="/login" className={styles.backHome}>Sign in now →</Link>
          </motion.div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Full Name */}
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={styles.input}
                  required
                />
              </div>

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
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrap}>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={`${styles.input} ${
                      error && error.includes("8") ? styles.inputError : ""
                    }`}
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

              {/* Confirm Password */}
              <div className={styles.field}>
                <label className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrap}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`${styles.input} ${
                      error && error.includes("match") ? styles.inputError : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Error */}
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
                {loading ? <span className={styles.spinner} /> : "Create Account"}
              </motion.button>
            </form>

            <p className={styles.switch}>
              Already have an account?{" "}
              <Link to="/login" className={styles.switchLink}>Sign in →</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}