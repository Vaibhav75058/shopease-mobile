import React, { useState, useRef, useEffect } from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
  Animated, Dimensions, Share, FlatList, Modal
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";
import { useWishlist } from "../src/context/WishlistContext";
import { useCart } from "../src/context/CartContext";

const { width } = Dimensions.get("window");

// ═══════════════════════════════════════════════════════
//  STAR RATING COMPONENT
// ═══════════════════════════════════════════════════════
function StarRating({ rating = 0, size = 16 }) {
  const stars = [];
  const fullStars = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= fullStars;
    stars.push(
      <Image
        key={i}
        source={require("../assets/icons/star.png")}
        style={{
          width: size,
          height: size,
          tintColor: isFilled ? colors.starFilled : colors.starEmpty,
          resizeMode: "contain"
        }}
      />
    );
  }
  return <View style={{ flexDirection: "row", gap: 2 }}>{stars}</View>;
}

// ═══════════════════════════════════════════════════════
//  SECTION DIVIDER
// ═══════════════════════════════════════════════════════
function SectionDivider() {
  return <View style={styles.sectionDivider} />;
}

// ═══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function ProductDetailsScreen({
  route,
  navigation,
}) {

  const { product } = route.params;

  const cart = useCart();
  const addToCart = cart?.addToCart;

  const wishlist = useWishlist();
  const addToWishlist = wishlist?.addToWishlist;

  const [showWishlistAlert, setShowWishlistAlert] = useState(false);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* ADD TO CART with animation */
  const handleAddToCart = () => {
    const cartProduct = { ...product, qty: quantity };
    addToCart(cartProduct);

    // Button bounce
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setShowCartAlert(true);
    setTimeout(() => setShowCartAlert(false), 2500);
  };

  /* WISHLIST with heart animation */
  const handleWishlist = () => {
    addToWishlist(product);
    setIsWishlisted(true);

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setShowWishlistAlert(true);
    setTimeout(() => setShowWishlistAlert(false), 1800);
  };

  /* SHARE */
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} at ₹${product.price}! 🛒`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  /* SCROLL FOR IMAGES SLIDER */
  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    if (slideSize > 0) {
      const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
      setActiveImageIndex(index);
    }
  };

  /* QUANTITY */
  const incrementQty = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(prev => prev + 1);
    }
  };
  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Computed
  let parsedDesc = product.description || "Premium quality product with amazing build quality and modern design. Crafted with attention to detail for the best user experience.";
  let addImages = [];
  const jsonMatch = parsedDesc.match(/\[IMAGES_JSON\]\s*:\s*(\[.*?\])/);
  if (jsonMatch) {
    try {
      addImages = JSON.parse(jsonMatch[1]);
      parsedDesc = parsedDesc.replace(/\n*\[IMAGES_JSON\]\s*:\s*\[.*?\]/g, "").trim();
    } catch (e) {
      console.log("Error parsing image JSON on details:", e);
    }
  }

  const rawImages = [product.image, ...(product.images || []), ...addImages].filter(Boolean);
  const images = [...new Set(rawImages)];
  const activeImage = images[activeImageIndex] || product.image;
  const isPngActive = activeImage && (
    activeImage.toLowerCase().endsWith(".png") ||
    activeImage.toLowerCase().includes(".png")
  );
  const savings = (product.originalPrice || 0) - (product.price || 0);
  const ratingNum = parseFloat(product.rating) || 0;
  const reviewsNum = parseInt(product.numReviews) || 0;
  const descriptionText = parsedDesc;
  const shouldTruncateDesc = descriptionText.length > 150;

  return (
    <SafeAreaView
      edges={["top"]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* ═══════════════════════════════════════ */}
        {/* IMAGE SECTION                           */}
        {/* ═══════════════════════════════════════ */}
        <View style={[styles.imageContainer, { paddingVertical: isPngActive ? 16 : 0, height: isPngActive ? 280 : width }]}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const itemIsPng = item && (
                item.toLowerCase().endsWith(".png") ||
                item.toLowerCase().includes(".png")
              );
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setZoomImageIndex(index);
                    setIsZoomVisible(true);
                  }}
                  style={[styles.imageWrapper, { width, height: itemIsPng ? 280 : width }]}
                >
                  <ExpoImage
                    source={{ uri: item }}
                    style={[
                      styles.image,
                      itemIsPng
                        ? { width: width * 0.85, height: 250, alignSelf: "center" }
                        : { width: width, height: width }
                    ]}
                    contentFit={itemIsPng ? "contain" : "cover"}
                    transition={300}
                  />
                </TouchableOpacity>
              );
            }}
          />

          {/* Dots Indicator */}
          {images.length > 1 && (
            <View style={styles.paginationDots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeImageIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Discount badge on image */}
          {product.discountPercent > 0 && (
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>
                {product.discountPercent}% OFF
              </Text>
            </View>
          )}

          {/* BACK */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Image
              source={require("../assets/icons/back-arrow.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>

          {/* SHARE */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 15 }}>🔗</Text>
          </TouchableOpacity>

          {/* WISHLIST */}
          <Animated.View
            style={[
              styles.wishlistBtnWrapper,
              { transform: [{ scale: heartScale }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.wishlistBtn,
                isWishlisted && styles.wishlistBtnActive,
              ]}
              onPress={handleWishlist}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/icons/wish-list.png")}
                style={[
                  styles.headerIcon,
                  isWishlisted && { tintColor: colors.accent },
                ]}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ═══════════════════════════════════════ */}
        {/* INFO SECTION (animated)                 */}
        {/* ═══════════════════════════════════════ */}
        <Animated.View
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >

          {/* ─── 1. Header Card ────────────────── */}
          <View style={styles.card}>
            {/* Tag / Category / Brand Row */}
            <View style={styles.tagRow}>
              <View style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>
                  📂 {product.category?.name || "Uncategorized"}
                </Text>
              </View>
              {product.brand ? (
                <View style={styles.brandChip}>
                  <Text style={styles.brandChipText}>
                    🏢 {product.brand}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Product Name */}
            <Text style={styles.name}>{product.name}</Text>

            {/* Rating Row */}
            <View style={styles.ratingSection}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>★ {ratingNum}</Text>
              </View>
              <Text style={styles.ratingCount}>
                ({reviewsNum.toLocaleString()} reviews)
              </Text>
            </View>
          </View>

          {/* ─── 2. Pricing & Selector Card ─────── */}
          <View style={styles.card}>
            <View style={styles.priceAndStockRow}>
              <View>
                <Text style={styles.priceLabel}>Price</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{product.price?.toLocaleString("en-IN")}</Text>
                  {product.originalPrice > 0 && (
                    <Text style={styles.oldPrice}>₹{product.originalPrice?.toLocaleString("en-IN")}</Text>
                  )}
                </View>
              </View>

              {/* Stock Status */}
              <View
                style={[
                  styles.stockBadge,
                  product.inStock ? styles.stockInBadge : styles.stockOutBadge,
                ]}
              >
                <View
                  style={[
                    styles.stockDot,
                    { backgroundColor: product.inStock ? colors.success : colors.accent },
                  ]}
                />
                <Text
                  style={[
                    styles.stockBadgeText,
                    { color: product.inStock ? colors.success : colors.accent },
                  ]}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Text>
              </View>
            </View>

            {/* Discount & Savings Info */}
            {(product.discountPercent > 0 || savings > 0) && (
              <View style={styles.savingsRow}>
                {product.discountPercent > 0 && (
                  <View style={styles.discountPill}>
                    <Text style={styles.discountPillText}>
                      {product.discountPercent}% OFF
                    </Text>
                  </View>
                )}
                {savings > 0 && (
                  <Text style={styles.savingsText}>
                    You save ₹{savings.toLocaleString("en-IN")}!
                  </Text>
                )}
              </View>
            )}



            {product.stock > 0 && product.stock <= 10 && (
              <Text style={styles.lowStockText}>
                ⚡ Only {product.stock} left in stock — Hurry!
              </Text>
            )}
          </View>

          {/* ─── 3. Offers Card ─────────────────── */}
          {product.offers && product.offers.length > 0 && (
            <View style={[styles.card, styles.offersCard]}>
              <Text style={styles.sectionTitle}>🎁 Available Offers</Text>
              <View style={styles.offersList}>
                {product.offers.map((offer, index) => (
                  <View key={index} style={styles.offerItem}>
                    <Text style={styles.offerBullet}>•</Text>
                    <Text style={styles.offerText}>{offer}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ─── 4. Description Card ────────────── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📝 Product Description</Text>
            <Text style={styles.description}>
              {shouldTruncateDesc && !descExpanded
                ? descriptionText.slice(0, 150) + "..."
                : descriptionText}
            </Text>
            {shouldTruncateDesc && (
              <TouchableOpacity
                onPress={() => setDescExpanded(!descExpanded)}
                activeOpacity={0.6}
              >
                <Text style={styles.readMoreBtn}>
                  {descExpanded ? "Show Less ▲" : "Read More ▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ─── 5. Specifications Card ─────────── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📋 Specifications</Text>
            <View style={styles.specsTable}>
              {product.brand && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Brand</Text>
                  <Text style={styles.specValue}>{product.brand}</Text>
                </View>
              )}
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Category</Text>
                <Text style={styles.specValue}>
                  {product.category?.name || "Uncategorized"}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Rating</Text>
                <Text style={styles.specValue}>
                  {ratingNum} ★ ({reviewsNum} reviews)
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Availability</Text>
                <Text
                  style={[
                    styles.specValue,
                    { color: product.inStock ? colors.success : colors.accent },
                  ]}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Text>
              </View>
              {product.deliveryDays && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Delivery</Text>
                  <Text style={styles.specValue}>{product.deliveryDays}</Text>
                </View>
              )}
            </View>
          </View>

          {/* ─── 6. Delivery & Trust Card ───────── */}
          <View style={styles.card}>
            {/* Delivery Info */}
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIconBg}>
                <Image
                  source={require("../assets/icons/delivery-bike.png")}
                  style={styles.deliveryIcon}
                />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>
                  Delivery in {product.deliveryDays || "3-5 days"}
                </Text>
                <Text style={styles.deliverySubtitle}>
                  Free shipping available on this order
                </Text>
              </View>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Trust Badges Grid */}
            <View style={styles.trustGrid}>
              <View style={styles.trustItem}>
                <View style={[styles.trustIconBg, { backgroundColor: colors.primaryLight }]}>
                  <Image
                    source={require("../assets/icons/security.png")}
                    style={[styles.trustIcon, { tintColor: colors.primary }]}
                  />
                </View>
                <Text style={styles.trustTitle}>Secure{"\n"}Payment</Text>
              </View>

              <View style={styles.trustItem}>
                <View style={[styles.trustIconBg, { backgroundColor: colors.successLight }]}>
                  <Image
                    source={require("../assets/icons/delivered.png")}
                    style={[styles.trustIcon, { tintColor: colors.success }]}
                  />
                </View>
                <Text style={styles.trustTitle}>Genuine{"\n"}Product</Text>
              </View>

              <View style={styles.trustItem}>
                <View style={[styles.trustIconBg, { backgroundColor: colors.accentLight }]}>
                  <Image
                    source={require("../assets/icons/refund.png")}
                    style={[styles.trustIcon, { tintColor: colors.accent }]}
                  />
                </View>
                <Text style={styles.trustTitle}>Easy{"\n"}Returns</Text>
              </View>

              <View style={styles.trustItem}>
                <View style={[styles.trustIconBg, { backgroundColor: colors.warningLight }]}>
                  <Image
                    source={require("../assets/icons/support-headset.png")}
                    style={[styles.trustIcon, { tintColor: colors.warning }]}
                  />
                </View>
                <Text style={styles.trustTitle}>24/7{"\n"}Support</Text>
              </View>
            </View>
          </View>

        </Animated.View>

      </ScrollView>

      {/* ═══════════════════════════════════════════ */}
      {/* BOTTOM BAR                                  */}
      {/* ═══════════════════════════════════════════ */}
      <View style={styles.bottomBar}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Image
              source={require("../assets/icons/cart.png")}
              style={styles.cartBtnIcon}
            />
            <Text style={styles.buttonText}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[styles.buyButton, !product.inStock && styles.buyButtonDisabled]}
          onPress={() => {
            if (product.inStock) {
              addToCart({
                ...product,
                qty: quantity,
              });
              navigation.navigate("Checkout");
            }
          }}
          disabled={!product.inStock}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 14 }}>⚡</Text>
            <Text style={styles.buttonText}>
              Buy Now
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* WISHLIST ALERT */}
      <AwesomeAlert
        show={showWishlistAlert}
        title="Wishlist ❤️"
        message="Added to Wishlist"
        closeOnTouchOutside
        closeOnHardwareBackPress
        showConfirmButton={false}
      />

      {/* CART ALERT */}
      <AwesomeAlert
        show={showCartAlert}
        title="Cart 🛒"
        message={`${quantity}x ${product.name} added to cart`}
        closeOnTouchOutside
        closeOnHardwareBackPress
        showCancelButton
        showConfirmButton
        cancelText="Continue"
        confirmText="Go To Cart"
        confirmButtonColor={colors.primary}
        onConfirmPressed={() => {
          setShowCartAlert(false);
          navigation.navigate("MainTabs", { screen: "Cart" });
        }}
        onCancelPressed={() => setShowCartAlert(false)}
      />

      {/* FULLSCREEN IMAGE ZOOM SWIPER MODAL */}
      <Modal
        visible={isZoomVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsZoomVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setIsZoomVisible(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          {/* Fullscreen FlatList Swiper */}
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={zoomImageIndex}
            getItemLayout={(data, index) => (
              { length: width, offset: width * index, index }
            )}
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const slideSize = event.nativeEvent.layoutMeasurement.width;
              if (slideSize > 0) {
                const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
                setZoomImageIndex(index);
              }
            }}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View style={styles.modalImageWrapper}>
                  <ExpoImage
                    source={{ uri: item }}
                    style={styles.modalImage}
                    contentFit="contain"
                    transition={200}
                  />
                </View>
              );
            }}
          />

          {/* Dots Indicator inside Modal */}
          {images.length > 1 && (
            <View style={styles.modalDots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.modalDot,
                    zoomImageIndex === index && styles.modalActiveDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ─── Image Section ──────────────────
  imageContainer: {
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  image: {
    width: width * 0.85,
    height: 260,
  },
  discountTag: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountTagText: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  headerIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  backBtn: {
    position: "absolute",
    top: 12,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  shareBtn: {
    position: "absolute",
    top: 12,
    right: 64,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistBtnWrapper: {
    position: "absolute",
    top: 12,
    right: 16,
  },
  wishlistBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistBtnActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentLight,
  },

  // ─── Cards ──────────────────────────
  infoContainer: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  // ─── Tag / Category Row ─────────────
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  categoryChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipText: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  brandChip: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandChipText: {
    color: colors.secondary,
    fontFamily: fonts.medium,
    fontSize: 11,
  },

  // ─── Product Name ───────────────────
  name: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    lineHeight: 26,
  },

  // ─── Rating Section ─────────────────
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  ratingBadge: {
    backgroundColor: "#fff9e6",
    borderWidth: 1,
    borderColor: "#ffe0b2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: "#e68a00",
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  ratingCount: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.medium,
  },

  // ─── Price & Stock ──────────────────
  priceAndStockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: colors.textLight,
    fontFamily: fonts.medium,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  discountPill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountPillText: {
    color: colors.success,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  savingsText: {
    fontSize: 12,
    color: colors.success,
    fontFamily: fonts.semiBold,
  },

  // ─── Stock Badge ────────────────────
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  stockInBadge: {
    backgroundColor: colors.successLight,
  },
  stockOutBadge: {
    backgroundColor: colors.accentLight,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  lowStockText: {
    color: colors.warning,
    fontFamily: fonts.bold,
    fontSize: 12,
    marginTop: 8,
  },

  // ─── Quantity Selector ──────────────
  quantityContainer: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  quantityLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quantitySelectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtnDisabled: {
    backgroundColor: colors.borderLight,
    borderColor: colors.borderLight,
  },
  qtyIcon: {
    width: 12,
    height: 12,
    resizeMode: "contain",
    tintColor: colors.textPrimary,
  },
  qtyValueBox: {
    width: 44,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyValue: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  qtyTotal: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  // ─── Offers Section ─────────────────
  offersCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  offersList: {
    marginTop: 8,
    gap: 6,
  },
  offerItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  offerBullet: {
    fontSize: 14,
    color: colors.success,
    lineHeight: 18,
  },
  offerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    lineHeight: 18,
  },

  // ─── Section Title ──────────────────
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  // ─── Specifications ─────────────────
  specsTable: {
    marginTop: 6,
    gap: 8,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  specLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    width: "40%",
  },
  specValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    width: "60%",
    textAlign: "right",
  },

  // ─── Description ────────────────────
  description: {
    color: colors.textSecondary,
    lineHeight: 20,
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  readMoreBtn: {
    color: colors.primary,
    fontFamily: fonts.bold,
    marginTop: 6,
    fontSize: 13,
  },

  // ─── Delivery Info ──────────────────
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  deliveryIcon: {
    width: 22,
    height: 22,
    tintColor: colors.primary,
    resizeMode: "contain",
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  deliverySubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  freeBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freeBadgeText: {
    color: colors.success,
    fontFamily: fonts.bold,
    fontSize: 11,
  },

  // ─── Trust Badges ───────────────────
  trustGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  trustItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  trustIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  trustTitle: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
    lineHeight: 12,
    flex: 1,
  },

  // ─── Bottom Bar ─────────────────────
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: "row",
    gap: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  cartBtnIcon: {
    width: 16,
    height: 16,
    tintColor: colors.surface,
    resizeMode: "contain",
  },
  buyButton: {
    flex: 1,
    backgroundColor: colors.buyNow,
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  buttonText: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDots: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    gap: 6,
    alignSelf: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  modalImageWrapper: {
    width: width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: width,
    height: "75%",
  },
  modalDots: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
  },
  modalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  modalActiveDot: {
    backgroundColor: "#fff",
    width: 18,
  },
});