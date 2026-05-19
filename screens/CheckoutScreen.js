import React, { useState } from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import axios from "axios";

import { useCart } from "../src/context/CartContext";

import { useAuth } from "../src/context/AuthContext";

export default function CheckoutScreen({ navigation }) {

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  const { user } = useAuth();

  const placeOrder = async () => {

    if (
      !address ||
      !city ||
      !pincode ||
      !phone
    ) {

      Alert.alert(
        "Error",
        "Please fill all fields"
      );

      return;

    }

    try {

      setLoading(true);

      const orderData = {

        orderItems: cartItems.map((item) => ({

          name: item.name,

          qty: item.qty,

          image: item.image,

          price: item.price,

          product: item._id,

        })),

        shippingAddress: {

          address,
          city,
          pincode,
          phone,

        },

        totalPrice,

      };

      const config = {

        headers: {

          Authorization:
            `Bearer ${user.token}`,

        },

      };

      await axios.post(

        "https://e-commerce-mern-stack-0okr.onrender.com/api/orders",

        orderData,

        config

      );

      await clearCart();

      Alert.alert(
        "Success",
        "Order Placed Successfully"
      );

      navigation.navigate("Orders");

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

      <ScrollView>

        <Text style={styles.heading}>
          Checkout
        </Text>

        <TextInput
          placeholder="Address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          placeholder="City"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          placeholder="Pincode"
          style={styles.input}
          value={pincode}
          onChangeText={setPincode}
        />

        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.summary}>

          <Text style={styles.total}>
            Total: ₹ {totalPrice}
          </Text>

        </View>

        <TouchableOpacity

          style={styles.button}

          onPress={placeOrder}

        >

          <Text style={styles.buttonText}>

            {loading
              ? "Placing Order..."
              : "Place Order"}

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

    padding: 20,

  },

  heading: {

    fontSize: 30,

    fontWeight: "bold",

    marginBottom: 25,

  },

  input: {

    backgroundColor: "#f5f5f5",

    padding: 15,

    borderRadius: 10,

    marginBottom: 15,

  },

  summary: {

    backgroundColor: "#f5f5f5",

    padding: 20,

    borderRadius: 10,

    marginTop: 20,

  },

  total: {

    fontSize: 22,

    fontWeight: "bold",

    color: "#e94560",

  },

  button: {

    backgroundColor: "#e94560",

    padding: 18,

    borderRadius: 10,

    alignItems: "center",

    marginTop: 30,

  },

  buttonText: {

    color: "white",

    fontSize: 18,

    fontWeight: "bold",

  },

});