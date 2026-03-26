import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import styles from "./ProductCard.module.css";

function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
      <span className={styles.ratingText}>{rating}</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addToCart } = useCart();

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />
        {product.badge && (
          <span className={styles.badge} style={{ background: product.badgeColor }}>{product.badge}</span>
        )}
        {discount > 0 && <span className={styles.discount}>-{discount}%</span>}
        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ""}`}
          onClick={() => setWishlisted(!wishlisted)}
          aria-label="Wishlist"
        >
          {wishlisted ? "♥" : "♡"}
        </button>
        <div className={styles.overlay}>
          <button 
            className={styles.quickView}
            onClick={() => setQuickViewOpen(true)}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <StarRating rating={product.rating} />
        <span className={styles.reviewCount}>({product.reviews.toLocaleString()} reviews)</span>
        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
        </div>
        <motion.button
          className={`${styles.cartBtn} ${added ? styles.added : ""}`}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
        >
          {added ? <><span>✓</span> Added!</> : <><span>🛒</span> Add to Cart</>}
        </motion.button>
      </div>

      {quickViewOpen && createPortal(
        <div className={styles.modal} onClick={() => setQuickViewOpen(false)}>
          <motion.div 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              className={styles.closeBtn}
              onClick={() => setQuickViewOpen(false)}
            >
              ✕
            </button>
            <div className={styles.quickViewGrid}>
              <div className={styles.quickViewImage}>
                <img src={product.image} alt={product.name} />
              </div>
              <div className={styles.quickViewDetails}>
                <span className={styles.quickViewCategory}>{product.category}</span>
                <h2 className={styles.quickViewName}>{product.name}</h2>
                <StarRating rating={product.rating} />
                <span className={styles.quickViewReviews}>({product.reviews.toLocaleString()} reviews)</span>
                <p className={styles.quickViewDesc}>{product.description || "Premium quality product with exceptional design and durability."}</p>
                <div className={styles.quickViewPricing}>
                  <span className={styles.quickViewPrice}>{formatPrice(product.price)}</span>
                  <span className={styles.quickViewOriginal}>{formatPrice(product.originalPrice)}</span>
                  {discount > 0 && <span className={styles.quickViewDiscount}>Save {discount}%</span>}
                </div>
                <motion.button
                  className={styles.quickViewCartBtn}
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>🛒</span> Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}