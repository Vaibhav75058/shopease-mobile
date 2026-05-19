import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

export default function OrderDetailsScreen({

  route,

}) {

  const {
    order,
  } = route.params;

  const item =
    order.orderItems[0];

  const listingPrice =
    order.totalPrice + 500;

  const fees = 9;

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* PRODUCT */}

        <View
          style={styles.productCard}
        >

          <Image

            source={{
              uri:
                item.image,
            }}

            style={styles.image}

          />

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
              style={styles.price}
            >

              ₹ {item.price}

            </Text>

            <Text
              style={styles.qty}
            >

              Qty: {item.qty}

            </Text>

            <View
              style={
                styles.statusBox
              }
            >

              <Text
                style={
                  styles.status
                }
              >

                {order.status}

              </Text>

            </View>

          </View>

        </View>

        {/* DELIVERY */}

        <Text
          style={styles.heading}
        >

          Delivery Details

        </Text>

        <View
          style={styles.card}
        >

          <View
            style={styles.row}
          >

            <Ionicons

              name="home-outline"

              size={24}

              color="#111"

            />

            <Text
              style={
                styles.address
              }
            >

              {
                order.shippingAddress
                  .address
              }

              ,{" "}

              {
                order
                  .shippingAddress
                  .city
              }

              -

              {
                order
                  .shippingAddress
                  .pincode
              }

            </Text>

          </View>

          <View
            style={
              styles.divider
            }
          />

          <View
            style={styles.row}
          >

            <Ionicons

              name="person-outline"

              size={24}

              color="#111"

            />

            <Text
              style={
                styles.user
              }
            >

              {
                order
                  .shippingAddress
                  .phone
              }

            </Text>

          </View>

        </View>

        {/* PRICE */}

        <Text
          style={styles.heading}
        >

          Price Details

        </Text>

        <View
          style={styles.card}
        >

          <View
            style={
              styles.priceRow
            }
          >

            <Text
              style={
                styles.label
              }
            >

              Listing Price

            </Text>

            <Text
              style={
                styles.strike
              }
            >

              ₹ {listingPrice}

            </Text>

          </View>

          <View
            style={
              styles.priceRow
            }
          >

            <Text
              style={
                styles.label
              }
            >

              Selling Price

            </Text>

            <Text
              style={
                styles.value
              }
            >

              ₹ {
                order.totalPrice
              }

            </Text>

          </View>

          <View
            style={
              styles.priceRow
            }
          >

            <Text
              style={
                styles.label
              }
            >

              Platform Fee

            </Text>

            <Text
              style={
                styles.value
              }
            >

              ₹ {fees}

            </Text>

          </View>

          <View
            style={
              styles.dashed
            }
          />

          <View
            style={
              styles.priceRow
            }
          >

            <Text
              style={
                styles.total
              }
            >

              Total Amount

            </Text>

            <Text
              style={
                styles.total
              }
            >

              ₹ {
                order.totalPrice +
                fees
              }

            </Text>

          </View>

          {/* PAYMENT */}

          <View
            style={
              styles.paymentBox
            }
          >

            <Text
              style={
                styles.paymentText
              }
            >

              Paid By

            </Text>

            <View
              style={
                styles.upiBox
              }
            >

              <Text
                style={
                  styles.upi
                }
              >

                COD

              </Text>

            </View>

          </View>

        </View>

        {/* ORDER INFO */}

        <Text
          style={styles.heading}
        >

          Order Info

        </Text>

        <View
          style={styles.card}
        >

          <View
            style={
              styles.priceRow
            }
          >

            <Text
              style={
                styles.label
              }
            >

              Order ID

            </Text>

            <Text
              style={
                styles.small
              }
            >

              {
                order._id.slice(
                  -8
                )
              }

            </Text>

          </View>

          <View
            style={
              styles.priceRow
            }
          >

            <Text
              style={
                styles.label
              }
            >

              Ordered On

            </Text>

            <Text
              style={
                styles.small
              }
            >

              {

                new Date(
                  order.createdAt
                ).toDateString()

              }

            </Text>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#f5f5f5",

      padding: 16,

    },

    productCard: {

      backgroundColor:
        "white",

      borderRadius: 24,

      padding: 16,

      flexDirection: "row",

      marginBottom: 22,

    },

    image: {

      width: 110,

      height: 110,

      borderRadius: 18,

    },

    info: {

      flex: 1,

      marginLeft: 15,

      justifyContent:
        "space-between",

    },

    name: {

      fontSize: 18,

      fontWeight: "bold",

      color: "#111",

    },

    price: {

      fontSize: 22,

      fontWeight: "bold",

      color: "#2874f0",

    },

    qty: {

      color: "gray",

    },

    statusBox: {

      backgroundColor:
        "#e9fff1",

      alignSelf:
        "flex-start",

      paddingHorizontal: 12,

      paddingVertical: 5,

      borderRadius: 20,

    },

    status: {

      color: "green",

      fontWeight: "bold",

    },

    heading: {

      fontSize: 18,

      fontWeight: "bold",

      marginBottom: 12,

      color: "#111",

    },

    card: {

      backgroundColor:
        "white",

      borderRadius: 24,

      padding: 18,

      marginBottom: 22,

    },

    row: {

      flexDirection: "row",

      alignItems: "center",

    },

    address: {

      marginLeft: 12,

      flex: 1,

      color: "#333",

      lineHeight: 24,

    },

    divider: {

      height: 1,

      backgroundColor:
        "#eee",

      marginVertical: 18,

    },

    user: {

      marginLeft: 12,

      fontWeight: "bold",

      fontSize: 17,

    },

    priceRow: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      marginBottom: 18,

    },

    label: {

      fontSize: 16,

      color: "#444",

    },

    value: {

      fontSize: 16,

      fontWeight: "600",

    },

    strike: {

      textDecorationLine:
        "line-through",

      fontSize: 16,

    },

    dashed: {

      borderStyle: "dashed",

      borderWidth: 1,

      borderColor: "#ccc",

      marginBottom: 18,

    },

    total: {

      fontSize: 20,

      fontWeight: "bold",

    },

    paymentBox: {

      marginTop: 10,

      borderWidth: 1,

      borderColor: "#eee",

      borderRadius: 18,

      padding: 18,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

    },

    paymentText: {

      fontSize: 16,

    },

    upiBox: {

      backgroundColor:
        "#eef4ff",

      paddingHorizontal: 18,

      paddingVertical: 8,

      borderRadius: 12,

    },

    upi: {

      color: "#2874f0",

      fontWeight: "bold",

    },

    small: {

      fontSize: 13,

      color: "gray",

    },

  });