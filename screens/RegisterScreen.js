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
} from "react-native";

import axios from "axios";

export default function RegisterScreen({ navigation }) {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await axios.post(

        "https://e-commerce-mern-stack-0okr.onrender.com/api/auth/register",

        {
          name,
          email,
          password,
        }

      );

      Alert.alert(
        "Success",
        "Account Created"
      );

      navigation.navigate("Login");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Registration Failed"
      );

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

        <Text style={styles.heading}>
          Create Account
        </Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
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
          style={styles.button}
          onPress={handleRegister}
        >

          <Text style={styles.buttonText}>
            Register
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Login")
          }
        >

          <Text style={styles.link}>
            Already have an account? Login
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

    fontSize: 20,

    fontWeight: "bold",

    textAlign: "center",

    marginBottom: 30,
    fontfamily: "cursive",
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