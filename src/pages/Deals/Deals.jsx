import styles from "./Deals.module.css";

export default function Deals() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>Today's Deals</h1>
          <p className={styles.sectionSub}>Limited time offers on premium tech</p>
        </div>

        <div className={styles.bannerWrapper}>
          <div className={styles.bannerInner}>
            <h2>Up to <span>50% OFF</span> on Premium Audio</h2>
            <p>Limited time offer. Don't miss out on the best deals.</p>
            <button className={styles.bannerBtn}>Shop Now →</button>
          </div>
        </div>

        <div className={styles.comingSoon}>
          <h3>More deals coming soon!</h3>
          <p>Stay tuned for exclusive offers and discounts.</p>
        </div>
      </section>
    </div>
  );
}