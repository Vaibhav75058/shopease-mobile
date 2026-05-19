import React from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useWishlist,
} from "../src/context/WishlistContext";

import {
  View,
  Alert,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useCart }
  from "../src/context/CartContext";

import { useNavigation }
  from "@react-navigation/native";

export default function ProductDetailsScreen({

  route,

}) {

  const { product } = route.params;

  const { addToCart } =
    useCart();

  const {
    wishlistItems,
    addToWishlist,
  } = useWishlist();

  const navigation =
    useNavigation();

  const isWishlisted =
  wishlistItems.some(
    (x) => x._id === product._id
  );

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView>

        <View>

          <Image
            source={{
              uri: product.image,
            }}
            style={styles.image}
          />

          <TouchableOpacity

            style={
              styles.wishlistButton
            }

            onPress={() => {

              addToWishlist(product);

              Alert.alert(

                "Wishlist",

                isWishlisted
                  ? "Removed from wishlist 💔"
                  : "Added to wishlist ❤️"

              );

            }}

          >

            <Ionicons

              name={
                isWishlisted
                  ? "heart"
                  : "heart-outline"
              }

              size={30}

              color="#e94560"

            />

          </TouchableOpacity>

        </View>

        <Text style={styles.name}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          ₹ {product.price}
        </Text>

        <Text style={styles.description}>
          {product.description}
        </Text>

        <TouchableOpacity

          style={styles.button}

          onPress={() => {

            addToCart(product);

            Alert.alert(
              "Success",
              "Product added to cart 😄"
            );

          }}

        >

          <Text style={styles.buttonText}>
            Add To Cart
          </Text>

        </TouchableOpacity>

        <TouchableOpacity

          style={styles.cartButton}

          onPress={() =>

            navigation.navigate("Cart")

          }

        >

          <Text style={styles.buttonText}>
            Go To Cart
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#fff",

  },

  image: {

    width: "100%",

    height: 350,

  },

  wishlistButton: {

    position: "absolute",

    top: 20,

    right: 20,

    backgroundColor: "white",

    padding: 10,

    borderRadius: 50,

    elevation: 5,

  },

  name: {

    fontSize: 24,

    fontWeight: "bold",

    margin: 15,

  },

  price: {

    fontSize: 22,

    color: "green",

    marginHorizontal: 15,

  },

  description: {

    fontSize: 16,

    margin: 15,

    lineHeight: 24,

  },

  button: {

    backgroundColor: "#e94560",

    margin: 15,

    padding: 15,

    borderRadius: 10,

    alignItems: "center",

  },

  cartButton: {

    backgroundColor: "#1a1a2e",

    marginHorizontal: 15,

    marginBottom: 20,

    padding: 15,

    borderRadius: 10,

    alignItems: "center",

  },

  buttonText: {

    color: "white",

    fontSize: 18,

    fontWeight: "bold",

  },

});