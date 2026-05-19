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
  useCart,
} from "../src/context/CartContext";

export default function CartScreen({

  navigation,

}) {

  const cart = useCart();

  const cartItems =
    cart?.cartItems || [];

  const removeFromCart =
    cart?.removeFromCart;

  const totalPrice =
    cartItems.reduce(

      (total, item) =>

        total + item.price,

      0

    );

  if (cartItems.length === 0) {

    return (

      <SafeAreaView
        style={styles.emptyContainer}
      >

        <Ionicons
          name="cart-outline"
          size={100}
          color="#ccc"
        />

        <Text style={styles.emptyText}>
          Your cart is empty
        </Text>

        <TouchableOpacity

          style={styles.shopButton}

          onPress={() =>
            navigation.navigate(
              "Home"
            )
          }

        >

          <Text style={styles.shopText}>
            Continue Shopping
          </Text>

        </TouchableOpacity>

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      edges={["top"]}
      style={styles.container}
    >

      <FlatList

        data={cartItems}

        keyExtractor={(item) =>
          item._id
        }

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingBottom: 220,
        }}

        renderItem={({ item }) => (

          <View style={styles.card}>

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

              <Text style={styles.category}>
                {item.category}
              </Text>

              <Text style={styles.price}>
                ₹ {item.price}
              </Text>

              {/* ACTIONS */}

              <View style={styles.actions}>

                <TouchableOpacity
                  style={styles.qtyButton}
                >

                  <Ionicons
                    name="remove"
                    size={18}
                    color="#111"
                  />

                </TouchableOpacity>

                <Text style={styles.qty}>
                  1
                </Text>

                <TouchableOpacity
                  style={styles.qtyButton}
                >

                  <Ionicons
                    name="add"
                    size={18}
                    color="#111"
                  />

                </TouchableOpacity>

                <TouchableOpacity

                  style={
                    styles.removeButton
                  }

                  onPress={() =>
                    removeFromCart(
                      item._id
                    )
                  }

                >

                  <Text
                    style={
                      styles.removeText
                    }
                  >
                    Remove
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          </View>

        )}

      />

      {/* BOTTOM BAR */}

      <View style={styles.bottomBar}>

        <View>

          <Text style={styles.totalLabel}>
            Total Price
          </Text>

          <Text style={styles.totalPrice}>
            ₹ {totalPrice}
          </Text>

          <Text style={styles.savings}>
            You saved ₹500 🎉
          </Text>

          <Text style={styles.delivery}>
            Free Delivery
          </Text>

        </View>

        <TouchableOpacity

          style={styles.checkoutButton}

          onPress={() =>
            navigation.navigate(
              "Checkout"
            )
          }

        >

          <Text
            style={styles.checkoutText}
          >
            Place Order
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#f5f7fb",

    padding: 15,

  },

  emptyContainer: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#fff",

  },

  emptyText: {

    marginTop: 20,

    fontSize: 22,

    fontWeight: "bold",

    color: "#888",

  },

  shopButton: {

    backgroundColor: "#2874f0",

    paddingHorizontal: 24,

    paddingVertical: 14,

    borderRadius: 18,

    marginTop: 25,

  },

  shopText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

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

  category: {

    color: "gray",

    marginTop: 4,

  },

  price: {

    fontSize: 20,

    fontWeight: "bold",

    color: "#2874f0",

    marginTop: 5,

  },

  actions: {

    flexDirection: "row",

    alignItems: "center",

    marginTop: 12,

  },

  qtyButton: {

    width: 32,

    height: 32,

    borderRadius: 16,

    backgroundColor: "#eee",

    justifyContent: "center",

    alignItems: "center",

  },

  qty: {

    marginHorizontal: 12,

    fontWeight: "bold",

    fontSize: 16,

  },

  removeButton: {

    marginLeft: 18,

  },

  removeText: {

    color: "#e94560",

    fontWeight: "bold",

  },

  bottomBar: {

    position: "absolute",

    bottom: 80,

    left: 10,

    right: 10,

    backgroundColor: "white",

    padding: 20,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    borderRadius: 24,

    elevation: 10,

  },

  totalLabel: {

    color: "gray",

    fontSize: 14,

  },

  totalPrice: {

    fontSize: 24,

    fontWeight: "bold",

    color: "#111",

    marginTop: 4,

  },

  savings: {

    color: "green",

    fontWeight: "bold",

    marginTop: 4,

  },

  delivery: {

    color: "#2874f0",

    marginTop: 4,

    fontWeight: "600",

  },

  checkoutButton: {

    backgroundColor: "#2874f0",

    paddingHorizontal: 28,

    paddingVertical: 15,

    borderRadius: 18,

  },

  checkoutText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

  },

});