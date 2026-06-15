import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View, Text, FlatList, StyleSheet, Image,
  TouchableOpacity, Dimensions, ActivityIndicator, ScrollView, Animated,
  RefreshControl, Modal, Alert,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../src/services/api";
import Header from "../src/components/Header";
import SearchBar from "../src/components/SearchBar";
import { useAuth } from "../src/context/AuthContext";
import { useWishlist } from "../src/context/WishlistContext";
import { colors, typography, spacing, radius, shadows } from "../src/theme";

const { width } = Dimensions.get("window");

const FLIPKART_BANNERS = [
  { id: "1", image: require('../assets/banners/electronics.png'), category: "Electronics" },
  { id: "2", image: require('../assets/banners/fashion.png'), category: "Fashion" },
  { id: "3", image: require('../assets/banners/health.png'), category: "Health" },
  { id: "4", image: require('../assets/banners/home.png'), category: "Home" },
  { id: "5", image: require('../assets/banners/skincare.png'), category: "Beauty" },
];

function SkeletonCard() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-(width - spacing.md * 3) / 2, (width - spacing.md * 3) / 2],
  });

  return (
    <View style={[styles.card, { overflow: "hidden" }]}>
      <View style={[styles.imageContainer, { backgroundColor: colors.border, overflow: "hidden" }]}>
        <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
          <LinearGradient
            colors={[colors.border, colors.surface, colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <View style={{ height: 16, backgroundColor: colors.border, marginTop: spacing.sm, borderRadius: radius.sm }} />
      <View style={{ height: 12, backgroundColor: colors.border, marginTop: spacing.xs, width: "60%", borderRadius: radius.sm }} />
      <View style={{ height: 18, backgroundColor: colors.border, marginTop: spacing.sm, width: "40%", borderRadius: radius.sm }} />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Animated scroll value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Sticky Category Pills interpolations
  const stickyOpacity = scrollY.interpolate({
    inputRange: [40, 80],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const stickyTranslateY = scrollY.interpolate({
    inputRange: [40, 80],
    outputRange: [-10, 0],
    extrapolate: "clamp",
  });

  // Listener to toggle touch interactivity of the sticky bar
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const show = value >= 75;
      if (show !== showStickyBar) {
        setShowStickyBar(show);
      }
    });
    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [showStickyBar]);

  // Location selector states
  const [selectedAddress, setSelectedAddress] = useState("No Location Selected");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locating, setLocating] = useState(false);

  // Banner auto-scroll
  const bannerFlatListRef = useRef(null);
  const currentBannerIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Chat button pulse effect
  const chatPulseAnim = useRef(new Animated.Value(1)).current;
  const chatGlowAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  useEffect(() => {
    // Load last selected location from AsyncStorage
    AsyncStorage.getItem("last_selected_location").then((val) => {
      if (val) {
        setSelectedAddress(val);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedAddresses();
    } else {
      setSavedAddresses([]);
    }
  }, [user]);

  const fetchSavedAddresses = async () => {
    if (!user) return;
    try {
      const res = await API.get("/address");
      setSavedAddresses(res.data || []);
    } catch (err) {
      console.log("Error fetching saved addresses for home:", err);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Permission to access location is required to auto-detect.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const addr = geocode[0];
        const shortAddr = `${addr.name || addr.street || ""}, ${addr.city || addr.subregion || ""}`;
        const formatted = shortAddr.replace(/^,\s*/, "").trim() || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setSelectedAddress(formatted);
        await AsyncStorage.setItem("last_selected_location", formatted);
      } else {
        setSelectedAddress("Current Location");
      }
      setShowLocationModal(false);
    } catch (error) {
      console.log("Error getting location:", error);
      Alert.alert("Error", "Failed to retrieve your current location.");
    } finally {
      setLocating(false);
    }
  };

  // Auto-scroll banner
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentBannerIndexRef.current + 1;
      if (nextIndex >= FLIPKART_BANNERS.length) nextIndex = 0;
      currentBannerIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      bannerFlatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Support Chat pulsing & glowing animation
  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(chatPulseAnim, {
            toValue: 1.08,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(chatPulseAnim, {
            toValue: 1.0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(chatGlowAnim, {
            toValue: 1.3,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(chatGlowAnim, {
            toValue: 0.8,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      )
    ]).start();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.log("fetchProducts error:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const toggleWishlist = (item) => {
    const isWishlisted = wishlist.some((w) => w._id === item._id);
    if (isWishlisted) {
      removeFromWishlist(item._id);
    } else {
      addToWishlist(item);
    }
  };

  /* ── DYNAMIC CATEGORIES FROM DB (name + image both) ── */
  const dynamicCategories = [
    { name: "All", image: null },
    ...Object.values(
      products.reduce((acc, item) => {
        const cat = item.category;
        if (cat?._id && !acc[cat._id]) {
          acc[cat._id] = { name: cat.name, image: cat.image };
        }
        return acc;
      }, {})
    ),
  ];

  /* ── FILTER PRODUCTS ── */
  let filteredProducts = [...products];

  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(
      (item) =>
        item.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  filteredProducts = filteredProducts.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* STICKY TOP SECTION */}
      <View style={styles.topSection}>
        <Header />
        
        {/* FLIPKART-STYLE LOCATION SELECTOR */}
        <TouchableOpacity 
          style={styles.locationRow} 
          activeOpacity={0.8}
          onPress={() => setShowLocationModal(true)}
        >
          <Text style={styles.locationPin}>📍</Text>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Deliver to - </Text>
            <Text numberOfLines={1} style={styles.locationValue}>
              {selectedAddress}
            </Text>
          </View>
          <Text style={styles.locationArrow}>▼</Text>
        </TouchableOpacity>

        <SearchBar search={search} setSearch={setSearch} />
      </View>

      {/* STICKY CATEGORIES BAR (Text Pills - between topSection and FlatList) */}
      <Animated.View
        pointerEvents={showStickyBar ? "auto" : "none"}
        style={[
          styles.stickyBarContainer,
          {
            opacity: stickyOpacity,
            transform: [{ translateY: stickyTranslateY }],
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4, paddingRight: 20, alignItems: "center" }}
        >
          {dynamicCategories.map((item) => {
            const isActive = selectedCategory === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.stickyPill,
                  isActive ? styles.stickyPillActive : styles.stickyPillInactive,
                ]}
                onPress={() => setSelectedCategory(item.name)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.stickyPillText,
                    isActive && styles.stickyPillTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* PRODUCTS LIST */}
      <Animated.FlatList
        data={loading ? [1, 2, 3, 4] : filteredProducts}
        keyExtractor={(item, index) => loading ? String(index) : item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 130 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListHeaderComponent={
          <View style={{ width: '100%' }}>
            
            {/* NATURAL CATEGORY LIST WITH IMAGES */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, paddingVertical: 10, alignItems: "center" }}
              style={{ marginVertical: spacing.xs }}
            >
              {dynamicCategories.map((item) => {
                const isActive = selectedCategory === item.name;
                return (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.categoryWrapper}
                    onPress={() => setSelectedCategory(item.name)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={
                        isActive ? styles.roundCategoryActive : styles.roundCategoryInactive
                      }
                    >
                      {item.image ? (
                        <ExpoImage
                          source={{ uri: item.image }}
                          style={styles.categoryImage}
                          contentFit="cover"
                        />
                      ) : (
                        <Image
                          source={require("../assets/icons/categories.png")}
                          style={[styles.categoryIcon, { tintColor: isActive ? "white" : colors.text }]}
                        />
                      )}
                    </View>
                    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 1. SPECIAL OFFERS HEADER */}
            <View style={[styles.sectionHeader, { marginTop: spacing.xs }]}>
              <Text style={styles.sectionTitle}>Featured Offers ⚡</Text>
              <Text style={styles.sectionSubtitle}>Limited period discounts & bundles</Text>
            </View>

            {/* BANNER SLIDER */}
            <View style={styles.bannerContainer}>
              <FlatList
                ref={bannerFlatListRef}
                data={FLIPKART_BANNERS}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                  length: width - spacing.md * 2,
                  offset: (width - spacing.md * 2) * index,
                  index,
                })}
                onScrollToIndexFailed={(info) => {
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    bannerFlatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                  });
                }}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / (width - spacing.md * 2)
                  );
                  currentBannerIndexRef.current = index;
                  setActiveIndex(index);
                }}
                renderItem={({ item }) => (
                  <View style={styles.bannerWrapper}>
                    <Image
                      source={item.image}
                      style={styles.bannerImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["rgba(0,0,0,0.15)", "transparent"]}
                      style={StyleSheet.absoluteFill}
                    />
                  </View>
                )}
              />
              {/* CAPSULE DOT INDICATORS */}
              <View style={styles.dotContainer}>
                {FLIPKART_BANNERS.map((_, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          width: isActive ? 20 : 6,
                          backgroundColor: isActive ? "#2874f0" : "#d1d5db",
                        },
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            {/* 3. TRENDING PRODUCTS HEADER */}
            <View style={[styles.sectionHeader, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
              <Text style={styles.sectionTitle}>Trending Products</Text>
              {selectedCategory !== "All" ? (
                <TouchableOpacity onPress={() => setSelectedCategory("All")}>
                  <Text style={styles.resetFilterBtn}>Reset Filter</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.sectionSubtitle}>Top picks for you</Text>
              )}
            </View>

          </View>
        }

        ListEmptyComponent={
          error ? (
            <View style={styles.emptyBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Image
                source={require("../assets/icons/no-results.png")}
                style={{ width: 80, height: 80, tintColor: colors.textMuted, resizeMode: "contain" }}
              />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )
        }

        renderItem={({ item }) => {
          if (loading) return <SkeletonCard />;
          const isWishlisted = wishlist.some((w) => w._id === item._id);
          
          return (
            <TouchableOpacity
              activeOpacity={0.95}
              style={styles.card}
              onPress={() => navigation.navigate("ProductDetails", { product: item })}
            >
              {/* IMAGE CONTAINER WITH OVERLAYS */}
              <View style={styles.imageContainer}>
                <ExpoImage source={{ uri: item.image }} style={styles.image} contentFit="cover" />
                
                {/* Wishlist Quick-Toggle Heart Overlay */}
                <TouchableOpacity
                  style={styles.wishlistOverlay}
                  activeOpacity={0.8}
                  onPress={() => toggleWishlist(item)}
                >
                  <Text style={styles.wishlistEmoji}>{isWishlisted ? "❤️" : "🤍"}</Text>
                </TouchableOpacity>

                {/* Rating Badge Overlay */}
                <View style={styles.ratingOverlay}>
                  <Text style={styles.ratingText}>★ {item.rating || "4.2"}</Text>
                </View>

                {/* Discount Percentage Overlay */}
                {item.discountPercent > 0 && (
                  <View style={styles.discountOverlay}>
                    <Text style={styles.discountText}>{item.discountPercent}% OFF</Text>
                  </View>
                )}
              </View>

              {/* CARD DETAILS */}
              <View style={styles.cardInfo}>
                {/* Brand Tag */}
                {item.brand ? (
                  <Text numberOfLines={1} style={styles.brandText}>{item.brand.toUpperCase()}</Text>
                ) : (
                  <Text style={styles.brandText}>PREMIUM</Text>
                )}
                
                <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>{item.category?.name || "Product"}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{item.price?.toLocaleString("en-IN")}</Text>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <Text style={styles.originalPrice}>₹{item.originalPrice?.toLocaleString("en-IN")}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* CHATBOT FLOATING PULSING BUTTON WITH Support Glow Ring */}
      <Animated.View style={[styles.chatBtnWrapper, { transform: [{ scale: chatPulseAnim }] }]}>
        <Animated.View 
          style={[
            styles.chatGlowRing, 
            { 
              transform: [{ scale: chatGlowAnim }],
              opacity: chatGlowAnim.interpolate({
                inputRange: [0.8, 1.3],
                outputRange: [0.6, 0]
              })
            }
          ]} 
        />
        <TouchableOpacity
          style={styles.chatBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ChatBot')}
        >
          <Image
            source={require("../assets/icons/chat-bubble.png")}
            style={{ width: 26, height: 26, tintColor: colors.surface, resizeMode: "contain" }}
          />
          {/* Online Agent status dot indicator */}
          <View style={styles.onlineStatusDot} />
        </TouchableOpacity>
      </Animated.View>

      {/* LOCATION SELECTOR BOTTOM SHEET */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismissArea} 
            activeOpacity={1} 
            onPress={() => setShowLocationModal(false)} 
          />
          <View style={styles.bottomSheetContainer}>
            {/* Header */}
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Select Delivery Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sheetDivider} />

            <ScrollView contentContainerStyle={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
              
              {/* Option 1: Current Location */}
              <TouchableOpacity 
                style={styles.currentLocationOption} 
                onPress={handleGetCurrentLocation}
                disabled={locating}
              >
                <View style={styles.currentLocationLeft}>
                  <Text style={styles.currentLocationPin}>📍</Text>
                  <View>
                    <Text style={styles.currentLocationTitle}>Use Current Location</Text>
                    <Text style={styles.currentLocationSubtitle}>Enable GPS to detect where you are</Text>
                  </View>
                </View>
                {locating ? (
                  <ActivityIndicator size="small" color="#2874f0" />
                ) : (
                  <Text style={styles.chevronRight}>➔</Text>
                )}
              </TouchableOpacity>

              <View style={styles.sheetDivider} />

              {/* Option 2: Saved Addresses */}
              <Text style={styles.savedAddressesTitle}>Saved Addresses</Text>

              {!user ? (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>Log in to select from your saved addresses.</Text>
                  <TouchableOpacity 
                    style={styles.loginBtn}
                    onPress={() => {
                      setShowLocationModal(false);
                      navigation.navigate("Login");
                    }}
                  >
                    <Text style={styles.loginBtnText}>Login Now</Text>
                  </TouchableOpacity>
                </View>
              ) : savedAddresses.length === 0 ? (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>No saved addresses found in your account.</Text>
                  <TouchableOpacity 
                    style={styles.addAddressBtn}
                    onPress={() => {
                      setShowLocationModal(false);
                      navigation.navigate("SavedAddresses");
                    }}
                  >
                    <Text style={styles.addAddressBtnText}>Add Address</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                savedAddresses.map((addr) => {
                  const fullAddrString = `${addr.flat || ""}, ${addr.area || ""}, ${addr.city || ""}`;
                  return (
                    <TouchableOpacity
                      key={addr._id}
                      style={styles.addressCard}
                      onPress={async () => {
                        const label = addr.fullName ? `${addr.fullName} (${addr.city})` : fullAddrString;
                        setSelectedAddress(label);
                        await AsyncStorage.setItem("last_selected_location", label);
                        setShowLocationModal(false);
                      }}
                    >
                      <View style={styles.addressCardLeft}>
                        <Text style={styles.addressHomeIcon}>🏠</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.addressName}>{addr.fullName || "Address"} - <Text style={styles.addressType}>{addr.type || "Home"}</Text></Text>
                          <Text style={styles.addressDetails} numberOfLines={2}>{fullAddrString}</Text>
                          <Text style={styles.addressPhone}>📞 {addr.phone}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}

            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb", paddingHorizontal: spacing.md },
  topSection: { backgroundColor: "#f8f9fb", paddingTop: spacing.xs, zIndex: 999 },
  
  // Welcome section
  welcomeRow: {
    paddingVertical: spacing.xs,
    paddingHorizontal: 2,
    marginBottom: spacing.xs,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
    fontFamily: "Poppins_700Bold",
  },
  welcomeSubtitle: {
    fontSize: 12.5,
    fontFamily: "Poppins_400Regular",
    color: "#7e8392",
    marginTop: 2,
  },

  // Section Headers
  sectionHeader: {
    paddingHorizontal: 2,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#1a1a2e",
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11.5,
    fontFamily: "Poppins_400Regular",
    color: "#8e95a5",
    marginTop: 1,
  },
  resetFilterBtn: {
    fontSize: 12.5,
    fontFamily: "Poppins_600SemiBold",
    color: "#2874f0",
  },

  // Banner
  bannerContainer: { marginVertical: spacing.xs, width: '100%', alignItems: 'center' },
  bannerWrapper: { width: width - spacing.md * 2, height: 165, borderRadius: 18, overflow: 'hidden', elevation: 3, shadowColor: "#2874f0", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 6 },
  bannerImage: { width: '100%', height: '100%' },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },

  // Category pills
  categoryWrapper: { alignItems: "center", marginRight: spacing.md },
  roundCategoryInactive: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eef2f6",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3 
  },
  roundCategoryActive: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: "#2874f0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  categoryText: { 
    marginTop: 8, 
    fontSize: 11.5,
    fontFamily: "Poppins_500Medium",
    color: "#6b7280",
    textAlign: "center"
  },
  categoryTextActive: {
    color: "#2874f0",
    fontFamily: "Poppins_700Bold",
  },

  // Product card
  card: { 
    width: (width - spacing.md * 3) / 2, 
    backgroundColor: "white", 
    borderRadius: 18, 
    padding: spacing.xs, 
    marginBottom: spacing.md, 
    borderWidth: 1.5,
    borderColor: "#f1f3f7",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 155,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f7f8fa",
  },
  image: { width: "100%", height: "100%", borderRadius: 14 },
  cardInfo: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  brandText: {
    fontSize: 9,
    fontFamily: "Poppins_700Bold",
    color: "#9ca3af",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: { 
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#1f2937",
    lineHeight: 18,
  },
  category: { 
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#9ca3af",
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  price: { 
    color: "#2874f0", 
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
  },
  originalPrice: {
    fontSize: 11.5,
    fontFamily: "Poppins_400Regular",
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },

  // Card overlays
  wishlistOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  wishlistEmoji: {
    fontSize: 14,
  },
  ratingOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(26,26,46,0.72)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    color: "white",
    fontSize: 9.5,
    fontFamily: "Poppins_700Bold",
  },
  discountOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ef4444",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: "white",
    fontSize: 9.5,
    fontFamily: "Poppins_700Bold",
  },

  // Empty
  emptyBox: { alignItems: "center", marginTop: spacing.xxl },
  emptyText: { marginTop: spacing.md, ...typography.h5, color: colors.textMuted },
  
  // Error
  errorText: { ...typography.body, color: colors.danger, textAlign: 'center', marginBottom: spacing.md },
  retryButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.md },
  retryText: { ...typography.button, color: colors.surface },

  // Chatbot
  chatBtnWrapper: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 999,
  },
  chatGlowRing: {
    position: "absolute",
    backgroundColor: "rgba(40,116,240,0.4)",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  chatBtn: { 
    backgroundColor: "#2874f0", 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 6,
    shadowColor: "#2874f0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  onlineStatusDot: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#10b981",
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: "white",
  },

  // Location Selector Styles
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  locationPin: {
    fontSize: 15,
    marginRight: 6,
  },
  locationTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: "#6b7280",
  },
  locationValue: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: "#1f2937",
    maxWidth: "80%",
  },
  locationArrow: {
    fontSize: 8,
    color: "#9ca3af",
    marginLeft: 4,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalDismissArea: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "55%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#1f2937",
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 18,
    color: "#9ca3af",
    fontWeight: "bold",
  },
  sheetDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  // Current Location option
  currentLocationOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  currentLocationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLocationPin: {
    fontSize: 20,
    marginRight: 14,
  },
  currentLocationTitle: {
    fontSize: 14.5,
    fontFamily: "Poppins_600SemiBold",
    color: "#2874f0",
  },
  currentLocationSubtitle: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#9ca3af",
    marginTop: 1,
  },
  chevronRight: {
    fontSize: 14,
    color: "#2874f0",
  },

  // Saved Addresses list
  savedAddressesTitle: {
    fontSize: 13,
    fontFamily: "Poppins_700Bold",
    color: "#9ca3af",
    marginTop: 15,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoBox: {
    alignItems: "center",
    paddingVertical: 25,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    marginTop: 5,
  },
  infoText: {
    fontSize: 12.5,
    fontFamily: "Poppins_400Regular",
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  loginBtn: {
    backgroundColor: "#2874f0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginBtnText: {
    color: "white",
    fontSize: 12.5,
    fontFamily: "Poppins_600SemiBold",
  },
  addAddressBtn: {
    backgroundColor: "#2874f0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addAddressBtnText: {
    color: "white",
    fontSize: 12.5,
    fontFamily: "Poppins_600SemiBold",
  },

  // Address card
  addressCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  addressCardLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressHomeIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  addressName: {
    fontSize: 13.5,
    fontFamily: "Poppins_600SemiBold",
    color: "#1e293b",
  },
  addressType: {
    fontSize: 11.5,
    fontFamily: "Poppins_700Bold",
    color: "#2874f0",
    textTransform: "uppercase",
  },
  addressDetails: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#64748b",
    marginTop: 4,
    lineHeight: 16,
  },
  addressPhone: {
    fontSize: 11.5,
    fontFamily: "Poppins_500Medium",
    color: "#475569",
    marginTop: 6,
  },
  stickyBarContainer: {
    height: 46,
    backgroundColor: "#f8f9fb",
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f6",
    paddingVertical: 8,
    zIndex: 1000,
  },
  stickyPill: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stickyPillActive: {
    backgroundColor: "rgba(40, 116, 240, 0.08)",
    borderColor: "#2874f0",
  },
  stickyPillInactive: {
    backgroundColor: "white",
    borderColor: "#e5e7eb",
  },
  stickyPillText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  stickyPillTextActive: {
    color: "#2874f0",
    fontFamily: "Poppins_600SemiBold",
  },
});