import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import API from "../src/services/api";
import { colors, typography, radius } from "../src/theme";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify & Reset
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your registered email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      
      // In development/demo, we return the OTP code in response and log it
      const receivedOtp = response.data?.otp;
      
      Alert.alert(
        "OTP Sent (Simulated) 📧",
        `We have simulated sending a 4-digit code to your email.\n\nCode: ${receivedOtp || "1234"}\n\n(This code is also logged in the backend server console.)`,
        [
          {
            text: "Proceed",
            onPress: () => {
              if (receivedOtp) {
                setOtp(receivedOtp); // Auto-fill for convenience
              }
              setStep(2);
            }
          }
        ]
      );
    } catch (error) {
      console.log("Forgot Password Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to find account with this email address."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      Alert.alert("Validation Error", "Please enter the 4-digit code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: newPassword,
      });

      Alert.alert(
        "Success 🎉",
        "Your password has been reset successfully! You can now log in with your new password.",
        [
          {
            text: "Go to Login",
            onPress: () => navigation.navigate("Login"),
          }
        ]
      );
    } catch (error) {
      console.log("Reset Password Error:", error);
      Alert.alert(
        "Reset Failed",
        error.response?.data?.message || "Invalid or expired OTP code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reset Password</Text>
          </View>

          <View style={styles.content}>
            {step === 1 ? (
              // Step 1: Request OTP
              <View>
                <Text style={styles.title}>Forgot Password? 🤔</Text>
                <Text style={styles.subtitle}>
                  Enter your registered email address below and we'll generate a verification code to reset your password.
                </Text>

                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor={colors.textSecondary || "#8e8e93"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleRequestOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Get Verification Code</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              // Step 2: Verify & Reset Password
              <View>
                <Text style={styles.title}>Create New Password 🔒</Text>
                <Text style={styles.subtitle}>
                  We've sent a 4-digit verification code to {email.toLowerCase()}. Please enter the code and set your new password.
                </Text>

                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  placeholder="4-digit code"
                  placeholderTextColor={colors.textSecondary || "#8e8e93"}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={4}
                  style={styles.input}
                />

                <Text style={styles.label}>New Password</Text>
                <TextInput
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textSecondary || "#8e8e93"}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  style={styles.input}
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  placeholder="Repeat your password"
                  placeholderTextColor={colors.textSecondary || "#8e8e93"}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  style={styles.input}
                />

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setStep(1)} 
                  style={styles.backToStepOne}
                >
                  <Text style={styles.backToStepOneText}>Back to Email Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  backButton: {
    paddingRight: 15,
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: "bold",
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    marginTop: -20, // offset header spacing a bit
  },
  title: {
    ...typography.h1,
    color: colors.text,
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary || "#666",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 25,
  },
  label: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.inputBg || "#f3f4f6",
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
    marginTop: 15,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.surface || "white",
    ...typography.h3,
    fontSize: 15,
  },
  backToStepOne: {
    alignSelf: "center",
    marginTop: 20,
  },
  backToStepOneText: {
    color: colors.primary,
    ...typography.body,
    fontSize: 14,
  },
});
