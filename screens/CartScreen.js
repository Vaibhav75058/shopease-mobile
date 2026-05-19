import React from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useCart } from "../src/context/CartContext";

import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {

  const navigation = useNavigation();

  const {
    cartItems,
    removeFromCart,
    totalPrice,
    totalItems,
  } = useCart();

  if (cartItems.length === 0) {

    return (

      <SafeAreaView
        style={styles.emptyContainer}
      >

        <Text style={styles.emptyText}>
          Your Cart is Empty 🛒
        </Text>

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      style={styles.container}
    >

      <Text style={styles.heading}>
        Cart ({totalItems} items)
      </Text>

      <FlatList

        data={cartItems}

        keyExtractor={(item) => item._id}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <View style={styles.info}>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.qty}>
                Qty: {item.qty}
              </Text>

              <Text style={styles.price}>
                ₹ {item.price * item.qty}
              </Text>

            </View>

            <TouchableOpacity

              style={styles.removeButton}

              onPress={() =>
                removeFromCart(item._id)
              }

            >

              <Text style={styles.removeText}>
                Remove
              </Text>

            </TouchableOpacity>

          </View>

        )}

      />

      <View style={styles.footer}>

        <Text style={styles.total}>
          Total: ₹ {totalPrice}
        </Text>

        <TouchableOpacity

          style={styles.checkoutButton}

          onPress={() =>
            navigation.navigate("Checkout")
          }

        >

          <Text style={styles.checkoutText}>
            Proceed To Checkout
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#fff",

    padding: 15,

  },

  heading: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 20,

  },

  card: {

    flexDirection: "row",

    backgroundColor: "#f5f5f5",

    padding: 10,

    borderRadius: 10,

    marginBottom: 15,

    alignItems: "center",

  },

  image: {

    width: 80,

    height: 80,

    borderRadius: 10,

  },

  info: {

    flex: 1,

    marginLeft: 10,

  },

  name: {

    fontSize: 16,

    fontWeight: "bold",

  },

  qty: {

    marginTop: 5,

    color: "#666",

  },

  price: {

    marginTop: 5,

    color: "#e94560",

    fontWeight: "bold",

  },

  removeButton: {

    backgroundColor: "red",

    padding: 10,

    borderRadius: 8,

  },

  removeText: {

    color: "white",

    fontWeight: "bold",

  },

  footer: {

    padding: 20,

    borderTopWidth: 1,

    borderColor: "#ddd",

  },

  total: {

    fontSize: 24,

    fontWeight: "bold",

    textAlign: "right",

  },

  checkoutButton: {

    backgroundColor: "#e94560",

    marginTop: 15,

    padding: 15,

    borderRadius: 10,

    alignItems: "center",

  },

  checkoutText: {

    color: "white",

    fontSize: 18,

    fontWeight: "bold",

  },

  emptyContainer: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#fff",

  },

  emptyText: {

    fontSize: 24,

    fontWeight: "bold",

  },

});