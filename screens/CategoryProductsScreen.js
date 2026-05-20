import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import axios from "axios";

export default function CategoryProductsScreen({

  route,
  navigation,

}) {

  const {
    category,
  } = route.params;

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        setLoading(true);

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

        console.log(

          error.response?.data ||

          error.message

        );

      } finally {

        setLoading(false);

      }

    };

  const renderItem =
    ({ item }) => (

      <TouchableOpacity

        activeOpacity={0.92}

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

        {/* IMAGE CONTAINER */}

        <View
          style={styles.imageContainer}
        >

          <Image

            source={{
              uri:
                item.image,
            }}

            style={styles.image}

          />

          {/* DISCOUNT */}

          <View
            style={styles.discountBadge}
          >

            <Image
              source={require("../assets/icons/home.png")}
              style={{
                width: 12,
                height: 12,
                tintColor: "white",
                resizeMode: "contain",
                marginRight: 4,
              }}
            />

            <Text
              style={
                styles.discountText
              }
            >

              40% OFF

            </Text>

          </View>

          {/* WISHLIST */}

          <TouchableOpacity
            style={
              styles.wishlistBtn
            }
          >

            <Image
              source={require("../assets/icons/empty-wishlist.png")}
              style={{
                width: 18,
                height: 18,
                tintColor: "#111",
                resizeMode: "contain",
              }}
            />

          </TouchableOpacity>

        </View>

        {/* DETAILS */}

        <View
          style={styles.details}
        >

          {/* NAME */}

          <Text

            numberOfLines={2}

            style={styles.name}

          >

            {item.name}

          </Text>

          {/* RATING */}

          <View
            style={styles.ratingRow}
          >

            <Image
              source={require("../assets/icons/star.png")}
              style={{
                width: 14,
                height: 14,
                tintColor: "#ffb300",
                resizeMode: "contain",
              }}
            />

            <Text
              style={
                styles.ratingText
              }
            >

              4.5

            </Text>

            <Text
              style={
                styles.reviewText
              }
            >

              (2.1k)

            </Text>

          </View>

          {/* PRICE */}

          <View
            style={styles.priceRow}
          >

            <Text
              style={styles.price}
            >

              ₹ {item.price}

            </Text>

            <Text
              style={
                styles.oldPrice
              }
            >

              ₹ {item.price + 800}

            </Text>

          </View>

          {/* CATEGORY */}

          <View
            style={
              styles.categoryBox
            }
          >

            <Text
              style={
                styles.categoryText
              }
            >

              {item.category}

            </Text>

          </View>

          {/* ADD TO CART */}

          <TouchableOpacity
            style={
              styles.cartButton
            }
          >

            <Image
              source={require("../assets/icons/cart.png")}
              style={{
                width: 18,
                height: 18,
                tintColor: "white",
                resizeMode: "contain",
              }}
            />

            <Text
              style={
                styles.cartText
              }
            >

              Add

            </Text>

          </TouchableOpacity>

        </View>

      </TouchableOpacity>

    );

  return (

    <View
      style={styles.container}
    >

      {/* HEADER */}

      <View
        style={styles.header}
      >

        <View>

          <Text
            style={styles.heading}
          >

            {category}

          </Text>

          <Text
            style={styles.subHeading}
          >

            Discover premium products

          </Text>

        </View>

        <View
          style={styles.productCount}
        >

          <Text
            style={
              styles.productCountText
            }
          >

            {

              products.length

            } Items

          </Text>

        </View>

      </View>

      {/* PRODUCTS */}

      {

        products.length ===
          0 ? (

          <View
            style={
              styles.emptyContainer
            }
          >

            <Image
              source={require("../assets/icons/no-results.png")}
              style={{
                width: 100,
                height: 100,
                tintColor: "#ccc",
                resizeMode: "contain",
              }}
            />

            <Text
              style={
                styles.emptyText
              }
            >

              No Products Found

            </Text>

          </View>

        ) : (

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

            columnWrapperStyle={{
              justifyContent:
                "space-between",
            }}

            contentContainerStyle={{
              paddingBottom: 120,
            }}

            renderItem={
              renderItem
            }

          />

        )

      }

    </View>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#f4f6fb",

      paddingHorizontal: 15,

      paddingTop: 10,

    },

    header: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: 22,

    },

    heading: {

      fontSize: 34,

      fontWeight: "bold",

      color: "#111",

    },

    subHeading: {

      color: "gray",

      marginTop: 6,

      fontSize: 14,

    },

    productCount: {

      backgroundColor:
        "#2874f0",

      paddingHorizontal: 16,

      paddingVertical: 10,

      borderRadius: 30,

    },

    productCountText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 13,

    },

    card: {

      width: "48%",

      backgroundColor: "#fff",

      borderRadius: 28,

      marginBottom: 22,

      overflow: "hidden",

      elevation: 6,

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.08,

      shadowRadius: 10,

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

      top: 12,

      left: 12,

      backgroundColor:
        "#ff3b30",

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 20,

    },

    discountText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 11,

    },

    wishlistBtn: {

      position: "absolute",

      top: 12,

      right: 12,

      backgroundColor:
        "white",

      width: 36,

      height: 36,

      borderRadius: 18,

      justifyContent:
        "center",

      alignItems: "center",

      elevation: 4,

    },

    details: {

      padding: 14,

    },

    name: {

      fontSize: 15,

      fontWeight: "700",

      color: "#111",

      lineHeight: 22,

      minHeight: 48,

    },

    ratingRow: {

      flexDirection: "row",

      alignItems: "center",

      marginTop: 10,

    },

    ratingText: {

      marginLeft: 5,

      fontWeight: "bold",

      color: "#111",

      fontSize: 13,

    },

    reviewText: {

      marginLeft: 5,

      color: "gray",

      fontSize: 12,

    },

    priceRow: {

      flexDirection: "row",

      alignItems: "center",

      marginTop: 12,

    },

    price: {

      fontSize: 21,

      fontWeight: "bold",

      color: "#2874f0",

    },

    oldPrice: {

      marginLeft: 8,

      color: "gray",

      fontSize: 13,

      textDecorationLine:
        "line-through",

    },

    categoryBox: {

      backgroundColor:
        "#eef4ff",

      alignSelf:
        "flex-start",

      marginTop: 14,

      paddingHorizontal: 14,

      paddingVertical: 7,

      borderRadius: 30,

    },

    categoryText: {

      color: "#2874f0",

      fontWeight: "700",

      fontSize: 11,

      letterSpacing: 0.5,

    },

    cartButton: {

      marginTop: 16,

      backgroundColor:
        "#2874f0",

      borderRadius: 16,

      paddingVertical: 11,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

    },

    cartText: {

      color: "white",

      fontWeight: "bold",

      marginLeft: 8,

      fontSize: 14,

    },

    emptyContainer: {

      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: 120,

    },

    emptyText: {

      fontSize: 22,

      color: "gray",

      fontWeight: "bold",

      marginTop: 18,

    },

  });