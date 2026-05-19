import React from "react";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useNavigation,
} from "@react-navigation/native";

export default function Header() {

  const navigation =
    useNavigation();

  return (

    <View style={styles.container}>

      {/* LOGO */}

      <Image

        source={require("../../assets/logo.png")}

        style={styles.logo}

      />

      {/* RIGHT ICONS */}

      <View style={styles.right}>

        {/* NOTIFICATION */}

        <TouchableOpacity

  style={styles.iconBox}

  onPress={() => {

    console.log(
      "Notification Clicked"
    );

    navigation.push(
      "Notifications"
    );

  }}

>

          <Ionicons
            name="notifications-outline"
            size={24}
            color="#111"
          />

        </TouchableOpacity>

        {/* WISHLIST */}

        <TouchableOpacity

          style={styles.iconBox}

          onPress={() =>
            navigation.navigate(
              "Wishlist"
            )
          }

        >

          <Ionicons
            name="heart-outline"
            size={24}
            color="#e94560"
          />

        </TouchableOpacity>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 10,

    marginBottom: 15,

  },

  logo: {

    width: 170,

    height: 55,

    resizeMode: "contain",

  },

  right: {

    flexDirection: "row",

    alignItems: "center",

  },

  iconBox: {

    marginLeft: 15,

  },

});