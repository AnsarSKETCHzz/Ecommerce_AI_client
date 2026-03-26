import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard/ProductCard";
import { products, categories } from "../../data/products";
import styles from "./Home.module.css";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filtered, setFiltered] = useState(products);
  const navigate = useNavigate();

  useEffect(() => {
    setFiltered(
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory)
    );
  }, [activeCategory]);

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGlowRight} />
        <div className={styles.heroGrid} />

        <div className={styles.heroInner}>
          {/* Left: Text */}
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              className={styles.heroPill}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🎉 Free delivery on orders above ₹999
            </motion.span>

            <h1 className={styles.heroTitle}>
              Shop the
              <span className={styles.heroGradient}> Future</span>
              <br />of Tech
            </h1>

            <p className={styles.heroSub}>
              Discover curated premium tech from the world's leading brands,
              delivered to your door at unbeatable prices.
            </p>

            <div className={styles.heroCta}>
              <motion.button
                className={styles.ctaPrimary}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/products')}
              >
                Explore Collection
              </motion.button>
              <motion.button
                className={styles.ctaSecondary}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/deals')}
              >
                Today's Deals →
              </motion.button>
            </div>

            <div className={styles.heroStats}>
              {[["50K+", "Products"], ["4.9★", "Avg Rating"], ["2M+", "Customers"]].map(([num, label]) => (
                <div key={label} className={styles.stat}>
                  <strong>{num}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Floating cards */}
          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.floatCard1}>
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" alt="Headphones" />
            </div>
            <div className={styles.floatCard2}>
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" alt="Laptop" />
            </div>
            <div className={styles.floatCard3}>
              <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80" alt="Phone" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <p className={styles.sectionSub}>Top picks across all categories</p>
        </div>

        <div className={styles.filters}>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
              onClick={() => setActiveCategory(cat)}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className={styles.empty}>No products in this category yet.</div>
        )}
      </section>

      {/* ── Banner ── */}
      <div className={styles.bannerWrapper}>
        <div className={styles.bannerInner}>
          <h2>Up to <span>50% OFF</span> on Premium Audio</h2>
          <p>Limited time offer. Don't miss out on the best deals.</p>
          <motion.button
            className={styles.bannerBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/deals')}
          >
            Shop Now →
          </motion.button>
        </div>
      </div>

    </div>
  );
}