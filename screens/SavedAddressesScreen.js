import React, {
  useState,
} from "react";

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";
import { useFocusEffect } from "@react-navigation/native";

import API from "../src/services/api";

export default function SavedAddressesScreen({

  navigation,

}) {



  const [
    addresses,
    setAddresses,
  ] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAddresses =
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const res = await API.get("/address");
        setAddresses(res.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useFocusEffect(

    React.useCallback(() => {

      fetchAddresses();

    }, [])

  );

  /* DELETE */

  const handleDelete =
    async (id) => {

      try {
        setLoading(true);

        await API.delete(

          `/address/${id}`

        );

        fetchAddresses();

      } catch (error) {

        console.log(error);

      } finally {
        setLoading(false);
      }

    };

  const confirmDelete =
    (id) => {

      Alert.alert(

        "Delete Address",

        "Are you sure?",

        [

          {
            text: "Cancel",
          },

          {
            text: "Delete",

            style:
              "destructive",

            onPress: () =>
              handleDelete(id),
          },

        ]

      );

    };

  return (

    <SafeAreaView
      style={styles.container}
    >



      {/* ADD BUTTON */}

      <TouchableOpacity

        style={styles.addBtn}

        onPress={() =>
          navigation.navigate(
            "AddAddress"
          )
        }

      >


        <Image
          source={require("../assets/icons/plus.png")}
          style={{
            width: 22,
            height: 22,
            tintColor: "white",
            resizeMode: "contain",
          }}
        />
        <Text
          style={styles.addText}
        >

          Add New Address

        </Text>

      </TouchableOpacity>

      {/* LOADING */}
      {loading && !refreshing && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* EMPTY */}

      {

        !loading && addresses.length ===
          0 ? (

          <View
            style={
              styles.emptyContainer
            }
          >

            <Image
              source={require("../assets/icons/empty-location.png")}
              style={{
                width: 90,
                height: 90,
                tintColor: "#ccc",
                resizeMode: "contain",
              }}
            />
            <Text
              style={
                styles.emptyTitle
              }
            >

              No Saved Address

            </Text>

          </View>

        ) : !loading ? (

          <FlatList

            data={addresses}

            keyExtractor={(
              item
            ) =>
              item._id
            }

            showsVerticalScrollIndicator={
              false
            }

            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchAddresses(true)}
                tintColor={colors.primary}
              />
            }

            renderItem={({
              item,
            }) => (

              <View
                style={
                  styles.card
                }
              >

                {/* TYPE */}

                <View
                  style={
                    styles.typeBox
                  }
                >

                  <Image
                    source={
                      item.type === "Work"

                        ? require("../assets/icons/work.png")

                        : require("../assets/icons/home.png")
                    }
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: "#2874f0",
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={
                      styles.typeText
                    }
                  >

                    {item.type ||
                      "Home"}

                  </Text>

                </View>

                {/* NAME */}

                <Text
                  style={
                    styles.name
                  }
                >

                  {item.fullName}

                </Text>

                {/* ADDRESS */}

                <Text
                  style={
                    styles.address
                  }
                >

                  {item.flat},{" "}

                  {item.area},{" "}

                  {item.city},{" "}

                  {item.state} -{" "}

                  {item.pincode}

                </Text>

                {/* PHONE */}

                <Text
                  style={
                    styles.phone
                  }
                >

                  📞 {item.phone}

                </Text>

                {/* BUTTONS */}

                <View
                  style={
                    styles.buttonRow
                  }
                >

                  {/* EDIT */}

                  <TouchableOpacity

                    style={
                      styles.editBtn
                    }

                    onPress={() =>

                      navigation.navigate(

                        "AddAddress",

                        {
                          editData:
                            item,
                        }

                      )

                    }

                  >


                    <Image
                      source={require("../assets/icons/edit.png")}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: "white",
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={
                        styles.btnText
                      }
                    >

                      Edit

                    </Text>

                  </TouchableOpacity>

                  {/* DELETE */}

                  <TouchableOpacity

                    style={
                      styles.deleteBtn
                    }

                    onPress={() =>
                      confirmDelete(
                        item._id
                      )
                    }

                  >

                    <Image
                      source={require("../assets/icons/delete.png")}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: "white",
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={
                        styles.btnText
                      }
                    >

                      Delete

                    </Text>

                  </TouchableOpacity>

                </View>

              </View>

            )}

          />

        ) : null

      }

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        colors.background,

      padding: spacing.md,

    },

    heading: {

      ...typography.h2,

    },

    addBtn: {

      backgroundColor:
        colors.primary,

      padding: spacing.sm,

      borderRadius: radius.md,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

      marginBottom: spacing.md,

    },

    addText: {

      color: colors.surface,

      ...typography.button,

      marginLeft: spacing.sm,

    },

    card: {

      backgroundColor:
        colors.surface,

      borderRadius: radius.lg,

      padding: spacing.md,

      marginBottom: spacing.md,

      ...shadows.sm,

    },

    typeBox: {

      flexDirection: "row",

      alignItems: "center",

      alignSelf:
        "flex-start",

      backgroundColor:
        colors.background,

      paddingHorizontal: spacing.sm,

      paddingVertical: spacing.xs,

      borderRadius: radius.xl,

      marginBottom: spacing.sm,

    },

    typeText: {

      color: colors.primary,

      ...typography.subtitle,

      marginLeft: spacing.xs,

    },

    name: {

      ...typography.h3,

      marginBottom: spacing.xs,

    },

    address: {

      color: colors.textSecondary,

      ...typography.body,

    },

    phone: {

      marginTop: spacing.sm,

      color: colors.textSecondary,
      ...typography.body,

    },

    buttonRow: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: spacing.md,

    },

    editBtn: {

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        colors.primary,

      paddingVertical: spacing.sm,

      paddingHorizontal: spacing.xl,

      borderRadius: radius.md,

    },

    deleteBtn: {

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        colors.error,

      paddingVertical: spacing.sm,

      paddingHorizontal: spacing.xl,

      borderRadius: radius.md,

    },

    btnText: {

      color: colors.surface,

      ...typography.button,

      marginLeft: spacing.xs,

    },

    emptyContainer: {

      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: spacing.xxxl,

    },

    emptyTitle: {

      ...typography.h3,

      marginTop: spacing.md,

    },

  });