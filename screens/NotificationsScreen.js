import React from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useNotification,
} from "../src/context/NotificationContext";

export default function NotificationsScreen() {

  const {
    notifications,
  } = useNotification();

  return (

    <SafeAreaView
      style={styles.container}
    >

     

      <FlatList

        data={notifications}

        keyExtractor={(item) =>
          item.id.toString()
        }

        ListEmptyComponent={

          <Text style={styles.empty}>
            No Notifications Yet
          </Text>

        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.text}>
              {item.text}
            </Text>

            <Text style={styles.time}>
              {
                new Date(
                  item.createdAt
                ).toLocaleString()
              }
            </Text>

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

  heading: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 20,

  },

  card: {

    backgroundColor:
      "white",

    padding: 18,

    borderRadius: 18,

    marginBottom: 14,

    elevation: 2,

  },

  text: {

    fontSize: 16,

    fontWeight: "600",

  },

  time: {

    color: "gray",

    marginTop: 8,

    fontSize: 12,

  },

  empty: {

    textAlign: "center",

    marginTop: 80,

    color: "gray",

    fontSize: 18,

  },

});