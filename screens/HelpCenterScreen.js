import React from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

export default function HelpCenterScreen() {

  const helpOptions = [
    {
      id: 1,
      title: "Track My Order",
      image: require("../assets/icons/track-order.png"),
      color: colors.primary,
    },
    {
      id: 2,
      title: "Return & Refund",
      image: require("../assets/icons/refund.png"),
      color: "#ff9800",
    },
    {
      id: 3,
      title: "Payment Issues",
      image: require("../assets/icons/payment.png"),
      color: "#4caf50",
    },
    {
      id: 4,
      title: "Account & Security",
      image: require("../assets/icons/security.png"),
      color: "#9c27b0",
    },
    {
      id: 5,
      title: "Shipping Information",
      image: require("../assets/icons/shipping.png"),
      color: "#e91e63",
    },
    {
      id: 6,
      title: "Contact Support",
      image: require("../assets/icons/support-headset.png"),
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
                  style={styles.optionCard}
                  onPress={() => Alert.alert(item.title, "Coming soon!")}
                >
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <Image
                      source={item.image}
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

    backgroundColor: colors.background,

    paddingHorizontal: spacing.md,

  },

  header: {

    marginTop: spacing.sm,

    marginBottom: spacing.md,

  },

  heading: {

    ...typography.h1,

    color: colors.text,

  },

  subHeading: {

    color: colors.textSecondary,

    marginTop: spacing.xs,

    ...typography.body,

  },

  supportBanner: {

    backgroundColor: colors.primary,

    borderRadius: radius.xxl,

    paddingVertical: spacing.xxxl,

    alignItems: "center",

    marginBottom: spacing.xl,

    ...shadows.md,

  },

  bannerTitle: {

    color: colors.surface,

    ...typography.h2,

    marginTop: spacing.md,

  },

  bannerSub: {

    color: colors.surface,

    marginTop: spacing.xs,

    ...typography.body,

    textAlign: "center",

    paddingHorizontal: spacing.xxl,

  },

  optionsContainer: {

    marginBottom: spacing.xxl,

  },

  optionCard: {

    backgroundColor: colors.surface,

    borderRadius: radius.xl,

    padding: spacing.md,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: spacing.md,

    ...shadows.sm,

  },

  iconBox: {

    width: 50,

    height: 50,

    borderRadius: radius.md,

    justifyContent: "center",

    alignItems: "center",

    marginRight: spacing.md,

  },

  optionText: {

    ...typography.subtitle,

    color: colors.text,

  },

  contactBox: {

    backgroundColor: colors.surface,

    borderRadius: radius.xxl,

    padding: spacing.xl,

    marginBottom: spacing.xxxl,

    ...shadows.sm,

  },

  contactTitle: {

    ...typography.h2,

    marginBottom: spacing.md,

    color: colors.text,

  },

  contactBtn: {

    backgroundColor: colors.primary,

    borderRadius: radius.md,

    paddingVertical: spacing.md,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: spacing.md,

  },

  contactText: {

    color: colors.surface,

    ...typography.button,

    marginLeft: spacing.sm,

  },

});