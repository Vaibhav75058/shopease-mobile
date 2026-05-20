import React from "react";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

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

          <Image
            source={require("../../assets/icons/notification-bell.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
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

          <Image
            source={require("../../assets/icons/heart.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
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