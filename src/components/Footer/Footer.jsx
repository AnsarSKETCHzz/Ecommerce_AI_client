import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const footerLinks = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Support: ["Help Center", "Contact Us", "Returns", "Order Tracking"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoFlip}>Flip</span>
            <span className={styles.logoIT}>IT</span>
            <span className={styles.logoBy}>by Ansar</span>
          </div>
          <p className={styles.tagline}>
            Premium tech. Delivered fast. Trusted by millions.
          </p>
          <div className={styles.socials}>
            {["𝕏", "in", "f", "▶"].map((icon, i) => (
              <a key={i} href="#" className={styles.social}>{icon}</a>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading} className={styles.column}>
            <h4 className={styles.heading}>{heading}</h4>
            <ul className={styles.list}>
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className={styles.link}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={styles.newsletter}>
          <h4 className={styles.heading}>Stay in the loop</h4>
          <p className={styles.nlText}>Get exclusive deals and tech news.</p>
          <div className={styles.inputRow}>
            <input type="email" placeholder="you@email.com" className={styles.input} />
            <button className={styles.subBtn}>→</button>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} FlipIT by Ansar. All rights reserved.</p>
        <div className={styles.payments}>
          {["VISA", "MC", "UPI", "PayTM"].map((p) => (
            <span key={p} className={styles.payBadge}>{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}