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
} from "react-native";

import axios from "axios";

import { useAuth } from "../../src/context/AuthContext";

export default function UsersScreen() {

  const { user } = useAuth();

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);

  const config = {

    headers: {

      Authorization:
        `Bearer ${user.token}`,

    },

  };

  const fetchUsers = async () => {

    try {

      const response =
        await axios.get(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/users",

          config

        );

      setUsers(response.data);

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

      fetchUsers();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <Text style={styles.heading}>
        All Users
      </Text>

      <FlatList

        data={users}

        keyExtractor={(item) => item._id}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={{ flex: 1 }}>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.email}>
                {item.email}
              </Text>

            </View>

            {item.isAdmin ? (

              <View style={styles.adminBadge}>

                <Text style={styles.adminText}>
                  ADMIN
                </Text>

              </View>

            ) : (

              <TouchableOpacity

                style={styles.deleteButton}

                onPress={() =>
                  deleteUser(item._id)
                }

              >

                <Text style={styles.buttonText}>
                  Delete
                </Text>

              </TouchableOpacity>

            )}

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

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 20,

  },

  card: {

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#f5f5f5",

    padding: 15,

    borderRadius: 15,

    marginBottom: 15,

  },

  name: {

    fontSize: 17,

    fontWeight: "bold",

    marginBottom: 5,

  },

  email: {

    color: "gray",

  },

  adminBadge: {

    backgroundColor: "green",

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 20,

  },

  adminText: {

    color: "white",

    fontWeight: "bold",

  },

  deleteButton: {

    backgroundColor: "red",

    paddingHorizontal: 15,

    paddingVertical: 10,

    borderRadius: 10,

  },

  buttonText: {

    color: "white",

    fontWeight: "bold",

  },

});