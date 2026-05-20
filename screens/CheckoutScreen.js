import React, {
  useEffect,
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
  Image,
  Modal,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import AwesomeAlert
  from "react-native-awesome-alerts";

import {
  useCart,
} from "../src/context/CartContext";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function CheckoutScreen({

  navigation,

}) {

  const cart =
    useCart();

  const auth =
    useAuth();

  const user =
    auth?.user;

  const cartItems =
    cart?.cartItems || [];

  const clearCart =
    cart?.clearCart;

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState(null);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("COD");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    successModal,
    setSuccessModal,
  ] = useState(false);

  /* TOTALS */

  const itemsTotal =
    cartItems.reduce(

      (acc, item) =>

        acc +
        item.price * item.qty,

      0

    );

  const deliveryFee =
    itemsTotal > 999
      ? 0
      : 49;

  const platformFee =

    itemsTotal > 0
      ? 9
      : 0;

  const totalAmount =
    itemsTotal +
    deliveryFee +
    platformFee;

  /* FETCH ADDRESS */

  useEffect(() => {

    fetchAddresses();

  }, []);

  const fetchAddresses =
    async () => {

      try {

        const res =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/address",

            {
              headers: {

                Authorization:
                  `Bearer ${user.token}`,

              },
            }
          );

        setAddresses(
          res.data
        );

        if (
          res.data.length > 0
        ) {

          setSelectedAddress(
            res.data[0]
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  /* PLACE ORDER */

  const placeOrder =
    async () => {

      if (!selectedAddress) {

        Alert.alert(
          "Select Address"
        );

        return;

      }

      try {

        setLoading(true);

        const orderData = {

          orderItems:

            cartItems.map(
              (item) => ({

                name:
                  item.name,

                qty:
                  item.qty,

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
              `${selectedAddress.flat}, ${selectedAddress.area}`,

            city:
              selectedAddress.city,

            pincode:
              selectedAddress.pincode,

            phone:
              selectedAddress.phone,

          },

          paymentMethod,

          totalPrice:
            totalAmount,

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

        await clearCart();

        setSuccessModal(
          true
        );

        setTimeout(() => {

          setSuccessModal(
            false
          );

          navigation.replace(
            "MyOrders"
          );

        }, 2500);

      } catch (error) {

        console.log(error);

        Alert.alert(
          "Error",
          "Order Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* ADDRESS */}

        <View style={styles.card}>

          <View
            style={
              styles.headerRow
            }
          >

            <Text
              style={
                styles.heading
              }
            >

              Select Address

            </Text>

            <TouchableOpacity

              onPress={() =>
                navigation.navigate(
                  "AddAddress"
                )
              }

            >

              <Text
                style={
                  styles.addNew
                }
              >

                + Add New

              </Text>

            </TouchableOpacity>

          </View>

          {

            addresses.map(
              (item) => (

                <TouchableOpacity

                  key={item._id}

                  style={[

                    styles.addressCard,

                    selectedAddress?._id ===
                    item._id && {

                      borderColor:
                        "#2874f0",

                      backgroundColor:
                        "#eef4ff",

                    },

                  ]}

                  onPress={() =>
                    setSelectedAddress(
                      item
                    )
                  }

                >

                  <View
                    style={
                      styles.addressTop
                    }
                  >

                    <Text
                      style={
                        styles.addressName
                      }
                    >

                      {
                        item.fullName
                      }

                    </Text>

                    <Image
                      source={
                        selectedAddress?._id === item._id

                          ? require("../assets/icons/radio-selected.png")

                          : require("../assets/icons/radio-unselected.png")
                      }
                      style={{
                        width: 22,
                        height: 22,
                        resizeMode: "contain",
                      }}
                    />

                  </View>

                  <Text
                    style={
                      styles.addressText
                    }
                  >

                    {item.flat},{" "}
                    {item.area},{" "}
                    {item.city},{" "}
                    {item.state} -{" "}
                    {
                      item.pincode
                    }

                  </Text>

                  <Text
                    style={
                      styles.phone
                    }
                  >

                    📞 {
                      item.phone
                    }

                  </Text>

                </TouchableOpacity>

              )
            )

          }

        </View>

        {/* PRODUCTS */}

        <View style={styles.card}>

          <Text
            style={styles.heading}
          >

            Order Items

          </Text>

          {

            cartItems.map(
              (item) => (

                <View

                  key={item._id}

                  style={
                    styles.productCard
                  }

                >

                  <Image

                    source={{
                      uri:
                        item.image,
                    }}

                    style={
                      styles.productImage
                    }

                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >

                    <Text

                      numberOfLines={2}

                      style={
                        styles.productName
                      }

                    >

                      {item.name}

                    </Text>

                    <Text
                      style={
                        styles.productPrice
                      }
                    >

                      ₹ {item.price}

                    </Text>

                    <Text
                      style={
                        styles.qty
                      }
                    >

                      Qty:
                      {item.qty}

                    </Text>

                  </View>

                </View>

              )
            )

          }

        </View>

        {/* PAYMENT */}

        <View style={styles.card}>

          <Text
            style={styles.heading}
          >

            Payment Method

          </Text>

          {

            [

              "UPI",

              "Card",

              "COD",

            ].map(
              (method) => (

                <TouchableOpacity

                  key={method}

                  style={
                    styles.paymentItem
                  }

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

                    <Image
                      source={
                        paymentMethod === method

                          ? require("../assets/icons/radio-selected.png")

                          : require("../assets/icons/radio-unselected.png")
                      }
                      style={{
                        width: 22,
                        height: 22,
                        resizeMode: "contain",
                      }}
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

              )
            )

          }

        </View>

        {/* SUMMARY */}

        <View style={styles.card}>

          <Text
            style={styles.heading}
          >

            Order Summary

          </Text>

          <View
            style={
              styles.summaryRow
            }
          >

            <Text
              style={
                styles.summaryText
              }
            >

              Items Total

            </Text>

            <Text
              style={
                styles.summaryPrice
              }
            >

              ₹ {itemsTotal}

            </Text>

          </View>

          <View
            style={
              styles.summaryRow
            }
          >

            <Text
              style={
                styles.summaryText
              }
            >

              Delivery Fee

            </Text>

            <Text
              style={
                styles.summaryPrice
              }
            >

              ₹ {deliveryFee}

            </Text>

          </View>

          <View
            style={
              styles.summaryRow
            }
          >

            <Text
              style={
                styles.summaryText
              }
            >

              Platform Fee

            </Text>

            <Text
              style={
                styles.summaryPrice
              }
            >

              ₹ {platformFee}

            </Text>

          </View>

          <View
            style={
              styles.totalRow
            }
          >

            <Text
              style={
                styles.totalText
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

          </View>

        </View>

      </ScrollView>

      {/* BOTTOM */}

      <View
        style={styles.bottomBar}
      >

        <View>

          <Text
            style={
              styles.bottomLabel
            }
          >

            Total

          </Text>

          <Text
            style={
              styles.bottomPrice
            }
          >

            ₹ {totalAmount}

          </Text>

        </View>

        <TouchableOpacity

          style={
            styles.orderButton
          }

          onPress={placeOrder}

          disabled={loading}

        >

          {

            loading ? (

              <ActivityIndicator
                color="white"
              />

            ) : (

              <Text
                style={
                  styles.orderText
                }
              >

                Place Order

              </Text>

            )

          }

        </TouchableOpacity>

      </View>

      {/* SUCCESS */}

      <AwesomeAlert

        show={successModal}

        title="Order Placed 🎉"

        message="Your order has been placed successfully"

        closeOnTouchOutside={
          false
        }

        closeOnHardwareBackPress={
          false
        }

        showConfirmButton={
          false
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

    card: {

      backgroundColor:
        "white",

      margin: 15,

      borderRadius: 22,

      padding: 18,

      elevation: 2,

    },

    headerRow: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: 15,

    },

    heading: {

      fontSize: 22,

      fontWeight: "bold",

      color: "#111",

    },

    addNew: {

      color: "#2874f0",

      fontWeight: "bold",

    },

    addressCard: {

      borderWidth: 2,

      borderColor: "#eee",

      borderRadius: 18,

      padding: 15,

      marginBottom: 15,

    },

    addressTop: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

    },

    addressName: {

      fontWeight: "bold",

      fontSize: 17,

    },

    addressText: {

      color: "#555",

      marginTop: 8,

      lineHeight: 22,

    },

    phone: {

      marginTop: 10,

      color: "#444",

    },

    productCard: {

      flexDirection: "row",

      marginBottom: 18,

    },

    productImage: {

      width: 90,

      height: 90,

      borderRadius: 16,

      marginRight: 14,

    },

    productName: {

      fontSize: 16,

      fontWeight: "bold",

      color: "#111",

    },

    productPrice: {

      marginTop: 8,

      color: "#2874f0",

      fontSize: 18,

      fontWeight: "bold",

    },

    qty: {

      marginTop: 6,

      color: "gray",

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

      fontWeight: "600",

    },

    summaryRow: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      marginBottom: 15,

    },

    summaryText: {

      color: "#555",

      fontSize: 15,

    },

    summaryPrice: {

      fontWeight: "600",

    },

    totalRow: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: 10,

      borderTopWidth: 1,

      borderTopColor: "#eee",

      paddingTop: 15,

    },

    totalText: {

      fontSize: 22,

      fontWeight: "bold",

    },

    totalPrice: {

      fontSize: 24,

      fontWeight: "bold",

      color: "#2874f0",

    },

    bottomBar: {

      backgroundColor:
        "white",

      padding: 18,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      borderTopLeftRadius: 24,

      borderTopRightRadius: 24,

      elevation: 15,

    },

    bottomLabel: {

      color: "gray",

    },

    bottomPrice: {

      fontSize: 26,

      fontWeight: "bold",

      color: "#111",

    },

    orderButton: {

      backgroundColor:
        "#2874f0",

      paddingHorizontal: 35,

      paddingVertical: 18,

      borderRadius: 18,

    },

    orderText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 16,

    },

  });