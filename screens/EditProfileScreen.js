import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../src/context/AuthContext";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

// ─── Form Field Component ──────────────────────────────────
const FormField = ({ label, icon, children, disabled, error }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View
      style={[
        styles.inputContainer,
        disabled && styles.disabledInputContainer,
        error && styles.errorInputContainer,
      ]}
    >
      {icon && (
        <Image
          source={icon}
          style={[
            styles.fieldIcon,
            disabled && { tintColor: colors.textLight },
          ]}
        />
      )}
      {children}
    </View>
  </View>
);

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const { width } = useWindowDimensions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Field validation states
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setGender(user.gender || "Male");
      setDob(user.dob || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  // Image Picker Logic
  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to change your profile picture."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      setImageError(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    // Reset validations
    setNameError(false);
    setPhoneError(false);

    let hasError = false;

    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    }

    // Basic phone validation (if entered, must be 10 digits)
    if (phone.trim() && phone.trim().length !== 10) {
      setPhoneError(true);
      hasError = true;
    }

    if (hasError) {
      Alert.alert("Validation Error", "Please check your inputs and try again.");
      return;
    }

    try {
      setLoading(true);
      
      // Update local context and secure storage
      const success = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        gender,
        dob: dob.trim(),
        avatar,
      });

      if (success) {
        Alert.alert("✅ Success", "Profile updated successfully.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Could not save profile changes. Please try again.");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/icons/back-arrow.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>{"Edit Profile"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePickAvatar}
              activeOpacity={0.8}
            >
              <Image
                source={
                  imageError || !avatar
                    ? require("../assets/icons/user-profile.png")
                    : { uri: avatar }
                }
                onError={() => setImageError(true)}
                style={styles.avatarImage}
              />
              <View style={styles.cameraBadge}>
                <Image
                  source={require("../assets/icons/edit.png")}
                  style={styles.cameraIcon}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHelpText}>{"Tap to change photo"}</Text>
          </View>

          <View style={styles.formContainer}>
            <FormField
              label="Full Name *"
              icon={require("../assets/icons/person.png")}
              error={nameError}
            >
              <TextInput
                placeholder="Enter your name"
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.textLight}
              />
            </FormField>

            <FormField
              label="Email Address"
              icon={require("../assets/icons/email.png")}
              disabled
            >
              <TextInput
                style={[styles.textInput, styles.disabledTextInput]}
                value={email}
                editable={false}
                placeholderTextColor={colors.textLight}
              />
            </FormField>
            <Text style={styles.infoText}>{"⚠️ Email address cannot be changed."}</Text>

            <FormField
              label="Phone Number"
              icon={require("../assets/icons/call.png")}
              error={phoneError}
            >
              <TextInput
                placeholder="10-digit mobile number"
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor={colors.textLight}
              />
            </FormField>
            {phoneError && (
              <Text style={styles.errorText}>{"Please enter a valid 10-digit phone number."}</Text>
            )}

            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>{"Gender"}</Text>
              <View style={styles.genderContainer}>
                {["Male", "Female", "Other"].map((g) => {
                  const isSelected = gender === g;
                  return (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderChip,
                        isSelected && styles.activeGenderChip,
                      ]}
                      onPress={() => setGender(g)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          isSelected && styles.activeGenderChipText,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <FormField
              label="Date of Birth"
              icon={require("../assets/icons/categories.png")}
            >
              <TextInput
                placeholder="DD / MM / YYYY"
                style={styles.textInput}
                value={dob}
                onChangeText={setDob}
                placeholderTextColor={colors.textLight}
              />
            </FormField>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.8 }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>{"Save Changes"}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight || "#f0f0f0",
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerIcon: {
    width: 16,
    height: 16,
    tintColor: colors.textPrimary,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 18,
    fontFamily: fonts.semiBold || "Poppins_600SemiBold",
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.xxl * 2,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  avatarWrapper: {
    position: "relative",
    width: 110,
    height: 110,
    borderRadius: 55,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
    backgroundColor: colors.surface,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  cameraIcon: {
    width: 14,
    height: 14,
    tintColor: colors.surface,
    resizeMode: "contain",
  },
  avatarHelpText: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontFamily: fonts.medium || "Poppins_500Medium",
    color: colors.primary,
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
  },
  fieldWrapper: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.bold || "Poppins_700Bold",
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md || 12,
    borderWidth: 1.5,
    borderColor: colors.borderLight || "#e8ecf0",
    paddingHorizontal: spacing.md,
    height: 54,
  },
  disabledInputContainer: {
    backgroundColor: "#f5f6f8",
    borderColor: "#e8ecf0",
  },
  errorInputContainer: {
    borderColor: "#ff3b30",
  },
  fieldIcon: {
    width: 18,
    height: 18,
    tintColor: colors.primary,
    marginRight: spacing.sm,
    resizeMode: "contain",
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    fontFamily: fonts.medium || "Poppins_500Medium",
    color: colors.textPrimary,
  },
  disabledTextInput: {
    color: colors.textLight,
  },
  infoText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: -spacing.md + 2,
    marginBottom: spacing.lg,
    marginLeft: spacing.xs,
    fontFamily: fonts.regular || "Poppins_400Regular",
  },
  errorText: {
    fontSize: 11,
    color: "#ff3b30",
    marginTop: -spacing.md + 2,
    marginBottom: spacing.lg,
    marginLeft: spacing.xs,
    fontFamily: fonts.medium || "Poppins_500Medium",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderChip: {
    flex: 1,
    height: 48,
    borderRadius: radius.md || 10,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderLight || "#e8ecf0",
    justifyContent: "center",
    alignItems: "center",
  },
  activeGenderChip: {
    backgroundColor: "#eef4ff",
    borderColor: colors.primary,
  },
  genderChipText: {
    fontSize: 13,
    fontFamily: fonts.medium || "Poppins_500Medium",
    color: colors.textSecondary,
  },
  activeGenderChipText: {
    color: colors.primary,
    fontFamily: fonts.bold || "Poppins_700Bold",
  },
  saveBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    height: 56,
    borderRadius: radius.md || 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontFamily: fonts.bold || "Poppins_700Bold",
  },
});
