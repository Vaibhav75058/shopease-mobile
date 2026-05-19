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
  StyleSheet,
} from "react-native";

import axios from "axios";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import { useAuth }
  from "../src/context/AuthContext";

export default function MyOrdersScreen() {

  const { user } = useAuth();

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${user.token}`,

        },

      };

      const response =
        await axios.get(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/orders/myorders",

          config

        );

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const getStatusUI = (status) => {

    switch (status) {

      case "Processing":

        return {
          color: "#ff9800",
          icon: "time-outline",
        };

      case "Shipped":

        return {
          color: "#2196f3",
          icon: "car-outline",
        };

      case "Out For Delivery":

        return {
          color: "#9c27b0",
          icon: "bicycle-outline",
        };

      case "Delivered":

        return {
          color: "#4caf50",
          icon: "checkmark-circle",
        };

      default:

        return {
          color: "#666",
          icon: "cube-outline",
        };

    }

  };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <Text style={styles.heading}>
        My Orders
      </Text>

      <FlatList

        data={orders}

        keyExtractor={(item) => item._id}

        showsVerticalScrollIndicator={false}

        renderItem={({ item }) => {

          const statusUI =
            getStatusUI(item.status);

          return (

            <View style={styles.card}>

              <View style={styles.topRow}>

                <Text style={styles.id}>
                  Order #{item._id.slice(-6)}
                </Text>

                <Text style={styles.price}>
                  ₹ {item.totalPrice}
                </Text>

              </View>

              <View style={styles.statusRow}>

                <Ionicons
                  name={statusUI.icon}
                  size={22}
                  color={statusUI.color}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        statusUI.color,
                    },
                  ]}
                >
                  {item.status ||
                    "Processing"}
                </Text>

              </View>

              <View style={styles.timeline}>

                <View
                  style={styles.timelineItem}
                >

                  <View
                    style={[

                      styles.circle,

                      styles.activeCircle,

                    ]}
                  />

                  <Text
                    style={
                      styles.timelineText
                    }
                  >
                    Ordered
                  </Text>

                </View>

                <View
                  style={styles.line}
                />

                <View
                  style={styles.timelineItem}
                >

                  <View
                    style={[

                      styles.circle,

                      (item.status ===
                        "Shipped" ||

                        item.status ===
                          "Out For Delivery" ||

                        item.status ===
                          "Delivered") &&

                        styles.activeCircle,

                    ]}
                  />

                  <Text
                    style={
                      styles.timelineText
                    }
                  >
                    Shipped
                  </Text>

                </View>

                <View
                  style={styles.line}
                />

                <View
                  style={styles.timelineItem}
                >

                  <View
                    style={[

                      styles.circle,

                      (item.status ===
                        "Out For Delivery" ||

                        item.status ===
                          "Delivered") &&

                        styles.activeCircle,

                    ]}
                  />

                  <Text
                    style={
                      styles.timelineText
                    }
                  >
                    Delivery
                  </Text>

                </View>

                <View
                  style={styles.line}
                />

                <View
                  style={styles.timelineItem}
                >

                  <View
                    style={[

                      styles.circle,

                      item.status ===
                        "Delivered" &&

                        styles.activeCircle,

                    ]}
                  />

                  <Text
                    style={
                      styles.timelineText
                    }
                  >
                    Delivered
                  </Text>

                </View>

              </View>

            </View>

          );

        }}

      />

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

    color: "#1a1a2e",

  },

  card: {

    backgroundColor: "#f5f5f5",

    padding: 18,

    borderRadius: 18,

    marginBottom: 18,

  },

  topRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 15,

  },

  id: {

    fontSize: 16,

    fontWeight: "bold",

    color: "#1a1a2e",

  },

  price: {

    fontSize: 18,

    fontWeight: "bold",

    color: "#e94560",

  },

  statusRow: {

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 20,

  },

  statusText: {

    fontSize: 16,

    fontWeight: "bold",

    marginLeft: 8,

  },

  timeline: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

  },

  timelineItem: {

    alignItems: "center",

  },

  circle: {

    width: 18,

    height: 18,

    borderRadius: 20,

    backgroundColor: "#ccc",

    marginBottom: 6,

  },

  activeCircle: {

    backgroundColor: "#4caf50",

  },

  line: {

    flex: 1,

    height: 3,

    backgroundColor: "#ccc",

    marginHorizontal: 5,

    marginBottom: 22,

  },

  timelineText: {

    fontSize: 11,

    color: "#555",

    textAlign: "center",

  },

});