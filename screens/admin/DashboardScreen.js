import React, {
  useEffect,
  useState,
} from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import axios from "axios";

import { useAuth } from "../../src/context/AuthContext";

export default function DashboardScreen() {

  const { user } = useAuth();

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${user.token}`,

        },

      };

      const productRes =
        await axios.get(
          "https://e-commerce-mern-stack-0okr.onrender.com/api/products"
        );

      const orderRes =
        await axios.get(
          "https://e-commerce-mern-stack-0okr.onrender.com/api/orders",
          config
        );

      const userRes =
        await axios.get(
          "https://e-commerce-mern-stack-0okr.onrender.com/api/users",
          config
        );

      setProducts(productRes.data);

      setOrders(orderRes.data);

      setUsers(userRes.data);

    } catch (error) {

      console.log(error);

    }

  };

  const totalRevenue =
    orders.reduce(
      (acc, item) =>
        acc + item.totalPrice,
      0
    );

  const deliveredOrders =
    orders.filter(
      (item) => item.isDelivered
    ).length;

  const pendingOrders =
    orders.filter(
      (item) => !item.isDelivered
    ).length;

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView>

        <Text style={styles.heading}>
          Admin Dashboard
        </Text>

        <View style={styles.grid}>

          <View style={styles.card}>
            <Text style={styles.title}>
              Total Orders
            </Text>
            <Text style={styles.value}>
              {orders.length}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              Revenue
            </Text>
            <Text style={styles.value}>
              ₹ {totalRevenue}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              Users
            </Text>
            <Text style={styles.value}>
              {users.length}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              Products
            </Text>
            <Text style={styles.value}>
              {products.length}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              Delivered
            </Text>
            <Text style={styles.value}>
              {deliveredOrders}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              Pending
            </Text>
            <Text style={styles.value}>
              {pendingOrders}
            </Text>
          </View>

        </View>

      </ScrollView>

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

    fontSize: 30,

    fontWeight: "bold",

    marginBottom: 20,

  },

  grid: {

    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

  },

  card: {

    width: "48%",

    backgroundColor: "#f5f5f5",

    padding: 20,

    borderRadius: 15,

    marginBottom: 15,

  },

  title: {

    fontSize: 16,

    color: "gray",

  },

  value: {

    fontSize: 24,

    fontWeight: "bold",

    marginTop: 10,

    color: "#e94560",

  },

});