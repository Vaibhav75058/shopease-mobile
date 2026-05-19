import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import axios from "axios";

import Ionicons
  from "@expo/vector-icons/Ionicons";

export default function CategoriesScreen({

  navigation,

}) {

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    products,
    setProducts,
  ] = useState([]);

  /* FETCH CATEGORIES */

  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories =
    async () => {

      try {

        const res =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/products/categories/all"

          );

        setCategories(
          res.data
        );

        if (
          res.data.length > 0
        ) {

          setSelectedCategory(
            res.data[0]
          );

          fetchProducts(
            res.data[0]
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  /* FETCH PRODUCTS */

  const fetchProducts =
    async (category) => {

      try {

        const response =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/products"

          );

        const filtered =
          response.data.filter(

            (item) =>

              item.category
                ?.toLowerCase()

                ===

              category
                ?.toLowerCase()

          );

        setProducts(
          filtered
        );

      } catch (error) {

        console.log(error);

      }

    };

  /* CATEGORY CLICK */

  const handleCategory =
    (category) => {

      setSelectedCategory(
        category
      );

      fetchProducts(
        category
      );

    };

  /* CATEGORY IMAGE */

  const getCategoryImage =
    (category) => {

      const lower =
        category.toLowerCase();

      if (
        lower.includes(
          "fashion"
        )
      ) {

        return "https://cdn-icons-png.flaticon.com/512/892/892458.png";

      }

      if (
        lower.includes(
          "electronics"
        )
      ) {

        return "https://cdn-icons-png.flaticon.com/512/3659/3659898.png";

      }

      if (
        lower.includes(
          "beauty"
        )
      ) {

        return "https://cdn-icons-png.flaticon.com/512/3163/3163203.png";

      }

      if (
        lower.includes(
          "health"
        )
      ) {

        return "https://cdn-icons-png.flaticon.com/512/2966/2966486.png";

      }

      if (
        lower.includes(
          "home"
        )
      ) {

        return "https://cdn-icons-png.flaticon.com/512/1046/1046857.png";

      }

      return "https://cdn-icons-png.flaticon.com/512/3081/3081559.png";

    };

  return (

    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >

      {/* HEADER */}

      <View
        style={styles.header}
      >

        <Text
          style={styles.heading}
        >

          All Categories

        </Text>

        <View
          style={styles.icons}
        >

          <Ionicons

            name="search"

            size={28}

            color="#111"

          />

          <Ionicons

            name="camera"

            size={28}

            color="#111"

            style={{
              marginLeft: 18,
            }}

          />

        </View>

      </View>

      <View
        style={styles.main}
      >

        {/* SIDEBAR */}

        <View
          style={styles.sidebar}
        >

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >

            {

              categories.map(
                (
                  item,
                  index
                ) => (

                  <TouchableOpacity

                    key={index}

                    style={[

                      styles.categoryItem,

                      selectedCategory ===
                        item &&

                      styles.activeCategory,

                    ]}

                    onPress={() =>
                      handleCategory(
                        item
                      )
                    }

                  >

                    <Image

                      source={{
                        uri:
                          getCategoryImage(
                            item
                          ),
                      }}

                      style={
                        styles.categoryImage
                      }

                    />

                    <Text

                      style={[

                        styles.categoryText,

                        selectedCategory ===
                          item && {

                          color:
                            "#2874f0",

                          fontWeight:
                            "bold",

                        },

                      ]}

                    >

                      {item}

                    </Text>

                  </TouchableOpacity>

                )
              )

            }

          </ScrollView>

        </View>

        {/* RIGHT CONTENT */}

        <View
          style={styles.content}
        >

          {/* BANNER */}

          <View
            style={styles.banner}
          >

            <View>

              <Text
                style={
                  styles.bannerTitle
                }
              >

                {
                  selectedCategory
                }

              </Text>

              <TouchableOpacity

                style={
                  styles.shopNow
                }

              >

                <Ionicons

                  name="arrow-forward"

                  size={18}

                  color="white"

                />

              </TouchableOpacity>

            </View>

            <Image

              source={{
                uri:
                  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",

              }}

              style={
                styles.bannerImage
              }

            />

          </View>

          {/* PRODUCTS */}

          <Text
            style={
              styles.sectionTitle
            }
          >

            Products

          </Text>

          <FlatList

            data={products}

            keyExtractor={(
              item
            ) =>
              item._id
            }

            numColumns={2}

            showsVerticalScrollIndicator={
              false
            }

            contentContainerStyle={{
              paddingBottom: 220,
            }}

            columnWrapperStyle={{
              justifyContent:
                "space-between",
            }}

            renderItem={({
              item,
            }) => (

              <TouchableOpacity

                style={
                  styles.productCard
                }

                onPress={() =>

                  navigation.navigate(

                    "ProductDetails",

                    {
                      product:
                        item,
                    }

                  )

                }

              >

                <Image

                  source={{
                    uri:
                      item.image,
                  }}

                  style={
                    styles.productImage
                  }

                />

                <Text

                  numberOfLines={2}

                  style={
                    styles.productName
                  }

                >

                  {item.name}

                </Text>

                <Text
                  style={
                    styles.productPrice
                  }
                >

                  ₹ {item.price}

                </Text>

              </TouchableOpacity>

            )}

          />

        </View>

      </View>

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#fff",

      paddingTop: 5,

    },

    /* HEADER */

    header: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      paddingHorizontal: 18,

      paddingTop: 12,

      paddingBottom: 16,

      backgroundColor:
        "white",

    },

    heading: {

      fontSize: 22,

      fontWeight: "bold",

      color: "#111",

    },

    icons: {

      flexDirection: "row",

      alignItems: "center",

    },

    /* MAIN */

    main: {

      flex: 1,

      flexDirection: "row",

    },

    /* SIDEBAR */

    sidebar: {

      width: 95,

      backgroundColor:
        "#f5f6fa",

      borderRightWidth: 1,

      borderRightColor:
        "#eee",

    },

    categoryItem: {

      alignItems: "center",

      paddingVertical: 16,

      borderBottomWidth: 1,

      borderBottomColor:
        "#eee",

    },

    activeCategory: {

      backgroundColor:
        "white",

      borderLeftWidth: 4,

      borderLeftColor:
        "#2874f0",

    },

    categoryImage: {

      width: 52,

      height: 52,

      borderRadius: 30,

      resizeMode:
        "contain",

      marginBottom: 10,

      backgroundColor:
        "#eef4ff",

    },

    categoryText: {

      fontSize: 13,

      textAlign: "center",

      color: "#666",

      paddingHorizontal: 4,

    },

    /* RIGHT */

    content: {

      flex: 1,

      padding: 15,

    },

    /* BANNER */

    banner: {

      backgroundColor:
        "#eef3ff",

      borderRadius: 24,

      padding: 18,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: 25,

    },

    bannerTitle: {

      fontSize: 28,

      fontWeight: "bold",

      color: "#111",

    },

    shopNow: {

      width: 40,

      height: 40,

      borderRadius: 20,

      backgroundColor:
        "#111",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: 14,

    },

    bannerImage: {

      width: 110,

      height: 110,

      borderRadius: 18,

    },

    /* PRODUCTS */

    sectionTitle: {

      fontSize: 20,

      fontWeight: "bold",

      marginBottom: 18,

      color: "#111",

    },

    productCard: {

      width: "48%",

      marginBottom: 18,

    },

    productImage: {

      width: "100%",

      height: 135,

      borderRadius: 18,

      backgroundColor:
        "#f4f4f4",

    },

    productName: {

      fontSize: 14,

      fontWeight: "600",

      color: "#111",

      marginTop: 10,

      minHeight: 38,

    },

    productPrice: {

      fontSize: 17,

      fontWeight: "bold",

      color: "#2874f0",

      marginTop: 6,

    },

  });