import React, {
  useState,
} from "react";

import AwesomeAlert
  from "react-native-awesome-alerts";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useWishlist,
} from "../src/context/WishlistContext";

import {
  useCart,
} from "../src/context/CartContext";

export default function ProductDetailsScreen({

  route,
  navigation,

}) {

  const {
    product,
  } = route.params;

  const cart =
    useCart();

  const addToCart =
    cart?.addToCart;

  const wishlist =
    useWishlist();

  const addToWishlist =
    wishlist?.addToWishlist;

  const [
    showWishlistAlert,
    setShowWishlistAlert,
  ] = useState(false);

  const [
    showCartAlert,
    setShowCartAlert,
  ] = useState(false);

  /* ADD TO CART */

  const handleAddToCart =
    () => {

      addToCart(product);

      setShowCartAlert(true);

      setTimeout(() => {

        setShowCartAlert(false);

      }, 1800);

    };

  /* WISHLIST */

  const handleWishlist =
    () => {

      addToWishlist(product);

      setShowWishlistAlert(
        true
      );

      setTimeout(() => {

        setShowWishlistAlert(
          false
        );

      }, 1800);

    };

  return (

    <SafeAreaView
      edges={["top"]}
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* IMAGE SECTION */}

        <View
          style={
            styles.imageContainer
          }
        >

          <Image

            source={{
              uri:
                product.image,
            }}

            style={styles.image}

          />

          {/* BACK */}

          <TouchableOpacity

            style={styles.backBtn}

            onPress={() =>
              navigation.goBack()
            }

          >

            <Image
              source={require("../assets/icons/back-arrow.png")}
              style={{
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />

          </TouchableOpacity>

          {/* WISHLIST */}

          <TouchableOpacity

            style={
              styles.wishlistBtn
            }

            onPress={
              handleWishlist
            }

          >

            <Image
              source={require("../assets/icons/wish-list.png")}
              style={{
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />

          </TouchableOpacity>

        </View>

        {/* INFO */}

        <View
          style={
            styles.infoContainer
          }
        >

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

              
              {product.category?.name || "Uncategorized"}

            </Text>

          </View>

          {/* NAME */}

          <Text
            style={styles.name}
          >

            {product.name}

          </Text>

          {/* RATING */}

          <View
            style={
              styles.ratingRow
            }
          >

            <View
              style={
                styles.ratingBox
              }
            >

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={styles.rating}
                >
                  {product.rating}
                </Text>

                <Image
                  source={require("../assets/icons/star.png")}
                  style={{
                    width: 14,
                    height: 14,
                    // tintColor: "white",
                    resizeMode: "contain",
                    marginLeft: 4,
                  }}
                />
              </View>

            </View>

            <Text
              style={
                styles.ratingText
              }
            >

              {product.numReviews + " "}
              Ratings & Reviews

            </Text>

          </View>

          {/* PRICE */}

          <View
            style={
              styles.priceRow
            }
          >

            <Text
              style={
                styles.price
              }
            >

              ₹ {product.price}

            </Text>

            <Text
              style={
                styles.oldPrice
              }
            >

              ₹ {product.originalPrice}

            </Text>

            <Text
              style={
                styles.discount
              }
            >

              {product.discountPercent}% OFF

            </Text>

          </View>

          {/* STOCK */}

          <Text
            style={
              styles.stock
            }
          >

            {
              product.inStock
                ? "In Stock"
                : "Out Of Stock"
            }

          </Text>

          {/* OFFERS */}

          {

            product.offers?.map(
              (
                offer,
                index
              ) => (

                <Text

                  key={index}

                  style={
                    styles.offer
                  }

                >

                  • {offer}

                </Text>

              )
            )

          }

          {/* DESCRIPTION */}

          <Text
            style={
              styles.sectionTitle
            }
          >

            Product Description

          </Text>

          <Text
            style={
              styles.description
            }
          >

            {

              product.description ||

              "Premium quality product with amazing build quality and modern design."

            }

          </Text>

          {/* DELIVERY */}

          <View
            style={
              styles.deliveryBox
            }
          >

            <Image
              source={require("../assets/icons/empty-location.png")}
              style={{
                width: 26,
                height: 26,
                tintColor: "#2874f0",
                resizeMode: "contain",
              }}
            />

            <View
              style={{
                marginLeft: 12,
              }}
            >

              <Text
                style={{
                  fontWeight:
                    "bold",
                }}
              >

                Delivery in
                {" " + product.deliveryDays}

              </Text>

              <Text
                style={{
                  color: "gray",
                  marginTop: 4,
                }}
              >

                Free delivery
                available

              </Text>

            </View>

          </View>

        </View>

      </ScrollView>

      {/* BOTTOM BUTTONS */}

      <View
        style={styles.bottomBar}
      >

        {/* CART */}

        <TouchableOpacity

          style={
            styles.cartButton
          }

          onPress={
            handleAddToCart
          }

        >

          <Image
            source={require("../assets/icons/cart.png")}
            style={{
              width: 22,
              height: 22,
              tintColor: "white",
              resizeMode: "contain",
            }}
          />

          <Text
            style={
              styles.buttonText
            }
          >

            Add to Cart

          </Text>

        </TouchableOpacity>

        {/* BUY */}

        <TouchableOpacity

          style={
            styles.buyButton
          }

          onPress={() => {

            addToCart({

              ...product,

              qty: 1,

            });

            navigation.navigate(
              "Checkout"
            );

          }}

        >

          <Text
            style={
              styles.buttonText
            }
          >

            Buy Now

          </Text>

        </TouchableOpacity>

      </View>

      {/* WISHLIST ALERT */}

      <AwesomeAlert

        show={
          showWishlistAlert
        }

        title="Wishlist ❤️"

        message="Added to Wishlist"

        closeOnTouchOutside

        closeOnHardwareBackPress

        showConfirmButton={
          false
        }

      />

      {/* CART ALERT */}

      <AwesomeAlert

        show={showCartAlert}

        title="Cart 🛒"

        message="Product Added to Cart"

        closeOnTouchOutside

        closeOnHardwareBackPress

        showCancelButton

        showConfirmButton

        cancelText="Continue"

        confirmText="Go To Cart"

        confirmButtonColor="#2874f0"

        onConfirmPressed={() => {

          setShowCartAlert(
            false
          );

          navigation.navigate(
            "Cart"
          );

        }}

        onCancelPressed={() =>
          setShowCartAlert(
            false
          )
        }

      />

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#f5f7fb",

    },

    imageContainer: {

      backgroundColor:
        "white",

      alignItems: "center",

      paddingVertical: 20,

      borderBottomLeftRadius: 30,

      borderBottomRightRadius: 30,

    },

    image: {

      width: "100%",

      height: 350,

      resizeMode:
        "contain",

    },

    backBtn: {

      position: "absolute",

      top: 20,

      left: 20,

      backgroundColor:
        "white",

      width: 45,

      height: 45,

      borderRadius: 25,

      justifyContent:
        "center",

      alignItems:
        "center",

      elevation: 4,

    },

    wishlistBtn: {

      position: "absolute",

      top: 20,

      right: 20,

      backgroundColor:
        "white",

      width: 45,

      height: 45,

      borderRadius: 25,

      justifyContent:
        "center",

      alignItems:
        "center",

      elevation: 4,

    },

    infoContainer: {

      padding: 20,

    },

    categoryBox: {

      backgroundColor:
        "#c3c8d2",

      alignSelf:
        "flex-start",

      paddingHorizontal: 14,

      paddingVertical: 6,

      borderRadius: 30,

      marginBottom: 15,

    },

    categoryText: {

      color: "#2874f0",

      fontWeight: "bold",

    },

    name: {

      fontSize: 28,

      fontWeight: "bold",

      color: "#111",

    },

    ratingRow: {

      flexDirection: "row",

      alignItems: "center",

      marginTop: 15,

    },

    ratingBox: {

      backgroundColor:
        "#008000",

      paddingHorizontal: 12,

      paddingVertical: 5,

      borderRadius: 8,

    },

    rating: {

      color: "white",

      fontWeight: "bold",

    },

    ratingText: {

      marginLeft: 10,

      color: "gray",

    },

    priceRow: {

      flexDirection: "row",

      alignItems: "center",

      marginTop: 18,

    },

    price: {

      fontSize: 34,

      fontWeight: "bold",

      color: "#111",

    },

    oldPrice: {

      marginLeft: 12,

      textDecorationLine:
        "line-through",

      color: "gray",

      fontSize: 18,

    },

    discount: {

      marginLeft: 12,

      color: "green",

      fontWeight: "bold",

    },

    stock: {

      marginTop: 12,

      color: "green",

      fontWeight: "bold",

      fontSize: 16,

    },

    offer: {

      color: "#333",

      marginBottom: 8,

    },

    sectionTitle: {

      fontSize: 24,

      fontWeight: "bold",

      marginTop: 28,

      marginBottom: 12,

    },

    description: {

      color: "#555",

      lineHeight: 24,

      fontSize: 15,

    },

    deliveryBox: {

      backgroundColor:
        "white",

      borderRadius: 20,

      padding: 18,

      marginTop: 25,

      flexDirection: "row",

      alignItems: "center",

      elevation: 2,

    },

    bottomBar: {

      backgroundColor:
        "white",

      padding: 16,

      flexDirection: "row",

      justifyContent:
        "space-between",

      borderTopLeftRadius: 28,

      borderTopRightRadius: 28,

      elevation: 15,

    },

    cartButton: {

      flex: 1,

      backgroundColor:
        "#2874f0",

      marginRight: 10,

      borderRadius: 18,

      paddingVertical: 16,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

    },

    buyButton: {

      flex: 1,

      backgroundColor:
        "#fb641b",

      borderRadius: 18,

      paddingVertical: 16,

      justifyContent:
        "center",

      alignItems: "center",

    },

    buttonText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 16,

      marginLeft: 8,

    },

  });