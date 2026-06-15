import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../src/context/CartContext";
import { colors, typography, spacing, radius, shadows } from "../src/theme";

export default function CartScreen({

  navigation,

}) {

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const parsePrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    const cleanPrice = String(price).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleanPrice);
    return isNaN(parsed) ? 0 : parsed;
  };

  /* TOTAL */

  const itemsTotal =
    cartItems.reduce(

      (acc, item) =>

        acc +
        parsePrice(item.price) * item.qty,

      0

    );

  const totalMRP =
    cartItems.reduce(

      (acc, item) =>

        acc +
        (parsePrice(item.originalPrice) || parsePrice(item.price)) *
        item.qty,

      0

    );

  const savings =
    totalMRP - itemsTotal;

  const deliveryFee =
    itemsTotal > 999
      ? 0
      : 49;

  const totalAmount =
    itemsTotal + deliveryFee;

  /* EMPTY */

  if (cartItems.length === 0) {

    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Image
            source={require("../assets/icons/empty-cart.png")}
            style={{
              width: 90,
              height: 90,
              tintColor: colors.primary,
              resizeMode: "contain",
            }}
          />
        </View>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySub}>Looks like you have not added anything yet</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}>
          <Text style={styles.shopText}>Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );

  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.heading}>My Cart 🛒</Text>
        <Text style={styles.subHeading}>{cartItems.length} Items</Text>
      </View>

      {/* PRODUCTS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {cartItems.map((item) => (
          <View key={item._id} style={styles.card}>
            {/* IMAGE */}
            <Image source={{ uri: item.image }} style={styles.image} />
            {/* INFO */}
            <View style={styles.info}>
              <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category?.name || item.category || "Uncategorized"}</Text>
              {/* PRICE */}
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹ {parsePrice(item.price).toLocaleString("en-IN")}</Text>
                <Text style={styles.oldPrice}>₹ {(parsePrice(item.originalPrice) || parsePrice(item.price)).toLocaleString("en-IN")}</Text>
              </View>
              {/* ACTIONS */}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.qtyButton} onPress={() => decreaseQty(item._id)}>
                  <Image source={require("../assets/icons/minus-sign.png")} style={{ width: 18, height: 18, tintColor: colors.text, resizeMode: "contain" }} />
                </TouchableOpacity>
                <Text style={styles.qty}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyButton} onPress={() => increaseQty(item._id)}>
                  <Image source={require("../assets/icons/plus.png")} style={{ width: 18, height: 18, tintColor: colors.text, resizeMode: "contain" }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item._id)}>
                  <Image source={require("../assets/icons/delete.png")} style={{ width: 20, height: 20, tintColor: colors.error || "#e94560", resizeMode: "contain" }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FIXED BOTTOM SUMMARY */}
      <View style={styles.bottomBar}>
        {/* LEFT */}
        <View style={{ flex: 1 }}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>₹ {totalAmount.toLocaleString("en-IN")}</Text>
          <Text style={styles.savings}>You saved ₹ {savings.toLocaleString("en-IN")} 🎉</Text>
          <Text style={styles.delivery}>{deliveryFee === 0 ? "Free Delivery" : `Delivery ₹${deliveryFee}`}</Text>
        </View>
        {/* CHECKOUT */}
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate("Checkout")}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
    position: "relative",
  },
  header: {
    marginTop: spacing.s,
    marginBottom: spacing.l,
  },
  heading: {
    ...typography.h1,
    color: colors.text,
  },
  subHeading: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  /* EMPTY */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  emptyIconBox: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.small,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xl,
  },
  emptySub: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.s,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
    borderRadius: radius.l,
    marginTop: spacing.xl,
  },
  shopText: {
    ...typography.subtitle,
    color: colors.card,
  },
  /* CARD */
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.l,
    flexDirection: "row",
    padding: spacing.m,
    marginBottom: spacing.m,
    ...shadows.small,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: radius.m,
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    marginLeft: spacing.m,
    justifyContent: "space-between",
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
  },
  category: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.s,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
  },
  oldPrice: {
    ...typography.caption,
    color: colors.textSecondary,
    textDecorationLine: "line-through",
    marginLeft: spacing.s,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.m,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: radius.s,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: {
    ...typography.subtitle,
    color: colors.text,
    marginHorizontal: spacing.m,
  },
  removeButton: {
    marginLeft: "auto",
  },
  /* BOTTOM */
  bottomBar: {
    position: "absolute",
    bottom: 90,
    left: spacing.m,
    right: spacing.m,
    backgroundColor: colors.card,
    padding: spacing.l,
    borderRadius: radius.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...shadows.medium,
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  totalPrice: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xs,
  },
  savings: {
    ...typography.caption,
    color: colors.success || "green",
    marginTop: spacing.xs,
  },
  delivery: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.l,
    borderRadius: radius.m,
  },
  checkoutText: {
    ...typography.subtitle,
    color: colors.card,
  },

  });