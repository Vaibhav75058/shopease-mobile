import React, {
  useState,
} from "react";

import axios from "axios";

import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useCart,
} from "../src/context/CartContext";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function CheckoutScreen({

  navigation,

}) {

  const cart = useCart();
  
  const auth = useAuth();

  const user =
    auth?.user;

  const cartItems =
    cart?.cartItems || [];

  const totalPrice =
    cartItems.reduce(

      (total, item) =>

        total + item.price,

      0

    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("COD");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const placeOrder =
    async () => {

      try {

        setLoading(true);

        const orderData = {

          orderItems:

            cartItems.map(
              (item) => ({

                name:
                  item.name,

                qty: 1,

                image:
                  item.image,

                price:
                  item.price,

                product:
                  item._id,

              })
            ),

          shippingAddress: {

            address:
              "Kanpur",

            city:
              "Kanpur",

            pincode:
              "208017",

            phone:
              "9876543210",

          },

          paymentMethod,

          totalPrice,

        };

        await axios.post(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/orders",

          orderData,

          {

            headers: {

              Authorization:
                `Bearer ${user.token}`,

            },

          }

        );

        Alert.alert(

          "Success 🎉",

          "Order placed successfully!"

        );
        
        navigation.navigate(
          "MyOrders"
        );

      } catch (error) {

        console.log(error);

        Alert.alert(
          "Error",
          "Order failed"
        );

      } finally {

        setLoading(false);

      }

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

        {/* ADDRESS */}

        <View style={styles.card}>

          <Text style={styles.heading}>
            Deliver To
          </Text>

          <View style={styles.addressRow}>

            <Ionicons
              name="location"
              size={24}
              color="#2874f0"
            />

            <View
              style={{
                marginLeft: 10,
              }}
            >

              <Text
                style={
                  styles.addressName
                }
              >
                Vaibhav Sharma
              </Text>

              <Text
                style={
                  styles.addressText
                }
              >
                Kanpur, Uttar Pradesh
              </Text>

            </View>

          </View>

        </View>

        {/* PAYMENT */}

        <View style={styles.card}>

          <Text style={styles.heading}>
            Payment Method
          </Text>

          {[
            "UPI",
            "Card",
            "COD",
          ].map((method) => (

            <TouchableOpacity

              key={method}

              style={styles.paymentItem}

              onPress={() =>
                setPaymentMethod(
                  method
                )
              }

            >

              <View
                style={
                  styles.paymentLeft
                }
              >

                <Ionicons

                  name={
                    paymentMethod ===
                      method

                      ? "radio-button-on"

                      : "radio-button-off"
                  }

                  size={22}

                  color="#2874f0"

                />

                <Text
                  style={
                    styles.paymentText
                  }
                >
                  {method}
                </Text>

              </View>

            </TouchableOpacity>

          ))}

        </View>

        {/* ORDER SUMMARY */}

        <View style={styles.card}>

          <Text style={styles.heading}>
            Order Summary
          </Text>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryText}>
              Items Total
            </Text>

            <Text style={styles.summaryPrice}>
              ₹ {totalPrice}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryText}>
              Delivery Fee
            </Text>

            <Text style={styles.summaryPrice}>
              FREE
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.totalText}>
              Total Amount
            </Text>

            <Text style={styles.totalPrice}>
              ₹ {totalPrice}
            </Text>

          </View>

        </View>

      </ScrollView>

      {/* PLACE ORDER */}

      <View style={styles.bottomBar}>

        <TouchableOpacity

          style={styles.orderButton}

          onPress={placeOrder}

          disabled={loading}

        >

          {loading ? (

            <ActivityIndicator
              color="white"
            />

          ) : (

            <Text
              style={styles.orderText}
            >
              Place Order
            </Text>

          )}

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#f5f7fb",

  },

  card: {

    backgroundColor: "white",

    margin: 15,

    borderRadius: 20,

    padding: 18,

    elevation: 2,

  },

  heading: {

    fontSize: 20,

    fontWeight: "bold",

    marginBottom: 16,

  },

  addressRow: {

    flexDirection: "row",

    alignItems: "center",

  },

  addressName: {

    fontWeight: "bold",

    fontSize: 16,

  },

  addressText: {

    color: "gray",

    marginTop: 4,

  },

  paymentItem: {

    paddingVertical: 14,

    borderBottomWidth: 1,

    borderBottomColor: "#eee",

  },

  paymentLeft: {

    flexDirection: "row",

    alignItems: "center",

  },

  paymentText: {

    marginLeft: 10,

    fontSize: 16,

    fontWeight: "500",

  },

  summaryRow: {

    flexDirection: "row",

    justifyContent:
      "space-between",

    marginBottom: 16,

  },

  summaryText: {

    color: "#555",

    fontSize: 15,

  },

  summaryPrice: {

    fontWeight: "600",

  },

  totalText: {

    fontSize: 20,

    fontWeight: "bold",

  },

  totalPrice: {

    fontSize: 22,

    fontWeight: "bold",

    color: "#2874f0",

  },

  bottomBar: {

    backgroundColor: "white",

    padding: 18,

    borderTopLeftRadius: 24,

    borderTopRightRadius: 24,

    elevation: 10,

  },

  orderButton: {

    backgroundColor: "#2874f0",

    paddingVertical: 18,

    borderRadius: 18,

    alignItems: "center",

  },

  orderText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 18,

  },

});