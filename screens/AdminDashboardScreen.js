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
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import axios from "axios";

import { useAuth } from "../src/context/AuthContext";

export default function AdminDashboardScreen() {

  const { user } = useAuth();

  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  const [users, setUsers] = useState([]);

  useEffect(() => {

    fetchData();

  }, []);

  const config = {

    headers: {

      Authorization:
        `Bearer ${user.token}`,

    },

  };

  const fetchData = async () => {

    try {

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

  const deleteProduct = async (id) => {

    try {

      await axios.delete(

        `https://e-commerce-mern-stack-0okr.onrender.com/api/products/${id}`,

        config

      );

      Alert.alert(
        "Success",
        "Product Deleted"
      );

      fetchData();

    } catch (error) {

      console.log(error);

    }

  };

  const deleteUser = async (id) => {

    try {

      await axios.delete(

        `https://e-commerce-mern-stack-0okr.onrender.com/api/users/${id}`,

        config

      );

      Alert.alert(
        "Success",
        "User Deleted"
      );

      fetchData();

    } catch (error) {

      console.log(error);

    }

  };

  const markDelivered = async (id) => {

    try {

      await axios.put(

        `https://e-commerce-mern-stack-0okr.onrender.com/api/orders/${id}/deliver`,

        {},

        config

      );

      Alert.alert(
        "Success",
        "Order Delivered"
      );

      fetchData();

    } catch (error) {

      console.log(error);

    }

  };

  if (!user?.isAdmin) {

    return (

      <SafeAreaView
        style={styles.center}
      >

        <Text style={styles.notAdmin}>
          Admin Access Only
        </Text>

      </SafeAreaView>

    );

  }

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView>

        <Text style={styles.heading}>
          Admin Dashboard
        </Text>

        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {products.length}
            </Text>
            <Text>Products</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {orders.length}
            </Text>
            <Text>Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {users.length}
            </Text>
            <Text>Users</Text>
          </View>

        </View>

        <Text style={styles.section}>
          Products
        </Text>

        {products.map((item) => (

          <View
            key={item._id}
            style={styles.card}
          >

            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text>
              ₹ {item.price}
            </Text>

            <TouchableOpacity

              style={styles.deleteButton}

              onPress={() =>
                deleteProduct(item._id)
              }

            >

              <Text style={styles.buttonText}>
                Delete Product
              </Text>

            </TouchableOpacity>

          </View>

        ))}

        <Text style={styles.section}>
          Orders
        </Text>

        {orders.map((item) => (

          <View
            key={item._id}
            style={styles.card}
          >

            <Text style={styles.name}>
              {item._id.slice(-6)}
            </Text>

            <Text>
              ₹ {item.totalPrice}
            </Text>

            <Text>
              {item.status}
            </Text>

            {!item.isDelivered && (

              <TouchableOpacity

                style={styles.deliverButton}

                onPress={() =>
                  markDelivered(item._id)
                }

              >

                <Text style={styles.buttonText}>
                  Mark Delivered
                </Text>

              </TouchableOpacity>

            )}

          </View>

        ))}

        <Text style={styles.section}>
          Users
        </Text>

        {users.map((item) => (

          <View
            key={item._id}
            style={styles.card}
          >

            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text>
              {item.email}
            </Text>

            {!item.isAdmin && (

              <TouchableOpacity

                style={styles.deleteButton}

                onPress={() =>
                  deleteUser(item._id)
                }

              >

                <Text style={styles.buttonText}>
                  Delete User
                </Text>

              </TouchableOpacity>

            )}

          </View>

        ))}

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

    fontSize: 32,

    fontWeight: "bold",

    marginBottom: 20,

  },

  statsContainer: {

    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: 25,

  },

  statCard: {

    backgroundColor: "#f5f5f5",

    padding: 20,

    borderRadius: 15,

    alignItems: "center",

    width: "31%",

  },

  statNumber: {

    fontSize: 26,

    fontWeight: "bold",

    color: "#e94560",

  },

  section: {

    fontSize: 24,

    fontWeight: "bold",

    marginBottom: 15,

    marginTop: 15,

  },

  card: {

    backgroundColor: "#f5f5f5",

    padding: 15,

    borderRadius: 12,

    marginBottom: 15,

  },

  name: {

    fontSize: 18,

    fontWeight: "bold",

    marginBottom: 5,

  },

  deleteButton: {

    backgroundColor: "red",

    padding: 12,

    borderRadius: 10,

    marginTop: 10,

    alignItems: "center",

  },

  deliverButton: {

    backgroundColor: "green",

    padding: 12,

    borderRadius: 10,

    marginTop: 10,

    alignItems: "center",

  },

  buttonText: {

    color: "white",

    fontWeight: "bold",

  },

  center: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

  },

  notAdmin: {

    fontSize: 24,

    fontWeight: "bold",

  },

});