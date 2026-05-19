import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function AdminDashboardScreen() {

  const auth =
    useAuth();

  const user =
    auth?.user;

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    orders,
    setOrders,
  ] = useState([]);

  useEffect(() => {

    fetchAdminData();

  }, []);

  const fetchAdminData =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${user.token}`,

          },

        };

        const usersRes =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/users",

            config

          );

        const productsRes =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/products"

          );

        const ordersRes =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/orders",

            config

          );

        setUsers(
          usersRes.data
        );

        setProducts(
          productsRes.data
        );

        setOrders(
          ordersRes.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const totalRevenue =
    orders.reduce(

      (acc, item) =>

        acc + item.totalPrice,

      0

    );

  if (loading) {

    return (

      <SafeAreaView
        style={styles.loader}
      >

        <ActivityIndicator
          size="large"
          color="#2874f0"
        />

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        <Text style={styles.heading}>
          Admin Dashboard
        </Text>

        {/* STATS */}

        <View style={styles.grid}>

          <View style={styles.card}>

            <Text style={styles.number}>
              {users.length}
            </Text>

            <Text style={styles.label}>
              Users
            </Text>

          </View>

          <View style={styles.card}>

            <Text style={styles.number}>
              {products.length}
            </Text>

            <Text style={styles.label}>
              Products
            </Text>

          </View>

          <View style={styles.card}>

            <Text style={styles.number}>
              {orders.length}
            </Text>

            <Text style={styles.label}>
              Orders
            </Text>

          </View>

          <View style={styles.card}>

            <Text style={styles.number}>
              ₹ {totalRevenue}
            </Text>

            <Text style={styles.label}>
              Revenue
            </Text>

          </View>

        </View>

        {/* RECENT ORDERS */}

        <Text style={styles.subHeading}>
          Recent Orders
        </Text>

        {orders.slice(0, 5).map(
          (item) => (

            <View
              key={item._id}
              style={styles.orderCard}
            >

              <Text
                style={styles.orderId}
              >
                {item._id}
              </Text>

              <Text
                style={styles.orderPrice}
              >
                ₹ {item.totalPrice}
              </Text>

              <Text
                style={styles.orderStatus}
              >
                {item.status}
              </Text>

            </View>

          )
        )}

      </ScrollView>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor:
      "#f5f7fb",

    padding: 15,

  },

  loader: {

    flex: 1,

    justifyContent:
      "center",

    alignItems:
      "center",

  },

  heading: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 20,

  },

  grid: {

    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent:
      "space-between",

  },

  card: {

    width: "48%",

    backgroundColor:
      "white",

    borderRadius: 20,

    padding: 24,

    marginBottom: 16,

    elevation: 3,

  },

  number: {

    fontSize: 28,

    fontWeight: "bold",

    color: "#2874f0",

  },

  label: {

    color: "gray",

    marginTop: 8,

  },

  subHeading: {

    fontSize: 22,

    fontWeight: "bold",

    marginVertical: 20,

  },

  orderCard: {

    backgroundColor:
      "white",

    padding: 18,

    borderRadius: 18,

    marginBottom: 14,

  },

  orderId: {

    color: "gray",

    fontSize: 12,

  },

  orderPrice: {

    fontSize: 22,

    fontWeight: "bold",

    marginTop: 8,

  },

  orderStatus: {

    color: "green",

    fontWeight: "bold",

    marginTop: 8,

  },

});