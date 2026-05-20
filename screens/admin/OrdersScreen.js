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
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

import axios from "axios";



import { useAuth }
  from "../../src/context/AuthContext";

export default function OrdersScreen() {

  const { user } = useAuth();

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

    fetchOrders();

  }, []);

  const config = {

    headers: {

      Authorization:
        `Bearer ${user.token}`,

    },

  };

  const fetchOrders = async () => {

    try {

      const response =
        await axios.get(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/orders",

          config

        );

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(

        `https://e-commerce-mern-stack-0okr.onrender.com/api/orders/${id}/status`,

        {
          status,
        },

        config

      );

      Alert.alert(
        "Success",
        `Order marked as ${status}`
      );

      fetchOrders();

    } catch (error) {

      console.log(error);

    }

  };

  const getStatusColor = (
    status
  ) => {

    switch (status) {

      case "Processing":
        return "#ff9800";

      case "Shipped":
        return "#2196f3";

      case "Out For Delivery":
        return "#9c27b0";

      case "Delivered":
        return "#4caf50";

      default:
        return "#777";

    }

  };

  

  return (

    <SafeAreaView
      style={styles.container}
    >

      <Text style={styles.heading}>
        All Orders
      </Text>

      <FlatList

        data={orders}

        keyExtractor={(item) => item._id}

        showsVerticalScrollIndicator={false}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.topRow}>

              <Text style={styles.orderId}>
                #{item._id.slice(-6)}
              </Text>

              <Text style={styles.price}>
                ₹ {item.totalPrice}
              </Text>

            </View>

            <Text style={styles.text}>
              User: {item.user?.name}
            </Text>

            <Text style={styles.text}>
              {new Date(
                item.createdAt
              ).toLocaleDateString()}
            </Text>

            <View
              style={styles.statusRow}
            >

              <Image
                source={
                  item.status === "Processing"

                    ? require("../../assets/icons/processing.png")

                    : item.status === "Shipped"

                      ? require("../../assets/icons/shipped.png")

                      : item.status === "Out For Delivery"

                        ? require("../../assets/icons/delivery-bike.png")

                        : item.status === "Delivered"

                          ? require("../../assets/icons/delivered.png")

                          : require("../../assets/icons/package.png")
                }
                style={{
                  width: 20,
                  height: 20,
                  tintColor: getStatusColor(item.status),
                  resizeMode: "contain",
                }}
              />

              <Text

                style={[

                  styles.statusText,

                  {
                    color:
                      getStatusColor(
                        item.status
                      ),
                  },

                ]}

              >

                {item.status ||
                  "Processing"}

              </Text>

            </View>

            {item.orderItems?.map(
              (product, index) => (

                <View

                  key={index}

                  style={styles.productRow}

                >

                  <Image

                    source={{
                      uri: product.image,
                    }}

                    style={styles.productImage}

                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >

                    <Text
                      style={
                        styles.productName
                      }
                    >
                      {product.name}
                    </Text>

                    <Text>
                      Qty: {product.qty}
                    </Text>

                    <Text>
                      ₹ {product.price}
                    </Text>

                  </View>

                </View>

              )
            )}

            <View
              style={styles.buttonRow}
            >

              <TouchableOpacity

                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      "#2196f3",
                  },
                ]}

                onPress={() =>
                  updateStatus(
                    item._id,
                    "Shipped"
                  )
                }

              >

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Shipped
                </Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      "#9c27b0",
                  },
                ]}

                onPress={() =>
                  updateStatus(
                    item._id,
                    "Out For Delivery"
                  )
                }

              >

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Out
                </Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      "#4caf50",
                  },
                ]}

                onPress={() =>
                  updateStatus(
                    item._id,
                    "Delivered"
                  )
                }

              >

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Delivered
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        )}

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

    padding: 16,

    borderRadius: 18,

    marginBottom: 18,

  },

  topRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 10,

  },

  orderId: {

    fontSize: 18,

    fontWeight: "bold",

    color: "#e94560",

  },

  price: {

    fontSize: 18,

    fontWeight: "bold",

    color: "#1a1a2e",

  },

  text: {

    fontSize: 15,

    marginBottom: 5,

    color: "#555",

  },

  statusRow: {

    flexDirection: "row",

    alignItems: "center",

    marginTop: 8,

    marginBottom: 12,

  },

  statusText: {

    fontSize: 16,

    fontWeight: "bold",

    marginLeft: 8,

  },

  productRow: {

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#fff",

    padding: 10,

    borderRadius: 12,

    marginTop: 10,

  },

  productImage: {

    width: 70,

    height: 70,

    borderRadius: 10,

    marginRight: 12,

  },

  productName: {

    fontSize: 16,

    fontWeight: "bold",

    marginBottom: 4,

  },

  buttonRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: 16,

  },

  actionButton: {

    flex: 1,

    padding: 10,

    borderRadius: 10,

    marginHorizontal: 4,

    alignItems: "center",

  },

  buttonText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 13,

  },

});