import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";

import axios from "axios";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function MyOrdersScreen() {

  const auth =
    useAuth();

  const user =
    auth?.user;

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const response =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/orders/myorders",

            {

              headers: {

                Authorization:
                  `Bearer ${user.token}`,

              },

            }

          );

        setOrders(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

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

      <FlatList

        data={orders}

        keyExtractor={(item) =>
          item._id
        }

        showsVerticalScrollIndicator={
          false
        }

        ListEmptyComponent={

          <View style={styles.emptyBox}>

            <Text style={styles.emptyText}>
              No Orders Yet
            </Text>

          </View>

        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            {/* PRODUCT IMAGE */}

            <Image

              source={{
                uri:
                  item.orderItems[0]
                    ?.image,
              }}

              style={styles.image}

            />

            {/* INFO */}

            <View style={styles.info}>

              <Text
                numberOfLines={1}
                style={styles.productName}
              >

                {
                  item.orderItems[0]
                    ?.name
                }

              </Text>

              <Text style={styles.price}>
                ₹ {item.totalPrice}
              </Text>

              <Text style={styles.status}>
                {item.status}
              </Text>

              <Text style={styles.date}>
                {

                  new Date(
                    item.createdAt
                  ).toDateString()

                }
              </Text>

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

    color: "#111",

  },

  card: {

    backgroundColor:
      "white",

    borderRadius: 20,

    padding: 12,

    flexDirection: "row",

    marginBottom: 16,

    elevation: 3,

  },

  image: {

    width: 100,

    height: 100,

    borderRadius: 16,

  },

  info: {

    flex: 1,

    marginLeft: 14,

    justifyContent:
      "space-between",

  },

  productName: {

    fontSize: 17,

    fontWeight: "bold",

    color: "#111",

  },

  price: {

    fontSize: 22,

    fontWeight: "bold",

    color: "#2874f0",

  },

  status: {

    color: "green",

    fontWeight: "bold",

  },

  date: {

    color: "gray",

  },

  emptyBox: {

    marginTop: 100,

    alignItems: "center",

  },

  emptyText: {

    fontSize: 22,

    color: "gray",

    fontWeight: "bold",

  },

});