import React from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons
  from "@expo/vector-icons/Ionicons";

export default function HelpCenterScreen() {

  const helpOptions = [

    {
      id: 1,
      title: "Track My Order",
      icon: "cube-outline",
      color: "#2874f0",
    },

    {
      id: 2,
      title: "Return & Refund",
      icon: "refresh-circle-outline",
      color: "#ff9800",
    },

    {
      id: 3,
      title: "Payment Issues",
      icon: "card-outline",
      color: "#4caf50",
    },

    {
      id: 4,
      title: "Account & Security",
      icon: "shield-checkmark-outline",
      color: "#9c27b0",
    },

    {
      id: 5,
      title: "Shipping Information",
      icon: "car-outline",
      color: "#e91e63",
    },

    {
      id: 6,
      title: "Contact Support",
      icon: "headset-outline",
      color: "#009688",
    },

  ];

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* HEADER */}

        <View
          style={styles.header}
        >

          <Text
            style={styles.heading}
          >

            Help Center

          </Text>

          <Text
            style={styles.subHeading}
          >

            How can we help you today?

          </Text>

        </View>

        {/* SUPPORT BANNER */}

        <View
          style={styles.supportBanner}
        >

          <Image
            source={require("../assets/icons/support.png")}
            style={{
              width: 60,
              height: 60,
              tintColor: "white",
              resizeMode: "contain",
            }}
          />

          <Text
            style={styles.bannerTitle}
          >

            24x7 Customer Support

          </Text>

          <Text
            style={styles.bannerSub}
          >

            We are here to solve
            your issues anytime

          </Text>

        </View>

        {/* OPTIONS */}

        <View
          style={styles.optionsContainer}
        >

          {

            helpOptions.map(
              (item) => (

                <TouchableOpacity

                  key={item.id}

                  style={
                    styles.optionCard
                  }

                >

                  <View

                    style={[

                      styles.iconBox,

                      {
                        backgroundColor:
                          item.color,
                      },

                    ]}

                  >

                    <Image
                      source={
                        item.title === "Track My Order"

                          ? require("../assets/icons/track-order.png")

                          : item.title === "Return & Refund"

                            ? require("../assets/icons/refund.png")

                            : item.title === "Payment Issues"

                              ? require("../assets/icons/payment.png")

                              : item.title === "Account & Security"

                                ? require("../assets/icons/security.png")

                                : item.title === "Shipping Information"

                                  ? require("../assets/icons/shipping.png")

                                  : item.title === "Contact Support"

                                    ? require("../assets/icons/support-headset.png")

                                    : require("../assets/icons/help-center.png")
                      }
                      style={{
                        width: 24,
                        height: 24,
                        tintColor: "white",
                        resizeMode: "contain",
                      }}
                    />

                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >

                    <Text
                      style={
                        styles.optionText
                      }
                    >

                      {item.title}

                    </Text>

                  </View>

                  <Image
                    source={require("../assets/icons/right-arrow.png")}
                    style={{
                      width: 22,
                      height: 22,
                      tintColor: "gray",
                      resizeMode: "contain",
                    }}
                  />

                </TouchableOpacity>

              )
            )

          }

        </View>

        {/* CONTACT SECTION */}

        <View
          style={styles.contactBox}
        >

          <Text
            style={styles.contactTitle}
          >

            Need More Help?

          </Text>

          {/* CALL */}

          <TouchableOpacity

            style={styles.contactBtn}

            onPress={() =>
              Linking.openURL(
                "tel:+917505838844"
              )
            }

          >

            <Image
  source={require("../assets/icons/call.png")}
  style={{
    width: 22,
    height: 22,
    tintColor: "white",
    resizeMode: "contain",
  }}
/>

            <Text
              style={
                styles.contactText
              }
            >

              Call Support

            </Text>

          </TouchableOpacity>

          {/* EMAIL */}

          <TouchableOpacity

            style={[

              styles.contactBtn,

              {
                backgroundColor:
                  "#e94560",
              },

            ]}

            onPress={() =>
              Linking.openURL(
                "mailto:support@shopease.com"
              )
            }

          >

            <Image
  source={require("../assets/icons/email.png")}
  style={{
    width: 22,
    height: 22,
    tintColor: "white",
    resizeMode: "contain",
  }}
/>

            <Text
              style={
                styles.contactText
              }
            >

              Email Support

            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#f5f7fb",

    paddingHorizontal: 15,

  },

  header: {

    marginTop: 10,

    marginBottom: 20,

  },

  heading: {

    fontSize: 30,

    fontWeight: "bold",

    color: "#111",

  },

  subHeading: {

    color: "gray",

    marginTop: 6,

    fontSize: 15,

  },

  supportBanner: {

    backgroundColor: "#2874f0",

    borderRadius: 24,

    paddingVertical: 35,

    alignItems: "center",

    marginBottom: 25,

    elevation: 5,

  },

  bannerTitle: {

    color: "white",

    fontSize: 24,

    fontWeight: "bold",

    marginTop: 15,

  },

  bannerSub: {

    color: "white",

    marginTop: 8,

    fontSize: 15,

    textAlign: "center",

    paddingHorizontal: 30,

  },

  optionsContainer: {

    marginBottom: 30,

  },

  optionCard: {

    backgroundColor: "white",

    borderRadius: 20,

    padding: 18,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 16,

    elevation: 2,

  },

  iconBox: {

    width: 50,

    height: 50,

    borderRadius: 15,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 15,

  },

  optionText: {

    fontSize: 16,

    fontWeight: "600",

    color: "#111",

  },

  contactBox: {

    backgroundColor: "white",

    borderRadius: 24,

    padding: 22,

    marginBottom: 40,

    elevation: 2,

  },

  contactTitle: {

    fontSize: 22,

    fontWeight: "bold",

    marginBottom: 20,

    color: "#111",

  },

  contactBtn: {

    backgroundColor: "#2874f0",

    borderRadius: 16,

    paddingVertical: 16,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 15,

  },

  contactText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

    marginLeft: 10,

  },

});