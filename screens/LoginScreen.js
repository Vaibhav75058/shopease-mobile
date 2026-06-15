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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import API from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/login", {
        email,
        password,
      });
      await login(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid Credentials");
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
            onPress={() => navigation.navigate("ForgotPassword")} 
            style={styles.forgotContainer}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Don't have an account? Register</Text>
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
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 15,
    marginTop: -5,
  },
  forgotText: {
    color: colors.primary,
    ...typography.body,
    fontSize: 14,
  },
});