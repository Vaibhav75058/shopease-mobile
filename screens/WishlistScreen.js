import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useWishlist } from "../src/context/WishlistContext";
import { useCart } from "../src/context/CartContext";
import { colors, typography, spacing, radius, shadows } from "../src/theme";

export default function WishlistScreen({ navigation }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item._id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/icons/empty-wishlist.png")}
            style={{
              width: 90,
              height: 90,
              tintColor: colors.textLight,
              resizeMode: "contain",
            }}
          />
          <Text style={styles.emptyText}>Wishlist is Empty</Text>
          <TouchableOpacity
            style={styles.emptyCtaButton}
            onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
          >
            <Text style={styles.emptyCtaText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.card}
              onPress={() => navigation.navigate("ProductDetails", { product: item })}
            >
              {/* IMAGE */}
              <Image source={{ uri: item.image }} style={styles.image} />

              {/* INFO */}
              <View style={styles.info}>
                <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹ {item.price?.toLocaleString("en-IN")}</Text>

                <TouchableOpacity
                  style={styles.moveToCartBtn}
                  onPress={() => handleMoveToCart(item)}
                >
                  <Text style={styles.moveToCartText}>Move to Cart</Text>
                </TouchableOpacity>
              </View>

              {/* DELETE */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeFromWishlist(item._id)}
              >
                <Image
                  source={require("../assets/icons/delete.png")}
                  style={{
                    width: 22,
                    height: 22,
                    tintColor: colors.accent,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
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
    paddingTop: spacing.sm,
  },
  heading: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.sm,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: radius.lg,
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  price: {
    ...typography.priceSmall,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  moveToCartBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    alignSelf: "flex-start",
  },
  moveToCartText: {
    ...typography.labelSmall,
    color: colors.primary,
  },
  deleteBtn: {
    padding: spacing.sm,
    alignSelf: "flex-start",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    ...typography.h2,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  emptyCtaButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    ...shadows.md,
  },
  emptyCtaText: {
    ...typography.button,
  },
});