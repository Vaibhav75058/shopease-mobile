import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography, spacing, radius, shadows } from "../src/theme";
import API from "../src/services/api";

export default function OrderDetailsScreen({ route }) {
  const { order } = route.params;
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [cancelling, setCancelling] = useState(false);

  const listingPrice = order.orderItems.reduce(
    (acc, curr) => acc + (curr.originalPrice || curr.price) * curr.qty,
    0
  );
  const fees = order.shippingPrice || 0;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return colors.success;
      case "processing": return colors.warning;
      case "cancelled": return colors.error;
      default: return colors.primary;
    }
  };

  const steps = ["Ordered", "Processing", "Shipped", "Delivered"];

  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case "ordered": return 0;
      case "processing": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(orderStatus);
  const isCancelled = orderStatus?.toLowerCase() === "cancelled";
  const isCancelable = !orderStatus || !["delivered", "cancelled"].includes(orderStatus.toLowerCase());

  console.log("OrderDetails debug: orderStatus =", orderStatus, "isCancelable =", isCancelable);

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelling(true);
              await API.put(`/orders/${order._id}/status`, { status: "Cancelled" });
              setOrderStatus("Cancelled");
              Alert.alert("Success", "Your order has been cancelled.");
            } catch (err) {
              console.log("Cancel order error:", err);
              Alert.alert("Error", "Could not cancel the order. Please try again.");
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const renderStatusTracker = () => {
    if (isCancelled) {
      return (
        <View style={styles.cancelledCard}>
          <Text style={styles.cancelledText}>🚫 This order has been cancelled</Text>
        </View>
      );
    }

    return (
      <View style={styles.trackerCard}>
        <Text style={styles.trackerTitle}>Order Progress</Text>
        <View style={styles.stepperContainer}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;
            return (
              <React.Fragment key={step}>
                {idx > 0 && (
                  <View
                    style={[
                      styles.connectorLine,
                      { backgroundColor: idx <= currentStep ? colors.success : colors.border },
                    ]}
                  />
                )}
                <View style={styles.stepWrapper}>
                  <View
                    style={[
                      styles.stepDot,
                      isCompleted && { backgroundColor: colors.success, borderColor: colors.success },
                      isCurrent && { borderWidth: 3, borderColor: colors.primary, backgroundColor: "white" },
                    ]}
                  >
                    {isCompleted && !isCurrent ? (
                      <Text style={styles.checkMark}>✓</Text>
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.stepLabelActive,
                      isCompleted && !isCurrent && styles.stepLabelCompleted,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {renderStatusTracker()}

        {/* PRODUCTS */}
        {order.orderItems.map((item, index) => (
          <View key={index} style={styles.productCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text numberOfLines={2} style={styles.name}>
                {item.name}
              </Text>
              <Text style={styles.price}>
                ₹ {item.price.toLocaleString("en-IN")}
              </Text>
              <Text style={styles.qty}>
                Qty: {item.qty}
              </Text>
              <View style={[styles.statusBox, { backgroundColor: getStatusColor(orderStatus) + "20" }]}>
                <Text style={[styles.status, { color: getStatusColor(orderStatus) }]}>
                  {orderStatus}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* DELIVERY */}
        <Text style={styles.heading}>Delivery Details</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Image
              source={require("../assets/icons/home.png")}
              style={{ width: 24, height: 24, tintColor: colors.text, resizeMode: "contain" }}
            />
            <Text style={styles.address}>
              {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Image
              source={require("../assets/icons/person.png")}
              style={{ width: 24, height: 24, tintColor: colors.text, resizeMode: "contain" }}
            />
            <Text style={styles.user}>
              {order.shippingAddress.phone || "No phone"}
            </Text>
          </View>
        </View>

        {/* PRICE */}
        <Text style={styles.heading}>Price Details</Text>
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Listing Price</Text>
            <Text style={styles.strike}>₹ {listingPrice.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Selling Price</Text>
            <Text style={styles.value}>₹ {order.totalPrice.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Platform Fee</Text>
            <Text style={styles.value}>₹ {fees.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.dashed} />
          <View style={styles.priceRow}>
            <Text style={styles.total}>Total Amount</Text>
            <Text style={styles.total}>₹ {(order.totalPrice + fees).toLocaleString("en-IN")}</Text>
          </View>

          {/* PAYMENT */}
          <View style={styles.paymentBox}>
            <Text style={styles.paymentText}>Paid By</Text>
            <View style={styles.upiBox}>
              <Text style={styles.upi}>
                {order.paymentMethod || "COD"}
              </Text>
            </View>
          </View>
        </View>

        {/* ORDER INFO */}
        <Text style={styles.heading}>Order Info</Text>
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.small}>{order._id.slice(-8)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Ordered On</Text>
            <Text style={styles.small}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Status Code</Text>
            <Text style={styles.small}>{orderStatus || "None"}</Text>
          </View>
        </View>

        {/* CANCEL BUTTON */}
        {isCancelable && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "space-between",
  },
  name: {
    ...typography.h3,
    color: colors.text,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  qty: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBox: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
  },
  status: {
    ...typography.subtitle,
  },
  heading: {
    ...typography.h3,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    marginLeft: spacing.sm,
    flex: 1,
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  user: {
    marginLeft: spacing.sm,
    ...typography.subtitle,
    color: colors.text,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  value: {
    ...typography.subtitle,
    color: colors.text,
  },
  strike: {
    ...typography.body,
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  dashed: {
    borderStyle: "dashed",
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  total: {
    ...typography.h3,
    color: colors.text,
  },
  paymentBox: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentText: {
    ...typography.body,
    color: colors.text,
  },
  upiBox: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  upi: {
    color: colors.primary,
    ...typography.subtitle,
  },
  small: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  trackerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  trackerTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    color: colors.text,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
    marginVertical: spacing.xs,
  },
  stepWrapper: {
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  checkMark: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 9,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
  stepLabelActive: {
    color: colors.primary,
    fontFamily: "Poppins_600SemiBold",
  },
  stepLabelCompleted: {
    color: colors.success,
  },
  connectorLine: {
    height: 2,
    flex: 1,
    marginHorizontal: -12,
    alignSelf: "center",
    marginTop: -15,
  },
  cancelledCard: {
    backgroundColor: "#ffeaea",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  cancelledText: {
    ...typography.subtitle,
    color: colors.error,
    fontFamily: "Poppins_600SemiBold",
  },
  cancelButton: {
    backgroundColor: colors.error || "#ef4444",
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  cancelButtonText: {
    color: "white",
    ...typography.subtitle,
    fontFamily: "Poppins_600SemiBold",
  },
});