import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function ProfileScreen({

  navigation,

}) {

  const auth = useAuth();

  const user =
    auth?.user || {};

  const logout =
    auth?.logout;

  const handleMenuPress = (
    title
  ) => {

    switch (title) {

      

      case "My Orders":

        navigation.navigate(
          "MyOrders"
        );

        break;

      case "Wishlist":

        navigation.navigate(
          "Wishlist"
        );

        break;

      case "Saved Address":

        Alert.alert(
          "Saved Address 📍",
          "Address management coming soon."
        );

        break;

      case "Help Center":

        Alert.alert(
          "Help Center ☎️",
          "Support feature coming soon."
        );

        break;

      
        break;

      default:
        break;

    }

  };

  const menuItems = [

  

    {
      title: "My Orders",
      icon: "bag-outline",
    },

    {
      title: "Wishlist",
      icon: "heart-outline",
    },

    {
      title: "Saved Address",
      icon: "location-outline",
    },

    {
      title: "Help Center",
      icon: "help-circle-outline",
    },

    
  ];

  const handleLogout = () => {

    Alert.alert(

      "Logout",

      "Are you sure you want to logout?",

      [

        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Logout",

          style: "destructive",

          onPress: logout,
        },

      ]

    );

  };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* TOP PROFILE */}

        <View style={styles.topBox}>

          <Image

            source={{

              uri:
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

            }}

            style={styles.profileImage}

          />

          <Text style={styles.name}>
            {user?.name || "User"}
          </Text>

          <Text style={styles.email}>
            {user?.email}
          </Text>

        </View>

        

        {/* MENU */}

        <View style={styles.menuContainer}>

          {menuItems.map((item, index) => (

            <TouchableOpacity

              key={index}

              style={styles.menuItem}

              onPress={() =>
                handleMenuPress(
                  item.title
                )
              }

            >

              <View style={styles.left}>

                <Ionicons
                  name={item.icon}
                  size={24}
                  color="#2874f0"
                />

                <Text style={styles.menuText}>
                  {item.title}
                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="gray"
              />

            </TouchableOpacity>

          ))}

        </View>

        {/* LOGOUT */}

        <TouchableOpacity

          style={styles.logoutButton}

          onPress={handleLogout}

        >

          <Ionicons
            name="log-out-outline"
            size={24}
            color="white"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>

        {/* APP VERSION */}

        <Text style={styles.version}>
          ShopEase v1.0.0
        </Text>

      </ScrollView>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#f5f7fb",

  },

  topBox: {

    backgroundColor: "#2874f0",

    paddingVertical: 40,

    alignItems: "center",

    borderBottomLeftRadius: 30,

    borderBottomRightRadius: 30,

  },

  profileImage: {

    width: 100,

    height: 100,

    borderRadius: 50,

    backgroundColor: "white",

  },

  name: {

    fontSize: 24,

    fontWeight: "bold",

    color: "white",

    marginTop: 15,

  },

  email: {

    color: "white",

    marginTop: 6,

    fontSize: 15,

  },

  statsContainer: {

    flexDirection: "row",

    justifyContent: "space-between",

    marginHorizontal: 18,

    marginTop: -30,

  },

  statCard: {

    backgroundColor: "white",

    width: "31%",

    borderRadius: 18,

    paddingVertical: 18,

    alignItems: "center",

    elevation: 3,

  },

  statNumber: {

    fontSize: 24,

    fontWeight: "bold",

    color: "#2874f0",

  },

  statLabel: {

    marginTop: 5,

    color: "gray",

  },

  menuContainer: {

    padding: 18,

    marginTop: 10,

  },

  menuItem: {

    backgroundColor: "white",

    borderRadius: 18,

    padding: 18,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 14,

    elevation: 2,

  },

  left: {

    flexDirection: "row",

    alignItems: "center",

  },

  menuText: {

    fontSize: 16,

    fontWeight: "600",

    marginLeft: 14,

  },

  logoutButton: {

    backgroundColor: "#e94560",

    marginHorizontal: 18,

    marginBottom: 20,

    borderRadius: 18,

    padding: 18,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

  },

  logoutText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 18,

    marginLeft: 10,

  },

  version: {

    textAlign: "center",

    color: "gray",

    marginBottom: 40,

  },

});