import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import API from "../src/services/api";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      Alert.alert("Success", "Account Created");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logoImage}
          />
          <Text style={styles.heading}>Create Account</Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: colors.surface,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  heading: {
    ...typography.h2,
    textAlign: "center",
    marginBottom: 30,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.inputBg,
    padding: 15,
    borderRadius: radius.md || 12,
    marginBottom: 15,
    ...typography.body,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md || 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.surface,
    ...typography.subtitle,
  },
  link: {
    textAlign: "center",
    marginTop: 20,
    color: colors.primary,
    ...typography.body,
  },
  logoImage: {
    width: 220,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 15,
  },
});