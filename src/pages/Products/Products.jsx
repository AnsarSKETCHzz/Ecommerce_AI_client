import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { products, categories } from "../../data/products";
import styles from "./Products.module.css";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filtered, setFiltered] = useState(products);

  useEffect(() => {
    setFiltered(
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory)
    );
  }, [activeCategory]);

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>All Products</h1>
          <p className={styles.sectionSub}>Browse our complete collection</p>
        </div>

        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>No products in this category yet.</div>
        )}
      </section>
    </div>
  );
}