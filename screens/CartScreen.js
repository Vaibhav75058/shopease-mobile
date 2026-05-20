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

  const {

    cartItems,

    removeFromCart,

    increaseQty,

    decreaseQty,

  } = useCart();

  /* TOTAL */

  const itemsTotal =
    cartItems.reduce(

      (acc, item) =>

        acc +
        item.price * item.qty,

      0

    );

  const totalMRP =
    cartItems.reduce(

      (acc, item) =>

        acc +
        (item.price + 500) *
        item.qty,

      0

    );

  const savings =
    totalMRP - itemsTotal;

  const deliveryFee =
    itemsTotal > 999
      ? 0
      : 49;

  const totalAmount =
    itemsTotal + deliveryFee;

  /* EMPTY */

  if (cartItems.length === 0) {

    return (

      <SafeAreaView
        style={
          styles.emptyContainer
        }
      >

        <View
          style={
            styles.emptyIconBox
          }
        >

          <Image
            source={require("../assets/icons/empty-cart.png")}
            style={{
              width: 90,
              height: 90,
              tintColor: "#2874f0",
              resizeMode: "contain",
            }}
          />

        </View>

        <Text
          style={
            styles.emptyTitle
          }
        >

          Your Cart is Empty

        </Text>

        <Text
          style={
            styles.emptySub
          }
        >

          Looks like you have
          not added anything yet

        </Text>

        <TouchableOpacity

          style={
            styles.shopButton
          }

          onPress={() =>
            navigation.navigate(
              "Home"
            )
          }

        >

          <Text
            style={
              styles.shopText
            }
          >

            Continue Shopping

          </Text>

        </TouchableOpacity>

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      style={styles.container}
    >

      {/* HEADER */}

      <View
        style={styles.header}
      >

        <Text
          style={styles.heading}
        >

          My Cart 🛒

        </Text>

        <Text
          style={styles.subHeading}
        >

          {
            cartItems.length
          } Items

        </Text>

      </View>

      {/* PRODUCTS */}

      <FlatList

        data={cartItems}

        keyExtractor={(
          item
        ) =>
          item._id
        }

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingBottom: 260,
        }}

        renderItem={({ item }) => (

          <View
            style={styles.card}
          >

            {/* IMAGE */}

            <Image

              source={{
                uri:
                  item.image,
              }}

              style={styles.image}

            />

            {/* INFO */}

            <View
              style={styles.info}
            >

              <Text

                numberOfLines={2}

                style={styles.name}

              >

                {item.name}

              </Text>

              <Text
                style={
                  styles.category
                }
              >

                {item.category}

              </Text>

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

                  ₹ {item.price}

                </Text>

                <Text
                  style={
                    styles.oldPrice
                  }
                >

                  ₹ {item.price + 500}

                </Text>

              </View>

              {/* ACTIONS */}

              <View
                style={
                  styles.actions
                }
              >

                {/* MINUS */}

                <TouchableOpacity

                  style={
                    styles.qtyButton
                  }

                  onPress={() =>
                    decreaseQty(
                      item._id
                    )
                  }

                >

                  <Image
                    source={require("../assets/icons/minus-sign.png")}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: "#111",
                      resizeMode: "contain",
                    }}
                  />

                </TouchableOpacity>

                {/* QTY */}

                <Text
                  style={
                    styles.qty
                  }
                >

                  {item.qty}

                </Text>

                {/* PLUS */}

                <TouchableOpacity

                  style={
                    styles.qtyButton
                  }

                  onPress={() =>
                    increaseQty(
                      item._id
                    )
                  }

                >

                  <Image
                    source={require("../assets/icons/plus.png")}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: "#111",
                      resizeMode: "contain",
                    }}
                  />

                </TouchableOpacity>

                {/* REMOVE */}

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

                  <Image
                    source={require("../assets/icons/delete.png")}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: "#e94560",
                      resizeMode: "contain",
                    }}
                  />

                </TouchableOpacity>

              </View>

            </View>

          </View>

        )}

      />

      {/* BOTTOM SUMMARY */}

      <View
        style={styles.bottomBar}
      >

        {/* LEFT */}

        <View
          style={{
            flex: 1,
          }}
        >

          <Text
            style={
              styles.totalLabel
            }
          >

            Total Amount

          </Text>

          <Text
            style={
              styles.totalPrice
            }
          >

            ₹ {totalAmount}

          </Text>

          <Text
            style={
              styles.savings
            }
          >

            You saved ₹
            {savings} 🎉

          </Text>

          <Text
            style={
              styles.delivery
            }
          >

            {

              deliveryFee === 0

                ? "Free Delivery"

                : `Delivery ₹${deliveryFee}`

            }

          </Text>

        </View>

        {/* CHECKOUT */}

        <TouchableOpacity

          style={
            styles.checkoutButton
          }

          onPress={() =>
            navigation.navigate(
              "Checkout"
            )
          }

        >

          <Text
            style={
              styles.checkoutText
            }
          >

            Checkout

          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#f5f7fb",

      paddingHorizontal: 15,

    },

    header: {

      marginTop: 10,

      marginBottom: 20,

    },

    heading: {

      fontSize: 32,

      fontWeight: "bold",

      color: "#111",

    },

    subHeading: {

      color: "gray",

      marginTop: 5,

      fontSize: 15,

    },

    /* EMPTY */

    emptyContainer: {

      flex: 1,

      justifyContent:
        "center",

      alignItems: "center",

      backgroundColor:
        "#fff",

      paddingHorizontal: 30,

    },

    emptyIconBox: {

      width: 170,

      height: 170,

      borderRadius: 100,

      backgroundColor:
        "#eef4ff",

      justifyContent:
        "center",

      alignItems: "center",

    },

    emptyTitle: {

      marginTop: 25,

      fontSize: 28,

      fontWeight: "bold",

      color: "#111",

    },

    emptySub: {

      marginTop: 10,

      color: "gray",

      textAlign: "center",

      fontSize: 15,

      lineHeight: 24,

    },

    shopButton: {

      backgroundColor:
        "#2874f0",

      paddingHorizontal: 30,

      paddingVertical: 16,

      borderRadius: 18,

      marginTop: 30,

    },

    shopText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 16,

    },

    /* CARD */

    card: {

      backgroundColor:
        "white",

      borderRadius: 24,

      flexDirection: "row",

      padding: 14,

      marginBottom: 18,

      elevation: 3,

    },

    image: {

      width: 120,

      height: 120,

      borderRadius: 20,

      resizeMode: "cover",

    },

    info: {

      flex: 1,

      marginLeft: 14,

      justifyContent:
        "space-between",

    },

    name: {

      fontSize: 16,

      fontWeight: "bold",

      color: "#111",

    },

    category: {

      color: "gray",

      marginTop: 6,

    },

    priceRow: {

      flexDirection: "row",

      alignItems: "center",

      marginTop: 10,

    },

    price: {

      fontSize: 22,

      fontWeight: "bold",

      color: "#2874f0",

    },

    oldPrice: {

      marginLeft: 10,

      color: "gray",

      textDecorationLine:
        "line-through",

    },

    actions: {

      flexDirection: "row",

      alignItems: "center",

      marginTop: 15,

    },

    qtyButton: {

      width: 36,

      height: 36,

      borderRadius: 12,

      backgroundColor:
        "#f0f2f5",

      justifyContent:
        "center",

      alignItems: "center",

    },

    qty: {

      marginHorizontal: 18,

      fontWeight: "bold",

      fontSize: 18,

      color: "#111",

    },

    removeButton: {

      marginLeft: 18,

    },

    /* BOTTOM */

    bottomBar: {

      position: "absolute",

      bottom: 80,

      left: 12,

      right: 12,

      backgroundColor:
        "white",

      padding: 22,

      borderRadius: 28,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      elevation: 15,

    },

    totalLabel: {

      color: "gray",

      fontSize: 14,

    },

    totalPrice: {

      fontSize: 28,

      fontWeight: "bold",

      color: "#111",

      marginTop: 5,

    },

    savings: {

      color: "green",

      fontWeight: "bold",

      marginTop: 6,

    },

    delivery: {

      color: "#2874f0",

      marginTop: 6,

      fontWeight: "600",

    },

    checkoutButton: {

      backgroundColor:
        "#2874f0",

      paddingHorizontal: 30,

      paddingVertical: 18,

      borderRadius: 18,

    },

    checkoutText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 16,

    },

  });