import React from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
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

export default function WishlistScreen({

  navigation,

}) {

  const wishlist =
    useWishlist();

  const wishlistItems =
    wishlist?.wishlistItems || [];

  const removeFromWishlist =
    wishlist?.removeFromWishlist;

  const cart = useCart();

  const addToCart =
    cart?.addToCart;

  if (
    wishlistItems.length === 0
  ) {

    return (

      <SafeAreaView
        style={styles.emptyContainer}
      >

        <Ionicons
          name="heart-outline"
          size={100}
          color="#ccc"
        />

        <Text style={styles.emptyText}>
          Wishlist is empty
        </Text>

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      edges={["top"]}
      style={styles.container}
    >

      <FlatList

        data={wishlistItems}

        keyExtractor={(item) =>
          item._id
        }

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          padding: 15,
          paddingBottom: 100,
        }}

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

            <View style={styles.info}>

              <Text
                numberOfLines={1}
                style={styles.name}
              >

                {item.name}

              </Text>

              <Text style={styles.price}>
                ₹ {item.price}
              </Text>

              <View style={styles.actions}>

                <TouchableOpacity

                  style={styles.cartButton}

                  onPress={() =>
                    addToCart(item)
                  }

                >

                  <Text
                    style={
                      styles.cartText
                    }
                  >
                    Add to Cart
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity

                  style={
                    styles.removeButton
                  }

                  onPress={() =>
                    removeFromWishlist(
                      item._id
                    )
                  }

                >

                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color="#e94560"
                  />

                </TouchableOpacity>

              </View>

            </View>

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

  },

  emptyContainer: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "white",

  },

  emptyText: {

    marginTop: 20,

    fontSize: 22,

    fontWeight: "bold",

    color: "#888",

  },

  card: {

    backgroundColor: "white",

    borderRadius: 22,

    flexDirection: "row",

    padding: 12,

    marginBottom: 16,

    elevation: 2,

  },

  image: {

    width: 110,

    height: 110,

    borderRadius: 18,

  },

  info: {

    flex: 1,

    marginLeft: 12,

    justifyContent: "space-between",

  },

  name: {

    fontSize: 17,

    fontWeight: "bold",

    color: "#111",

  },

  price: {

    fontSize: 22,

    fontWeight: "bold",

    color: "#2874f0",

    marginTop: 6,

  },

  actions: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    marginTop: 15,

  },

  cartButton: {

    backgroundColor: "#2874f0",

    paddingHorizontal: 18,

    paddingVertical: 10,

    borderRadius: 12,

  },

  cartText: {

    color: "white",

    fontWeight: "bold",

  },

  removeButton: {

    padding: 8,

  },

});