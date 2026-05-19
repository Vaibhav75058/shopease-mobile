import React from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useAuth } from "../src/context/AuthContext";

export default function ProfileScreen() {

  const { user, logout } = useAuth();

  return (

    <SafeAreaView
      style={styles.container}
    >

      <View style={styles.profileCard}>

        <Text style={styles.heading}>
          Profile
        </Text>

        <Text style={styles.info}>
          Name: {user?.name}
        </Text>

        <Text style={styles.info}>
          Email: {user?.email}
        </Text>

        <TouchableOpacity

          style={styles.button}

          onPress={logout}

        >

          <Text style={styles.buttonText}>
            Logout
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#fff",

    padding: 20,

  },

  profileCard: {

    width: "100%",

    backgroundColor: "#f5f5f5",

    padding: 25,

    borderRadius: 20,

    alignItems: "center",

  },

  heading: {

    fontSize: 30,

    fontWeight: "bold",

    marginBottom: 30,

    color: "#1a1a2e",

  },

  info: {

    fontSize: 18,

    marginBottom: 15,

    color: "#333",

  },

  button: {

    marginTop: 30,

    backgroundColor: "#e94560",

    padding: 15,

    borderRadius: 12,

    width: 220,

    alignItems: "center",

  },

  buttonText: {

    color: "white",

    fontSize: 18,

    fontWeight: "bold",

  },

});