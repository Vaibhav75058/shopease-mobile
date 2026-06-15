import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import API from "../src/services/api";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";
import { useCart } from "../src/context/CartContext";
import { useWishlist } from "../src/context/WishlistContext";

export default function CategoryProductsScreen({ route, navigation }) {
  const { category } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await fetchProducts();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      const filtered = response.data.filter(
        (item) => item.category?.name?.toLowerCase() === category?.toLowerCase() || item.category === category
      );
      setProducts(filtered);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleWishlistToggle = (item) => {
    const isWishlisted = wishlist.some((w) => w._id === item._id || w.productId?._id === item._id);
    if (isWishlisted) {
      const wishlistItem = wishlist.find((w) => w._id === item._id || w.productId?._id === item._id);
      removeFromWishlist(wishlistItem._id);
    } else {
      addToWishlist(item);
    }
  };

  const renderItem = ({ item }) => {
    const isWishlisted = wishlist.some((w) => w._id === item._id || w.productId?._id === item._id);

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        {/* IMAGE CONTAINER */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />

          {/* DISCOUNT */}
          {item.discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discountPercent}% OFF</Text>
            </View>
          )}

          {/* WISHLIST */}
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={() => handleWishlistToggle(item)}
          >
            <Image
              source={
                isWishlisted
                  ? require("../assets/icons/heart.png")
                  : require("../assets/icons/empty-wishlist.png")
              }
              style={{
                width: 18,
                height: 18,
                tintColor: isWishlisted ? colors.accent : colors.textPrimary,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>

        {/* DETAILS */}
        <View style={styles.details}>
          <Text numberOfLines={2} style={styles.name}>{item.name}</Text>

          <View style={styles.ratingRow}>
            <Image
              source={require("../assets/icons/star.png")}
              style={{
                width: 14,
                height: 14,
                tintColor: colors.starFilled,
                resizeMode: "contain",
              }}
            />
            <Text style={styles.ratingText}>{item.rating || "4.0"}</Text>
            <Text style={styles.reviewText}>({item.numReviews || 0})</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹ {item.price?.toLocaleString("en-IN")}</Text>
            <Text style={styles.oldPrice}>₹ {(item.originalPrice || item.price)?.toLocaleString("en-IN")}</Text>
          </View>

          <View style={styles.categoryBox}>
            <Text style={styles.categoryText}>{item.category?.name || item.category}</Text>
          </View>

          <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(item)}>
            <Image
              source={require("../assets/icons/cart.png")}
              style={{
                width: 18,
                height: 18,
                tintColor: colors.textWhite,
                resizeMode: "contain",
              }}
            />
            <Text style={styles.cartText}>Add</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>{category}</Text>
          <Text style={styles.subHeading}>Discover premium products</Text>
        </View>
        <View style={styles.productCount}>
          <Text style={styles.productCountText}>{products.length} Items</Text>
        </View>
      </View>

      {/* PRODUCTS */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/icons/no-results.png")}
            style={{
              width: 100,
              height: 100,
              tintColor: colors.textLight,
              resizeMode: "contain",
            }}
          />
          <Text style={styles.emptyText}>No Products Found</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: spacing.xxl * 3 }}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  heading: {
    ...typography.h1,
    fontSize: 34,
  },
  subHeading: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  productCount: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  productCountText: {
    ...typography.buttonSmall,
  },
  card: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  discountText: {
    ...typography.badge,
    color: colors.textWhite,
  },
  wishlistBtn: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },
  details: {
    padding: spacing.md,
  },
  name: {
    ...typography.h4,
    lineHeight: 22,
    minHeight: 48,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  ratingText: {
    ...typography.label,
    marginLeft: 5,
  },
  reviewText: {
    ...typography.caption,
    marginLeft: 5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  oldPrice: {
    ...typography.bodySmall,
    marginLeft: spacing.sm,
    textDecorationLine: "line-through",
  },
  categoryBox: {
    backgroundColor: colors.primaryLight,
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  categoryText: {
    ...typography.labelSmall,
    color: colors.primary,
  },
  cartButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cartText: {
    ...typography.buttonSmall,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },
  emptyText: {
    ...typography.h2,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});