import { View, Text, StyleSheet, ScrollView, Animated, useWindowDimensions, TouchableOpacity, RefreshControl, ActivityIndicator, TextInput, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";

const getStatEmoji = (iconName) => {
  switch (iconName) {
    case "cube": return "📦";
    case "cash": return "💰";
    case "people": return "👥";
    case "pricetags": return "🏷️";
    default: return "📊";
  }
};

import API from "../../src/services/api";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

// ═══════════════════════════════════════════════════════
//  ANIMATED BAR CHART
// ═══════════════════════════════════════════════════════
function BarChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Reset
    animatedValues.forEach(v => v.setValue(0));
    Animated.stagger(80,
      animatedValues.map(val =>
        Animated.spring(val, {
          toValue: 1,
          tension: 30,
          friction: 7,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [data]);

  const barColors = ["#4f46e5", colors.primary, "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"];

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartIcon}>📊</Text>
        <View>
          <Text style={styles.chartTitle}>Products by Category</Text>
          <Text style={styles.chartSubtitle}>Distribution across top categories</Text>
        </View>
      </View>
      <View style={styles.chartDivider} />
      <View style={styles.chartRow}>
        {data.map((item, index) => {
          if (!animatedValues[index]) return null;
          const heightPercent = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", `${(item.value / maxValue) * 100}%`],
          });
          const color = barColors[index % barColors.length];
          return (
            <View key={index} style={styles.barWrapper}>
              <Text style={[styles.barValueTop, { color }]}>{item.value}</Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[
                    styles.barFill,
                    { height: heightPercent, backgroundColor: color },
                  ]}
                />
              </View>
              <Text numberOfLines={1} style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════
//  STAT CARD COMPONENT
// ═══════════════════════════════════════════════════════
function StatCard({ iconName, label, value, color, bgColor, subtext, index }) {
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        { width: (width - 48) / 2 },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[styles.statIconBg, { backgroundColor: bgColor }]}>
        <Text style={[styles.statIcon, { color }]}>{getStatEmoji(iconName)}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtext ? <Text style={styles.statSubtext}>{subtext}</Text> : null}
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════════════════════════
export default function DashboardScreen() {
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for push broadcast
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      Alert.alert("Required Fields", "Please enter both Title and Body for the broadcast notification.");
      return;
    }
    setSendingBroadcast(true);
    try {
      const res = await API.post("/users/push-broadcast", {
        title: broadcastTitle.trim(),
        body: broadcastBody.trim(),
        screen: "Home",
      });
      Alert.alert("Success 🎉", res.data?.message || "Notification sent successfully!");
      setBroadcastTitle("");
      setBroadcastBody("");
    } catch (error) {
      console.log("Error sending broadcast:", error);
      Alert.alert(
        "Failed to Send",
        error.response?.data?.message || error.message || "Something went wrong."
      );
    } finally {
      setSendingBroadcast(false);
    }
  };

  const fetchData = async () => {
    try {
      const [productRes, orderRes, userRes] = await Promise.all([
        API.get("/products"),
        API.get("/orders"),
        API.get("/users"),
      ]);
      setProducts(productRes.data);
      setOrders(orderRes.data);
      setUsers(userRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  // ─── Computed Stats ────────────────────
  const totalRevenue = orders.reduce(
    (acc, item) => acc + (item.totalPrice || 0), 0
  );

  const deliveredOrders = orders.filter(
    (item) => item.status === "Delivered" || item.isDelivered
  ).length;

  const pendingOrders = orders.filter(
    (item) => item.status !== "Delivered" && !item.isDelivered
  ).length;

  const lowStockProducts = products.filter(
    (p) => p.stock !== undefined && p.stock <= 5
  );

  const outOfStockProducts = products.filter(
    (p) => p.stock !== undefined && p.stock === 0
  );

  const avgOrderValue = orders.length > 0
    ? Math.round(totalRevenue / orders.length)
    : 0;

  const deliveryRate = orders.length > 0
    ? Math.round((deliveredOrders / orders.length) * 100)
    : 0;

  const categoryStats = products.reduce((acc, p) => {
    const catName = p.category?.name || "Uncategorized";
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryStats)
    .map(key => ({
      label: key,
      value: categoryStats[key],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Format currency
  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  // Recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusStyle = (status, isDelivered) => {
    if (status === "Delivered" || isDelivered) return { bg: "#e8f8ef", text: "#1b9e4b" };
    if (status === "Cancelled") return { bg: "#ffeaea", text: "#e53935" };
    if (status === "Shipped") return { bg: "#e8f0fe", text: colors.primary };
    return { bg: "#fff8e1", text: "#f59e0b" };
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* ─── Header ──────────────────────────── */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.heading}>Admin Dashboard</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        {/* ─── Quick Stats (Top Row) ───────────── */}
        <View style={styles.statsGrid}>
          <StatCard
            iconName="cube"
            label="Total Orders"
            value={orders.length}
            color="#4f46e5"
            bgColor="#eef2ff"
            index={0}
          />
          <StatCard
            iconName="cash"
            label="Revenue"
            value={formatCurrency(totalRevenue)}
            color="#059669"
            bgColor="#ecfdf5"
            subtext={`Avg ₹${avgOrderValue}/order`}
            index={1}
          />
          <StatCard
            iconName="people"
            label="Customers"
            value={users.length}
            color={colors.primary}
            bgColor="#eef4ff"
            index={2}
          />
          <StatCard
            iconName="pricetags"
            label="Products"
            value={products.length}
            color="#7c3aed"
            bgColor="#f3f0ff"
            index={3}
          />
        </View>

        {/* ─── Order Status Cards ──────────────── */}
        <View style={styles.orderStatusRow}>
          <View style={[styles.orderStatusCard, { borderLeftColor: "#34c759" }]}>
            <Text style={styles.orderStatusIcon}>✅</Text>
            <View>
              <Text style={styles.orderStatusValue}>{deliveredOrders}</Text>
              <Text style={styles.orderStatusLabel}>Delivered</Text>
            </View>
            <View style={[styles.orderStatusBadge, { backgroundColor: "#e8f8ef" }]}>
              <Text style={[styles.orderStatusBadgeText, { color: "#1b9e4b" }]}>
                {deliveryRate}%
              </Text>
            </View>
          </View>

          <View style={[styles.orderStatusCard, { borderLeftColor: "#f59e0b" }]}>
            <Text style={styles.orderStatusIcon}>⏳</Text>
            <View>
              <Text style={styles.orderStatusValue}>{pendingOrders}</Text>
              <Text style={styles.orderStatusLabel}>Pending</Text>
            </View>
            <View style={[styles.orderStatusBadge, { backgroundColor: "#fff8e1" }]}>
              <Text style={[styles.orderStatusBadgeText, { color: "#f59e0b" }]}>
                {orders.length > 0 ? 100 - deliveryRate : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Bar Chart ───────────────────────── */}
        {chartData.length > 0 && <BarChart data={chartData} />}

        {/* ─── Stock Alerts ─────────────────────── */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <View style={styles.alertsCard}>
            <View style={styles.alertsHeader}>
              <Text style={styles.alertsIcon}>⚠️</Text>
              <View>
                <Text style={styles.alertsTitle}>Stock Alerts</Text>
                <Text style={styles.alertsSubtitle}>
                  {outOfStockProducts.length} out of stock • {lowStockProducts.length} low stock
                </Text>
              </View>
            </View>
            <View style={styles.chartDivider} />

            {lowStockProducts.slice(0, 5).map((item) => (
              <View key={item._id} style={styles.alertRow}>
                <View style={styles.alertDot}>
                  <View
                    style={[
                      styles.alertDotInner,
                      {
                        backgroundColor:
                          item.stock === 0 ? "#ef4444" : "#f59e0b",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.alertProductName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View
                  style={[
                    styles.stockBadge,
                    {
                      backgroundColor:
                        item.stock === 0 ? "#ffeaea" : "#fff8e1",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stockBadgeText,
                      {
                        color:
                          item.stock === 0 ? "#ef4444" : "#f59e0b",
                      },
                    ]}
                  >
                    {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── Recent Orders ───────────────────── */}
        {recentOrders.length > 0 && (
          <View style={styles.recentCard}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentIcon}>🕒</Text>
              <View>
                <Text style={styles.recentTitle}>Recent Orders</Text>
                <Text style={styles.recentSubtitle}>Latest {recentOrders.length} orders</Text>
              </View>
            </View>
            <View style={styles.chartDivider} />

            {recentOrders.map((order, index) => {
              const statusStyle = getStatusStyle(order.status, order.isDelivered);
              const displayStatus = order.isDelivered ? "Delivered" : (order.status || "Processing");
              return (
                <View key={order._id || index} style={styles.recentRow}>
                  <View style={styles.recentOrderLeft}>
                    <Text style={styles.recentOrderId}>
                      #{(order._id || "").slice(-6).toUpperCase()}
                    </Text>
                    <Text style={styles.recentOrderDate}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "—"}
                    </Text>
                  </View>
                  <Text style={styles.recentOrderAmount}>
                    ₹{order.totalPrice || 0}
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: statusStyle.text },
                      ]}
                    >
                      {displayStatus}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ─── Quick Insights ──────────────────── */}
        <View style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Text style={styles.insightsIcon}>💡</Text>
            <Text style={styles.insightsTitle}>Quick Insights</Text>
          </View>
          <View style={styles.chartDivider} />

          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Average Order Value</Text>
            <Text style={styles.insightValue}>₹{avgOrderValue}</Text>
          </View>
          <View style={styles.insightDividerThin} />
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Delivery Success Rate</Text>
            <Text style={[styles.insightValue, { color: "#34c759" }]}>
              {deliveryRate}%
            </Text>
          </View>
          <View style={styles.insightDividerThin} />
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Total Categories</Text>
            <Text style={styles.insightValue}>
              {Object.keys(categoryStats).length}
            </Text>
          </View>
          <View style={styles.insightDividerThin} />
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>In-Stock Products</Text>
            <Text style={styles.insightValue}>
              {products.filter(p => p.stock > 0).length}/{products.length}
            </Text>
          </View>
        </View>

        {/* ─── Push Broadcast Tool ──────────────── */}
        <View style={styles.broadcastCard}>
          <View style={styles.broadcastHeader}>
            <Text style={styles.broadcastIcon}>📢</Text>
            <View>
              <Text style={styles.broadcastTitle}>Send Push Broadcast</Text>
              <Text style={styles.broadcastSubtitle}>Notify all registered users instantly</Text>
            </View>
          </View>
          <View style={styles.chartDivider} />

          <Text style={styles.inputLabel}>Notification Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. ⚡ Mega Weekend Sale starts now!"
            placeholderTextColor="#8e8e93"
            value={broadcastTitle}
            onChangeText={setBroadcastTitle}
          />

          <Text style={styles.inputLabel}>Notification Body</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="e.g. Get up to 50% off on all clothing, shoes & accessories. Tap to shop!"
            placeholderTextColor="#8e8e93"
            value={broadcastBody}
            onChangeText={setBroadcastBody}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[
              styles.broadcastBtn,
              (sendingBroadcast || !broadcastTitle.trim() || !broadcastBody.trim()) && styles.broadcastBtnDisabled,
            ]}
            onPress={handleSendBroadcast}
            disabled={sendingBroadcast}
          >
            {sendingBroadcast ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.broadcastBtnText}>Send Notification 🚀</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════
const cardBase = {
  backgroundColor: colors.card,
  borderRadius: 18,
  padding: 18,
  marginHorizontal: 16,
  marginTop: 16,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ─── Header ─────────────────────────
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 14,
    color: colors.textLight,
    ...typography.body,
  },
  heading: {
    ...typography.h1,
    color: colors.text,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f8ef",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34c759",
    marginRight: 6,
  },
  liveText: {
    ...typography.h3,
    color: "#1b9e4b",
  },

  // ─── Stats Grid ─────────────────────
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  statCard: {
    /* width dynamically set */
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    margin: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 22,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textLight,
    ...typography.subtitle,
  },
  statValue: {
    ...typography.h1,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  statSubtext: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    ...typography.body,
  },

  // ─── Order Status Row ───────────────
  orderStatusRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  orderStatusCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  orderStatusIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  orderStatusValue: {
    ...typography.h1,
    color: colors.text,
  },
  orderStatusLabel: {
    fontSize: 12,
    color: colors.textLight,
    ...typography.subtitle,
  },
  orderStatusBadge: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  orderStatusBadgeText: {
    ...typography.h3,
  },

  // ─── Bar Chart ──────────────────────
  chartCard: {
    ...cardBase,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  chartTitle: {
    ...typography.h3,
    color: colors.text,
  },
  chartSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  chartDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 14,
  },
  chartRow: {
    flexDirection: "row",
    height: 160,
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingBottom: 4,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  barValueTop: {
    ...typography.h1,
    marginBottom: 6,
  },
  barTrack: {
    height: "70%",
    width: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 10,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 10,
    color: "#666",
    width: 52,
    textAlign: "center",
    ...typography.body,
  },

  // ─── Stock Alerts ───────────────────
  alertsCard: {
    ...cardBase,
  },
  alertsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertsIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  alertsTitle: {
    ...typography.h3,
    color: colors.text,
  },
  alertsSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  alertDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fef3f3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  alertDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  alertProductName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    ...typography.body,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeText: {
    ...typography.h3,
  },

  // ─── Recent Orders ──────────────────
  recentCard: {
    ...cardBase,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  recentTitle: {
    ...typography.h3,
    color: colors.text,
  },
  recentSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  recentOrderLeft: {
    flex: 1,
  },
  recentOrderId: {
    ...typography.h3,
    color: colors.text,
    letterSpacing: 0.3,
  },
  recentOrderDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  recentOrderAmount: {
    ...typography.h3,
    color: colors.text,
    marginRight: 12,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusPillText: {
    ...typography.h3,
  },

  // ─── Quick Insights ─────────────────
  insightsCard: {
    ...cardBase,
    marginBottom: 10,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightsIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  insightsTitle: {
    ...typography.h3,
    color: colors.text,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  insightLabel: {
    fontSize: 14,
    color: "#666",
    ...typography.body,
  },
  insightValue: {
    ...typography.h1,
    color: colors.text,
  },
  insightDividerThin: {
    height: 1,
    backgroundColor: "#f5f5f5",
  },
  broadcastCard: {
    ...cardBase,
  },
  broadcastHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  broadcastIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  broadcastTitle: {
    ...typography.h3,
    color: colors.text,
  },
  broadcastSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  inputLabel: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginBottom: 12,
    ...typography.body,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  broadcastBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  broadcastBtnDisabled: {
    backgroundColor: "#7aabf7",
    elevation: 0,
    shadowOpacity: 0,
  },
  broadcastBtnText: {
    color: "white",
    ...typography.h3,
    fontSize: 15,
  },
});