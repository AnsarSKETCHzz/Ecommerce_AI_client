import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";
import styles from "./Orders.module.css";

// Mock orders data - replace with API call when backend is ready
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-03-15",
    status: "delivered",
    total: 1299.99,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 299.99 },
      { name: "Smart Watch", quantity: 1, price: 1000.00 }
    ],
    shipping: { name: "John Doe", address: "123 Main St, City, Country" }
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-10",
    status: "shipped",
    total: 599.99,
    items: [
      { name: "Gaming Mouse", quantity: 1, price: 149.99 },
      { name: "Mechanical Keyboard", quantity: 1, price: 450.00 }
    ],
    shipping: { name: "John Doe", address: "123 Main St, City, Country" }
  },
  {
    id: "ORD-2024-003",
    date: "2024-03-05",
    status: "processing",
    total: 2499.99,
    items: [
      { name: "Laptop Stand", quantity: 1, price: 99.99 },
      { name: "USB-C Hub", quantity: 1, price: 79.99 },
      { name: "4K Monitor", quantity: 1, price: 2320.00 }
    ],
    shipping: { name: "John Doe", address: "123 Main St, City, Country" }
  }
];

const statusConfig = {
  pending: { label: "Pending", color: "#ffc107", icon: "⏳" },
  processing: { label: "Processing", color: "#6c63ff", icon: "⚙️" },
  shipped: { label: "Shipped", color: "#00bcd4", icon: "🚚" },
  delivered: { label: "Delivered", color: "#43e97b", icon: "✅" },
  cancelled: { label: "Cancelled", color: "#ff6b6b", icon: "❌" }
};

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Simulate API call - replace with actual fetch when backend is ready
    const fetchOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!user) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>Track and manage your orders</p>
        </div>

        <div className={styles.content}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <h3 className={styles.userName}>{user.name}</h3>
              <p className={styles.userEmail}>{user.email}</p>
            </div>

            <nav className={styles.nav}>
              <Link to="/profile" className={styles.navLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </Link>
              <Link to="/orders" className={`${styles.navLink} ${styles.active}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
                My Orders
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className={styles.main}>
            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
              {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  className={`${styles.filterTab} ${filter === status ? styles.active : ""}`}
                  onClick={() => setFilter(status)}
                >
                  {status === "all" ? "All Orders" : statusConfig[status]?.label}
                  {status === "all" && (
                    <span className={styles.badge}>{orders.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {loading ? (
              <div className={styles.loading}>
                <Loader />
                <p>Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>📦</div>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className={styles.shopBtn}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                <AnimatePresence>
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      className={styles.orderCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      {/* Order Header */}
                      <div 
                        className={styles.orderHeader}
                        onClick={() => toggleOrder(order.id)}
                      >
                        <div className={styles.orderInfo}>
                          <span className={styles.orderId}>{order.id}</span>
                          <span className={styles.orderDate}>
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                        <div className={styles.orderMeta}>
                          <span 
                            className={styles.status}
                            style={{ 
                              backgroundColor: `${statusConfig[order.status]?.color}20`,
                              color: statusConfig[order.status]?.color
                            }}
                          >
                            {statusConfig[order.status]?.icon} {statusConfig[order.status]?.label}
                          </span>
                          <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                          <svg 
                            className={`${styles.chevron} ${expandedOrder === order.id ? styles.expanded : ""}`}
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>

                      {/* Order Details */}
                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            className={styles.orderDetails}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className={styles.detailsContent}>
                              {/* Items */}
                              <div className={styles.section}>
                                <h4>Items</h4>
                                <div className={styles.itemsList}>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className={styles.item}>
                                      <span className={styles.itemName}>{item.name}</span>
                                      <span className={styles.itemQty}>x{item.quantity}</span>
                                      <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping */}
                              <div className={styles.section}>
                                <h4>Shipping Address</h4>
                                <p className={styles.address}>
                                  {order.shipping.name}<br />
                                  {order.shipping.address}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className={styles.actions}>
                                <button className={styles.trackBtn}>
                                  Track Order
                                </button>
                                <button className={styles.reorderBtn}>
                                  Reorder
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
