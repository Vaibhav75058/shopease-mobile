import React, { useState } from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";

import { useAuth } from "../src/context/AuthContext";

export default function LoginScreen({ navigation }) {

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const response = await axios.post(

        "https://e-commerce-mern-stack-0okr.onrender.com/api/auth/login",

        {
          email,
          password,
        }

      );

      await login(response.data);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Invalid Credentials"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <View>

        <Image

          source={
            require("../assets/logo.png")
          }

          style={styles.logoImage}

        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading && {
              opacity: 0.7,
            },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >

          {
            loading ? (

              <ActivityIndicator
                color="white"
                size="small"
              />

            ) : (

              <Text style={styles.buttonText}>
                Login
              </Text>

            )
          }

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Register")
          }
        >

          <Text style={styles.link}>
            Don't have an account? Register
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

    padding: 25,

    backgroundColor: "#fff",

  },

  logo: {

    fontSize: 40,

    fontWeight: "bold",

    color: "#e94560",

    textAlign: "center",

    marginBottom: 10,

  },

  heading: {

    fontSize: 28,

    fontWeight: "bold",

    textAlign: "center",

    marginBottom: 30,

  },

  input: {

    backgroundColor: "#f5f5f5",

    padding: 15,

    borderRadius: 12,

    marginBottom: 15,

    fontSize: 16,

  },

  button: {

    backgroundColor: "#e94560",

    padding: 16,

    borderRadius: 12,

    alignItems: "center",

    marginTop: 10,

  },

  buttonText: {

    color: "white",

    fontSize: 18,

    fontWeight: "bold",

  },

  link: {

    textAlign: "center",

    marginTop: 20,

    color: "#e94560",

    fontSize: 16,

  },

  logoImage: {

    width: 220,

    height: 80,

    resizeMode: "contain",

    alignSelf: "center",

    marginBottom: 15,

  },

});