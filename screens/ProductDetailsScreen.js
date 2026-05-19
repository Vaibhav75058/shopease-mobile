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
  useWishlist,
} from "../src/context/WishlistContext";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useCart,
} from "../src/context/CartContext";

export default function ProductDetailsScreen({

  route,
  navigation,

}) {

  const { product } =
    route.params;

  const cart = useCart();

  const addToCart =
    cart?.addToCart;

  const wishlist =
    useWishlist();

  const addToWishlist =
    wishlist?.addToWishlist;

  const [
    showAlert,
    setShowAlert,
  ] = useState(false);

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

        {/* PRODUCT IMAGE */}

        <View style={styles.imageContainer}>

          <Image

            source={{
              uri: product.image,
            }}

            style={styles.image}

          />

          {/* WISHLIST */}

          <TouchableOpacity

            style={styles.wishlist}

            onPress={() => {

              addToWishlist(product);

              setShowAlert(true);

              setTimeout(() => {

                setShowAlert(false);

              }, 1800);

            }}

          >

            <Ionicons
              name="heart-outline"
              size={26}
              color="#111"
            />

          </TouchableOpacity>

        </View>

        {/* PRODUCT INFO */}

        <View style={styles.infoContainer}>

          <Text style={styles.name}>
            {product.name}
          </Text>

          {/* RATINGS */}

          <View style={styles.ratingRow}>

            <View style={styles.ratingBox}>

              <Text style={styles.rating}>
                4.4 ★
              </Text>

            </View>

            <Text style={styles.ratingText}>
              12,430 Ratings
            </Text>

          </View>

          {/* PRICE */}

          <View style={styles.priceRow}>

            <Text style={styles.price}>
              ₹ {product.price}
            </Text>

            <Text style={styles.oldPrice}>
              ₹ {product.price + 2500}
            </Text>

            <Text style={styles.discount}>
              45% OFF
            </Text>

          </View>

          {/* OFFERS */}

          <View style={styles.offerBox}>

            <Text style={styles.offerTitle}>
              Available Offers
            </Text>

            <Text style={styles.offer}>
              • Bank Offer 10% Instant
              Discount
            </Text>

            <Text style={styles.offer}>
              • Special Price Get extra
              ₹500 off
            </Text>

            <Text style={styles.offer}>
              • Free Delivery
            </Text>

          </View>

          {/* DESCRIPTION */}

          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            {product.description ||
              "Premium quality product with modern design and best performance."}
          </Text>

          {/* DELIVERY */}

          <View style={styles.deliveryBox}>

            <Ionicons
              name="location-outline"
              size={24}
              color="#2874f0"
            />

            <Text style={styles.deliveryText}>
              Delivery in 2-4 days
            </Text>

          </View>

        </View>

      </ScrollView>

      {/* BOTTOM BUTTONS */}

      <View style={styles.bottomBar}>

        <TouchableOpacity

          style={styles.cartButton}

          onPress={() =>
            addToCart(product)
          }

        >

          <Ionicons
            name="cart"
            size={22}
            color="white"
          />

          <Text style={styles.buttonText}>
            Add to Cart
          </Text>

        </TouchableOpacity>

        <TouchableOpacity

          style={styles.buyButton}

          onPress={() =>
            navigation.navigate(
              "Checkout"
            )
          }

        >

          <Text style={styles.buttonText}>
            Buy Now
          </Text>

        </TouchableOpacity>

      </View>

      {/* ALERT */}

      <AwesomeAlert

        show={showAlert}

        showProgress={false}

        title="Wishlist ❤️"

        message="Added to Wishlist"

        closeOnTouchOutside

        closeOnHardwareBackPress

        showConfirmButton={false}

      />

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#f5f7fb",

  },

  imageContainer: {

    backgroundColor: "white",

    alignItems: "center",

    padding: 20,

  },

  image: {

    width: "100%",

    height: 320,

    resizeMode: "contain",

  },

  wishlist: {

    position: "absolute",

    top: 20,

    right: 20,

    backgroundColor: "white",

    width: 45,

    height: 45,

    borderRadius: 25,

    justifyContent: "center",

    alignItems: "center",

    elevation: 3,

  },

  infoContainer: {

    padding: 18,

  },

  name: {

    fontSize: 24,

    fontWeight: "bold",

    color: "#111",

  },

  ratingRow: {

    flexDirection: "row",

    alignItems: "center",

    marginTop: 12,

  },

  ratingBox: {

    backgroundColor: "#008000",

    borderRadius: 8,

    paddingHorizontal: 10,

    paddingVertical: 5,

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

    marginTop: 16,

  },

  price: {

    fontSize: 30,

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

    fontSize: 16,

  },

  offerBox: {

    backgroundColor: "white",

    borderRadius: 18,

    padding: 18,

    marginTop: 20,

  },

  offerTitle: {

    fontSize: 18,

    fontWeight: "bold",

    marginBottom: 12,

  },

  offer: {

    marginBottom: 8,

    color: "#333",

  },

  sectionTitle: {

    fontSize: 22,

    fontWeight: "bold",

    marginTop: 25,

    marginBottom: 12,

  },

  description: {

    color: "#555",

    lineHeight: 22,

    fontSize: 15,

  },

  deliveryBox: {

    backgroundColor: "white",

    borderRadius: 18,

    padding: 18,

    marginTop: 25,

    flexDirection: "row",

    alignItems: "center",

  },

  deliveryText: {

    marginLeft: 12,

    fontWeight: "600",

  },

  bottomBar: {

    backgroundColor: "white",

    padding: 16,

    flexDirection: "row",

    justifyContent: "space-between",

    borderTopLeftRadius: 24,

    borderTopRightRadius: 24,

    elevation: 10,

  },

  cartButton: {

    flex: 1,

    backgroundColor: "#2874f0",

    marginRight: 10,

    borderRadius: 18,

    paddingVertical: 16,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

  },

  buyButton: {

    flex: 1,

    backgroundColor: "#fb641b",

    borderRadius: 18,

    paddingVertical: 16,

    justifyContent: "center",

    alignItems: "center",

  },

  buttonText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

    marginLeft: 8,

  },

});