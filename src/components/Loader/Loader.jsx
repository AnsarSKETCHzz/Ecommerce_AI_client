import { motion } from "framer-motion";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.ring}>
        <div></div><div></div><div></div>
      </div>
      <p className={styles.text}>Loading<span className={styles.dots}>...</span></p>
    </motion.div>
  );
}