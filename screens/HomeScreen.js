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
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import axios from "axios";

const { width } =
  Dimensions.get("window");

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Shoes",
  "Mobiles",
];

const banners = [

  {

    id: "1",

    title: "Latest Smartphones",

    subtitle:
      "Upgrade your tech today",

    button: "Shop Now",

    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

  },

  {

    id: "2",

    title: "Fashion Sale",

    subtitle:
      "Trending styles at best prices",

    button: "Shop Now",

    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",

  },

  {

    id: "3",

    title: "Premium Headphones",

    subtitle:
      "Feel the real sound",

    button: "Shop Now",

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",

  },

  {

    id: "4",

    title: "Gaming Accessories",

    subtitle:
      "Everything for gamers",

    button: "Shop Now",

    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e",

  },

  {

    id: "5",

    title: "Best Running Shoes",

    subtitle:
      "Comfort + Style",

    button: "Shop Now",

    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",

  },

];

export default function HomeScreen({
  navigation,
}) {

  const [products, setProducts] =
    useState([]);

  const [
    filteredProducts,
    setFilteredProducts,
  ] = useState([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [loading, setLoading] =
    useState(true);

  const bannerRef = useRef(null);

  const [
    activeBanner,
    setActiveBanner,
  ] = useState(0);

  useEffect(() => {

    const unsubscribe =
      navigation.addListener(
        "focus",
        () => {

          fetchProducts();

        }
      );

    return unsubscribe;

  }, [navigation]);

  useEffect(() => {

    const interval = setInterval(() => {

      let nextIndex =
        activeBanner + 1;

      if (
        nextIndex >= banners.length
      ) {

        nextIndex = 0;

      }

      bannerRef.current?.scrollToIndex({

        index: nextIndex,

        animated: true,

      });

      setActiveBanner(nextIndex);

    }, 3000);

    return () =>
      clearInterval(interval);

  }, [activeBanner]);

  const fetchProducts = async () => {

    try {

      const response =
        await axios.get(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/products"

        );

      setProducts(response.data);

      setFilteredProducts(
        response.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const filterProducts = (
    searchText,
    category
  ) => {

    let filtered = products;

    if (category !== "All") {

      filtered = filtered.filter(

        (item) =>

          item.category
            .toLowerCase()
            .includes(
              category.toLowerCase()
            )

      );

    }

    if (searchText) {

      filtered = filtered.filter(

        (item) =>

          item.name
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            )

      );

    }

    setFilteredProducts(filtered);

  };

  const handleSearch = (text) => {

    setSearch(text);

    filterProducts(
      text,
      selectedCategory
    );

  };

  const handleCategory = (
    category
  ) => {

    setSelectedCategory(
      category
    );

    filterProducts(
      search,
      category
    );

  };

  if (loading) {

    return (

      <SafeAreaView
        style={styles.loader}
      >

        <ActivityIndicator
          size="large"
          color="#e94560"
        />

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      style={styles.container}
    >

      <FlatList

        data={filteredProducts}

        keyExtractor={(item) =>
          item._id
        }

        numColumns={2}

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingBottom: 120,
        }}

        columnWrapperStyle={{
          justifyContent:
            "space-between",
        }}

        ListHeaderComponent={

          <>

            <View
              style={styles.topBar}
            >

              <Image

                source={require("../assets/logo.png")}

                style={
                  styles.logoImage
                }

              />

              <View
                style={
                  styles.rightIcons
                }
              >

                <TouchableOpacity
                  style={
                    styles.iconButton
                  }
                >

                  <Ionicons
                    name="notifications-outline"
                    size={26}
                    color="#1a1a2e"
                  />

                </TouchableOpacity>

                <TouchableOpacity

                  style={
                    styles.iconButton
                  }

                  onPress={() =>
                    navigation.navigate(
                      "Wishlist"
                    )
                  }

                >

                  <Ionicons
                    name="heart-outline"
                    size={26}
                    color="#e94560"
                  />

                </TouchableOpacity>

              </View>

            </View>

            <View
              style={
                styles.searchContainer
              }
            >

              <Ionicons
                name="search"
                size={22}
                color="#999"
              />

              <TextInput

                placeholder="Search for products..."

                placeholderTextColor="#999"

                style={
                  styles.searchInput
                }

                value={search}

                onChangeText={
                  handleSearch
                }

              />

            </View>

            <ScrollView

              horizontal

              showsHorizontalScrollIndicator={
                false
              }

              style={
                styles.categoryContainer
              }

            >

              {categories.map(
                (category) => (

                  <TouchableOpacity

                    key={category}

                    style={[

                      styles.categoryButton,

                      selectedCategory ===
                      category &&

                      styles.activeCategory,

                    ]}

                    onPress={() =>
                      handleCategory(
                        category
                      )
                    }

                  >

                    <Text

                      style={[

                        styles.categoryText,

                        selectedCategory ===
                        category && {

                          color:
                            "white",

                        },

                      ]}

                    >

                      {category}

                    </Text>

                  </TouchableOpacity>

                )
              )}

            </ScrollView>

            <FlatList

              ref={bannerRef}

              data={banners}

              horizontal

              pagingEnabled

              snapToInterval={width - 15}

              snapToAlignment="start"

              decelerationRate="fast"
              showsHorizontalScrollIndicator={
                false
              }

              keyExtractor={(item) =>
                item.id
              }

              style={
                styles.bannerContainer
              }

              onMomentumScrollEnd={(
                event
              ) => {

                const index =
                  Math.round(

                    event.nativeEvent
                      .contentOffset.x /
                    (width - 35)

                  );

                setActiveBanner(
                  index
                );

              }}

              renderItem={({
                item,
              }) => (

                <View
                  style={
                    styles.modernBanner
                  }
                >

                  <View
                    style={
                      styles.bannerLeft
                    }
                  >

                    <Text
                      style={
                        styles.bannerTitle
                      }
                    >

                      {item.title}

                    </Text>

                    <Text
                      style={
                        styles.bannerSubtitle
                      }
                    >

                      {item.subtitle}

                    </Text>

                    <TouchableOpacity
                      style={
                        styles.shopButton
                      }
                    >

                      <Text
                        style={
                          styles.shopButtonText
                        }
                      >

                        {item.button}

                      </Text>

                    </TouchableOpacity>

                  </View>

                  <Image

                    source={{
                      uri: item.image,
                    }}

                    style={
                      styles.bannerImage
                    }

                  />

                </View>

              )}

            />

          </>

        }

        renderItem={({ item }) => (

          <TouchableOpacity

            style={styles.gridCard}

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

              style={styles.gridImage}

            />

            <Text

              numberOfLines={1}

              style={styles.gridName}

            >

              {item.name}

            </Text>

            <Text
              style={
                styles.gridCategory
              }
            >

              {item.category}

            </Text>

            <Text
              style={styles.gridPrice}
            >

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

    backgroundColor: "#f7f7f7",

    paddingHorizontal: 15,

  },

  loader: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#fff",

  },

  topBar: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 10,

    marginBottom: 20,

  },

  logoImage: {

    width: 190,

    height: 60,

    resizeMode: "contain",

  },

  rightIcons: {

    flexDirection: "row",

    alignItems: "center",

  },

  iconButton: {

    marginLeft: 15,

  },

  searchContainer: {

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "white",

    borderRadius: 18,

    paddingHorizontal: 15,

    height: 58,

    marginBottom: 18,

    elevation: 3,

  },

  searchInput: {

    flex: 1,

    marginLeft: 10,

    fontSize: 16,

    color: "#1a1a2e",

  },

  categoryContainer: {

    marginBottom: 20,

  },

  categoryButton: {

    backgroundColor: "white",

    paddingVertical: 11,

    paddingHorizontal: 20,

    borderRadius: 30,

    marginRight: 10,

    elevation: 2,

  },

  activeCategory: {

    backgroundColor: "#e94560",

  },

  categoryText: {

    fontWeight: "600",

    color: "#1a1a2e",

  },

  bannerContainer: {

    marginBottom: 25,

  },

  modernBanner: {

    width: width - 30,

    height: 210,

    backgroundColor: "#1a1a2e",

    borderRadius: 28,

    marginRight: 15,

    padding: 22,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    elevation: 6,

  },

  bannerLeft: {

    flex: 1,

  },

  bannerTitle: {

    fontSize: 26,

    fontWeight: "bold",

    color: "white",

  },

  bannerSubtitle: {

    fontSize: 15,

    color: "#ddd",

    marginTop: 8,

    marginBottom: 18,

  },

  shopButton: {

    backgroundColor: "#e94560",

    paddingVertical: 12,

    paddingHorizontal: 20,

    borderRadius: 14,

    alignSelf: "flex-start",

  },

  shopButtonText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 15,

  },

  bannerImage: {

    width: 125,

    height: 125,

    borderRadius: 20,

    resizeMode: "cover",

  },

  gridCard: {

    width: (width - 42) / 2,

    backgroundColor: "white",

    borderRadius: 22,

    padding: 10,

    marginBottom: 18,

    elevation: 4,

  },

  gridImage: {

    width: "100%",

    height: 170,

    borderRadius: 18,

    resizeMode: "cover",

  },

  gridName: {

    fontSize: 16,

    fontWeight: "bold",

    marginTop: 10,

    color: "#1a1a2e",

  },

  gridCategory: {

    fontSize: 13,

    color: "gray",

    marginTop: 4,

  },

  gridPrice: {

    fontSize: 18,

    color: "#e94560",

    fontWeight: "bold",

    marginTop: 8,

  },

});