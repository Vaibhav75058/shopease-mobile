import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

export default function ProfileScreen({ navigation }) {
  const auth = useAuth();
  const user = auth?.user || {};
  const logout = auth?.logout;

  const [imageError, setImageError] = useState(false);

  const handleMenuPress = (title) => {
    switch (title) {
      case "Edit Profile":
        navigation.navigate("EditProfile");
        break;
      case "Notifications":
        navigation.navigate("Notifications");
        break;
      case "My Orders":
        navigation.navigate("MyOrders");
        break;
      case "Wishlist":
        navigation.navigate("Wishlist");
        break;
      case "Saved Address":
        navigation.navigate("SavedAddresses");
        break;
      case "Help Center":
        navigation.navigate("HelpCenter");
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { title: "Edit Profile" },
    { title: "Notifications" },
    { title: "My Orders" },
    { title: "Wishlist" },
    { title: "Saved Address" },
    { title: "Help Center" },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const getMenuIcon = (title) => {
    switch (title) {
      case "Edit Profile":
        return require("../assets/icons/edit.png");
      case "Notifications":
        return require("../assets/icons/notification-bell.png");
      case "My Orders":
        return require("../assets/icons/orders.png");
      case "Wishlist":
        return require("../assets/icons/empty-wishlist.png");
      case "Saved Address":
        return require("../assets/icons/empty-location.png");
      case "Help Center":
        return require("../assets/icons/help-center.png");
      default:
        return require("../assets/icons/categories.png");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* TOP PROFILE */}
        <View style={styles.topBox}>
          <Image
            source={
              imageError || !user?.avatar
                ? require("../assets/icons/user-profile.png")
                : { uri: user.avatar }
            }
            onError={() => setImageError(true)}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* MENU */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.title)}
            >
              <View style={styles.left}>
                <Image
                  source={getMenuIcon(item.title)}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: colors.primary,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Image
                source={require("../assets/icons/right-arrow.png")}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: colors.textLight,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image
            source={require("../assets/icons/logout.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: colors.textWhite,
              resizeMode: "contain",
            }}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* VERSION */}
        <Text style={styles.version}>ShopEase v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBox: {
    backgroundColor: colors.primary,
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
  },
  name: {
    ...typography.h2,
    color: colors.textWhite,
    marginTop: spacing.md,
  },
  email: {
    ...typography.body,
    color: colors.textWhite,
    marginTop: spacing.xs,
  },
  menuContainer: {
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  menuItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    ...typography.h4,
    marginLeft: spacing.md,
  },
  logoutButton: {
    backgroundColor: colors.accent,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    ...typography.button,
    marginLeft: spacing.sm,
  },
  version: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textLight,
    marginBottom: 40,
  },
});