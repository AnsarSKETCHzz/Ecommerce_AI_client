import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import styles from "./Cart.module.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <motion.div
      className={styles.item}
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.itemImg}>
        <img src={item.image} alt={item.name} />
      </div>

      <div className={styles.itemInfo}>
        <span className={styles.itemCategory}>{item.category}</span>
        <p className={styles.itemName}>{item.name}</p>
        <span className={styles.itemPrice}>{formatPrice(item.price)}</span>

        <div className={styles.itemControls}>
          <div className={styles.qtyRow}>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQuantity(item.id, -1)}
              aria-label="Decrease"
            >
              −
            </button>
            <span className={styles.qty}>{item.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQuantity(item.id, 1)}
              aria-label="Increase"
            >
              +
            </button>
          </div>
          <button
            className={styles.removeBtn}
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Remove
          </button>
        </div>
      </div>

      <div className={styles.itemTotal}>
        {formatPrice(item.price * item.quantity)}
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const { items, isOpen, setIsOpen, totalItems, totalPrice, clearCart } = useCart();
  const drawerRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // Handle checkout
  const handleCheckout = () => {
    setAlertMessage("Processing your order...");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, setIsOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setIsOpen]);

  const discount = Math.round(totalPrice * 0.05);
  const delivery = totalPrice > 999 ? 0 : 99;
  const finalPrice = totalPrice - discount + delivery;

  return (
    <AnimatePresence>
      {alertMessage && (
        <motion.div
          className={styles.alert}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>✓</span>
            <span className={styles.alertText}>{alertMessage}</span>
          </div>
        </motion.div>
      )}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitle}>
                <h2>Your Cart</h2>
                {totalItems > 0 && (
                  <span className={styles.itemCount}>{totalItems} items</span>
                )}
              </div>
              <div className={styles.headerActions}>
                {items.length > 0 && (
                  <button className={styles.clearBtn} onClick={clearCart}>
                    Clear all
                  </button>
                )}
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close cart"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Items */}
            <div className={styles.itemsList}>
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    className={styles.empty}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.emptyIcon}>🛒</div>
                    <p className={styles.emptyTitle}>Your cart is empty</p>
                    <p className={styles.emptySub}>Add some products to get started</p>
                    <button
                      className={styles.shopBtn}
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => <CartItem key={item.id} item={item} />)
                )}
              </AnimatePresence>
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <motion.div
                className={styles.summary}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className={styles.summaryRows}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Discount (5%)</span>
                    <span className={styles.discountText}>− {formatPrice(discount)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Delivery</span>
                    <span className={delivery === 0 ? styles.freeText : ""}>
                      {delivery === 0 ? "FREE" : formatPrice(delivery)}
                    </span>
                  </div>
                  {delivery > 0 && (
                    <p className={styles.freeHint}>
                      Add {formatPrice(999 - totalPrice + 1)} more for free delivery
                    </p>
                  )}
                </div>

                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>{formatPrice(finalPrice)}</span>
                </div>

                <motion.button
                  className={styles.checkoutBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout →
                </motion.button>

                <button
                  className={styles.continueBtn}
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}