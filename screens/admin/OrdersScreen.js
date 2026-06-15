import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import API from "../../src/services/api";
import { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const response = await API.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(true);
  };

  const updateStatus = async (id, status) => {
    Alert.alert("Confirm Status Update", `Are you sure you want to mark this order as ${status}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          try {
            await API.put(`/orders/${id}/status`, { status });
            Alert.alert("Success", `Order marked as ${status}`);
            fetchOrders();
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return colors.warning || "#ff9800";
      case "Shipped":
        return colors.info || "#2196f3";
      case "Out For Delivery":
        return colors.primary || "#9c27b0";
      case "Delivered":
        return colors.success || "#4caf50";
      default:
        return colors.textLight || "#777";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!order || !order._id) return false;
    const orderId = order._id.toLowerCase();
    const userName = order.user?.name ? order.user.name.toLowerCase() : "";
    const matchesSearch = orderId.includes(search.toLowerCase()) || userName.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No orders found.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <Text style={styles.heading}>All Orders</Text>

      {/* SEARCH BAR */}
      <TextInput
        placeholder="🔍 Search by Order ID or User name..."
        placeholderTextColor={colors.textLight}
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
      />

      {/* STATUS TABS */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {["All", "Processing", "Shipped", "Out For Delivery", "Delivered"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.tab,
                statusFilter === status && styles.activeTab,
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text
                style={[
                  styles.tabText,
                  statusFilter === status && styles.activeTabText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            filteredOrders.length === 0 ? styles.emptyList : { paddingBottom: spacing.xxl }
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          ListEmptyComponent={renderEmptyComponent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.orderId}>#{item._id.slice(-6)}</Text>
                <Text style={styles.price}>₹ {item.totalPrice}</Text>
              </View>

              <Text style={styles.text}>User: {item.user?.name}</Text>
              <Text style={styles.text}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              <View style={styles.statusRow}>
                <Image
                  source={
                    item.status === "Processing"
                      ? require("../../assets/icons/processing.png")
                      : item.status === "Shipped"
                      ? require("../../assets/icons/shipped.png")
                      : item.status === "Out For Delivery"
                      ? require("../../assets/icons/delivery-bike.png")
                      : item.status === "Delivered"
                      ? require("../../assets/icons/delivered.png")
                      : require("../../assets/icons/package.png")
                  }
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: getStatusColor(item.status),
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status || "Processing"}
                </Text>
              </View>

              {item.orderItems?.map((product, index) => (
                <View key={index} style={styles.productRow}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.qtyText}>Qty: {product.qty}</Text>
                    <Text style={styles.qtyText}>₹ {product.price}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.info || "#2196f3" }]}
                  onPress={() => updateStatus(item._id, "Shipped")}
                >
                  <Text style={styles.buttonText}>Shipped</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary || "#9c27b0" }]}
                  onPress={() => updateStatus(item._id, "Out For Delivery")}
                >
                  <Text style={styles.buttonText}>Out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.success || "#4caf50" }]}
                  onPress={() => updateStatus(item._id, "Delivered")}
                >
                  <Text style={styles.buttonText}>Delivered</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  heading: {
    ...typography.h1,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  orderId: {
    ...typography.subtitle,
    color: colors.primary,
  },
  price: {
    ...typography.subtitle,
    color: colors.text,
  },
  text: {
    ...typography.body,
    marginBottom: spacing.xs,
    color: colors.textLight,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  statusText: {
    ...typography.subtitle,
    marginLeft: spacing.xs,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  productName: {
    ...typography.body,
    fontFamily: fonts.bold,
    marginBottom: 4,
    color: colors.text,
  },
  qtyText: {
    ...typography.caption,
    color: colors.textLight,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: {
    color: colors.card,
    ...typography.caption,
    fontFamily: fonts.bold,
  },
  searchBar: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  tabContainer: {
    marginBottom: spacing.md,
    height: 42,
  },
  tabScrollContent: {
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textLight,
    fontFamily: fonts.semiBold,
  },
  activeTabText: {
    color: colors.card,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textLight,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
});