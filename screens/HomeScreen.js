import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View, Text, FlatList, StyleSheet, Image,
  TouchableOpacity, Dimensions, ActivityIndicator, ScrollView,
} from "react-native";
import axios from "axios";
import Header from "../src/components/Header";
import SearchBar from "../src/components/SearchBar";

const { width } = Dimensions.get("window");

const FLIPKART_BANNERS = [
  { id: "1", image: require('../assets/banners/electronics.png'), category: "Electronics" },
  { id: "2", image: require('../assets/banners/fashion.png'),     category: "Fashion" },
  { id: "3", image: require('../assets/banners/health.png'),      category: "Health" },
  { id: "4", image: require('../assets/banners/home.png'),        category: "Home" },
  { id: "5", image: require('../assets/banners/skincare.png'),    category: "Beauty" },
];

export default function HomeScreen({ navigation }) {

  const [products, setProducts]               = useState([]);
  const [search, setSearch]                   = useState("");
  const [loading, setLoading]                 = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Banner auto-scroll
  const bannerFlatListRef      = useRef(null);
  const currentBannerIndexRef  = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Auto-scroll banner
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentBannerIndexRef.current + 1;
      if (nextIndex >= FLIPKART_BANNERS.length) nextIndex = 0;
      currentBannerIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      bannerFlatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://e-commerce-mern-stack-0okr.onrender.com/api/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.log("fetchProducts error:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#2874f0" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* STICKY TOP SECTION */}
      <View style={styles.topSection}>
        <Header />
        <SearchBar search={search} setSearch={setSearch} />

        {/* ROUND CATEGORY PILLS — DB images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 15 }}
        >
          {dynamicCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryWrapper}
              onPress={() => setSelectedCategory(item.name)}
            >
              <View
                style={[
                  styles.roundCategory,
                  { backgroundColor: selectedCategory === item.name ? "#2874f0" : "white" },
                ]}
              >
                {/* DB image hai toh uri use karo, warna fallback icon */}
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      resizeMode: "cover",
                    }}
                  />
                ) : (
                  <Image
                    source={require("../assets/icons/categories.png")}
                    style={{
                      width: 26,
                      height: 26,
                      tintColor: selectedCategory === item.name ? "white" : "#111",
                      resizeMode: "contain",
                    }}
                  />
                )}
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PRODUCTS LIST */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 120 }}

        ListHeaderComponent={
          <View style={styles.bannerContainer}>
            <FlatList
              ref={bannerFlatListRef}
              data={FLIPKART_BANNERS}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              getItemLayout={(_, index) => ({
                length: width - 30,
                offset: (width - 30) * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (width - 30)
                );
                currentBannerIndexRef.current = index;
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.bannerWrapper}
                  onPress={() => setSelectedCategory(item.category)}
                >
                  <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
                </TouchableOpacity>
              )}
            />
            {/* DOT INDICATORS */}
            <View style={styles.dotContainer}>
              {FLIPKART_BANNERS.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: activeIndex === index ? "#2874f0" : "#ccc" },
                  ]}
                />
              ))}
            </View>
          </View>
        }

        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Image
              source={require("../assets/icons/no-results.png")}
              style={{ width: 80, height: 80, tintColor: "#ccc", resizeMode: "contain" }}
            />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ProductDetails", { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category?.name}</Text>
            <Text style={styles.price}>₹ {item.price}</Text>
          </TouchableOpacity>
        )}
      />

      {/* CHATBOT FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.chatBtn}
        onPress={() => navigation.navigate('ChatBot')}
      >
        <Image
          source={require("../assets/icons/chat-bubble.png")}
          style={{ width: 28, height: 28, tintColor: "white", resizeMode: "contain" }}
        />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: "#f5f7fb", paddingHorizontal: 15 },
  topSection:      { backgroundColor: "#f5f7fb", paddingTop: 5, zIndex: 999 },
  loader:          { flex: 1, justifyContent: "center", alignItems: "center" },

  // Banner
  bannerContainer: { marginVertical: 10, width: '100%', alignItems: 'center' },
  bannerWrapper:   { width: width - 30, height: 170, borderRadius: 14, overflow: 'hidden' },
  bannerImage:     { width: '100%', height: '100%' },
  dotContainer:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  dot:             { width: 6, height: 6, borderRadius: 3, marginHorizontal: 4 },

  // Category pills
  categoryWrapper: { alignItems: "center", marginRight: 18 },
  roundCategory:   { width: 58, height: 58, borderRadius: 29, justifyContent: "center", alignItems: "center", elevation: 3 },
  categoryText:    { marginTop: 8, fontWeight: "500", color: "#111", fontSize: 12 },

  // Product card
  card:            { width: (width - 40) / 2, backgroundColor: "white", borderRadius: 18, padding: 10, marginBottom: 16, elevation: 3 },
  image:           { width: "100%", height: 160, borderRadius: 14, resizeMode: "cover" },
  name:            { fontSize: 16, fontWeight: "bold", marginTop: 10, color: "#111" },
  category:        { color: "gray", marginTop: 4 },
  price:           { color: "#2874f0", fontWeight: "bold", fontSize: 18, marginTop: 8 },

  // Empty
  emptyBox:        { alignItems: "center", marginTop: 60 },
  emptyText:       { marginTop: 18, fontSize: 22, fontWeight: "bold", color: "#999" },

  // Chatbot
  chatBtn:         { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#2874f0', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 10, zIndex: 999 },
});