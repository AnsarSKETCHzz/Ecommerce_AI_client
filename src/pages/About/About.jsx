import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>About FlipIT</h1>
          <p className={styles.sectionSub}>Premium tech. Delivered fast. Trusted by millions.</p>
        </div>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <h2>Our Mission</h2>
            <p>
              At FlipIT, we're passionate about bringing you the latest and greatest in technology.
              From cutting-edge smartphones to premium audio equipment, we curate the best products
              from the world's leading brands and deliver them right to your doorstep.
            </p>
          </div>

          <div className={styles.textBlock}>
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Curated selection of premium tech products</li>
              <li>Fast and reliable delivery</li>
              <li>Competitive pricing and exclusive deals</li>
              <li>Excellent customer support</li>
              <li>Trusted by millions of customers worldwide</li>
            </ul>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>50K+</strong>
              <span>Products</span>
            </div>
            <div className={styles.stat}>
              <strong>4.9★</strong>
              <span>Avg Rating</span>
            </div>
            <div className={styles.stat}>
              <strong>2M+</strong>
              <span>Customers</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}