import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import axios from "axios";

import Header
  from "../src/components/Header";

import SearchBar
  from "../src/components/SearchBar";

import Ionicons
  from "@expo/vector-icons/Ionicons";

const { width } =
  Dimensions.get("window");

// BANNERS WITH LOCAL ASSETS & CLICKABLE CATEGORIES
// Note: Path '../assets/' ya '../../assets/' apne folder structure ke hisaab se adjust kar lena
const FLIPKART_BANNERS = [
  { 
    id: "1", 
    image: require('../assets/banners/electronics.png'),
    category: "Electronics" // Ye naam aapke DB ki category se match hona chahiye
  },
  { 
    id: "2", 
    image: require('../assets/banners/fashion.png'),
    category: "Fashion" 
  },
  { 
    id: "3", 
    image: require('../assets/banners/health.png'),
    category: "Health" 
  },
  { 
    id: "4", 
    image: require('../assets/banners/home.png'),
    category: "Home" 
  },
  { 
    id: "5", 
    image: require('../assets/banners/skincare.png'),
    category: "Beauty" // Agar DB me skincare hai toh yahan "Skincare" likh dena
  }
];

export default function HomeScreen({
  navigation,
}) {

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  // PERFECT AUTO-SCROLL REFERENCES
  const bannerFlatListRef = useRef(null);
  const currentBannerIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0); 

  useEffect(() => {

    fetchProducts();

  }, []);

  // BUG-FREE AUTOMATIC BANNER SCROLL LOGIC
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentBannerIndexRef.current + 1;
      
      if (nextIndex >= FLIPKART_BANNERS.length) {
        nextIndex = 0;
      }
      
      currentBannerIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      bannerFlatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

    }, 3000); 

    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {

    try {

      const response =
        await axios.get(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/products"

        );

      setProducts(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* AUTO DATABASE CATEGORIES */

  const dynamicCategories = [

    "All",

    ...new Set(

      products.map(
        (item) =>
          item.category
      )

    ),

  ];

  /* FILTER PRODUCTS */

  let filteredProducts =
    [...products];

  /* CATEGORY FILTER */

  if (
    selectedCategory !==
    "All"
  ) {

    filteredProducts =
      filteredProducts.filter(
        (item) =>

          item.category
            ?.toLowerCase()

            ===

          selectedCategory
            .toLowerCase()
      );

  }

  /* SEARCH FILTER */

  filteredProducts =
    filteredProducts.filter(
      (item) =>

        item.name
          .toLowerCase()

          .includes(
            search.toLowerCase()
          ) ||

        item.category
          .toLowerCase()

          .includes(
            search.toLowerCase()
          )
    );

  if (loading) {

    return (

      <SafeAreaView
        style={styles.loader}
      >

        <ActivityIndicator
          size="large"
          color="#2874f0"
        />

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      style={styles.container}
    >

      {/* STICKY SECTION */}

      <View
        style={styles.topSection}
      >

        <Header />

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        {/* ROUND CATEGORIES */}

        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={
            false
          }

          style={{
            marginBottom: 15,
          }}

        >

          {dynamicCategories.map(
            (
              item,
              index
            ) => (

              <TouchableOpacity

                key={index}

                style={
                  styles.categoryWrapper
                }

                onPress={() =>
                  setSelectedCategory(
                    item
                  )
                }

              >

                <View

                  style={[

                    styles.roundCategory,

                    {

                      backgroundColor:

                        selectedCategory ===
                        item

                          ? "#2874f0"

                          : "white",

                    },

                  ]}

                >

                  <Ionicons

                    name={

                      item
                        .toLowerCase()

                        .includes(
                          "fashion"
                        )

                        ? "shirt-outline"

                        : item
                            .toLowerCase()

                            .includes(
                              "mobile"
                            )

                        ? "phone-portrait-outline"

                        : item
                            .toLowerCase()

                            .includes(
                              "beauty"
                            )

                        ? "sparkles-outline"

                        : item
                            .toLowerCase()

                            .includes(
                              "electronics"
                            )

                        ? "tv-outline"

                        : item
                            .toLowerCase()

                            .includes(
                              "shoe"
                            )

                        ? "walk-outline"

                        : "grid-outline"

                    }

                    size={26}

                    color={

                      selectedCategory ===
                      item

                        ? "white"

                        : "#111"

                    }

                  />

                </View>

                <Text
                  style={
                    styles.categoryText
                  }
                >

                  {item}

                </Text>

              </TouchableOpacity>

            )
          )}

        </ScrollView>

      </View>

      {/* PRODUCTS LIST */}

      <FlatList

        data={filteredProducts}

        keyExtractor={(item) =>
          item._id
        }

        numColumns={2}

        showsVerticalScrollIndicator={
          false
        }

        columnWrapperStyle={{
          justifyContent:
            "space-between",
        }}

        contentContainerStyle={{
          paddingBottom: 120,
        }}

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
                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 30));
                currentBannerIndexRef.current = index;
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                // YAHAN VIEW KO HATAKAR TOUCHABLE OPACITY KAR DIYA HAI
                <TouchableOpacity 
                  activeOpacity={0.9} // Click ka halka sa feel aane ke liye
                  style={styles.bannerWrapper}
                  onPress={() => setSelectedCategory(item.category)} // Click krte hi category filter hogi
                >
                  <Image
                    source={item.image} // 'uri' Hata kar direct source diya local ke liye
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
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

          <View
            style={styles.emptyBox}
          >

            <Ionicons
              name="search"
              size={80}
              color="#ccc"
            />

            <Text style={styles.emptyText}>
              No products found
            </Text>

          </View>

        }

        renderItem={({ item }) => (

          <TouchableOpacity

            style={styles.card}

            onPress={() =>

              navigation.navigate(

                "ProductDetails",

                {
                  product: item,
                }

              )

            }

          >

            <Image

              source={{
                uri: item.image,
              }}

              style={styles.image}

            />

            <Text
              numberOfLines={1}
              style={styles.name}
            >

              {item.name}

            </Text>

            <Text style={styles.category}>
              {item.category}
            </Text>

            <Text style={styles.price}>
              ₹ {item.price}
            </Text>

          </TouchableOpacity>

        )}

      />

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#f5f7fb",

    paddingHorizontal: 15,

  },

  topSection: {

    backgroundColor: "#f5f7fb",

    paddingTop: 5,

    zIndex: 999,

  },

  bannerContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },

  bannerWrapper: {
    width: width - 30, // Screen width minus padding
    height: 170,       // Fixed ratio for all banners
    borderRadius: 14,
    overflow: 'hidden',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
  },

  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },

  loader: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

  },

  card: {

    width: (width - 40) / 2,

    backgroundColor: "white",

    borderRadius: 18,

    padding: 10,

    marginBottom: 16,

    elevation: 3,

  },

  image: {

    width: "100%",

    height: 160,

    borderRadius: 14,

    resizeMode: "cover",

  },

  name: {

    fontSize: 16,

    fontWeight: "bold",

    marginTop: 10,

    color: "#111",

  },

  category: {

    color: "gray",

    marginTop: 4,

  },

  price: {

    color: "#2874f0",

    fontWeight: "bold",

    fontSize: 18,

    marginTop: 8,

  },

  emptyBox: {

    alignItems: "center",

    marginTop: 60,

  },

  emptyText: {

    marginTop: 18,

    fontSize: 22,

    fontWeight: "bold",

    color: "#999",

  },

  categoryWrapper: {

    alignItems: "center",

    marginRight: 18,

  },

  roundCategory: {

    width: 58,

    height: 58,

    borderRadius: 50,

    justifyContent: "center",

    alignItems: "center",

    elevation: 3,

  },

  categoryText: {

    marginTop: 8,

    fontWeight: "500",

    color: "#111",

    fontSize: 12,

  },

});