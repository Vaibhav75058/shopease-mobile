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
  SafeAreaView,
  Alert,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import axios from "axios";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function SavedAddressesScreen({

  navigation,

}) {

  const {
    user,
  } = useAuth();

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  const fetchAddresses =
    async () => {

      try {

        const res =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/address",

            {
              headers: {

                Authorization:
                  `Bearer ${user.token}`,

              },
            }
          );

        setAddresses(
          res.data || []
        );

      } catch (error) {

        console.log(error);

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

        await axios.delete(

          `https://e-commerce-mern-stack-0okr.onrender.com/api/address/${id}`,

          {
            headers: {

              Authorization:
                `Bearer ${user.token}`,

            },
          }
        );

        fetchAddresses();

      } catch (error) {

        console.log(error);

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

      {/* EMPTY */}

      {

        addresses.length ===
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

        ) : (

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

        )

      }

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#f5f7fb",

      padding: 15,

    },



    heading: {

      fontSize: 28,

      fontWeight: "bold",

    },

    addBtn: {

      backgroundColor:
        "#8a8a8b",

      padding: 11,

      borderRadius: 15,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

      marginBottom: 20,

    },

    addText: {

      color: "white",

      fontWeight: "bold",

      marginLeft: 8,

      fontSize: 16,

    },

    card: {

      backgroundColor:
        "white",

      borderRadius: 18,

      padding: 18,

      marginBottom: 15,

      elevation: 3,

    },

    typeBox: {

      flexDirection: "row",

      alignItems: "center",

      alignSelf:
        "flex-start",

      backgroundColor:
        "#eef4ff",

      paddingHorizontal: 12,

      paddingVertical: 6,

      borderRadius: 20,

      marginBottom: 12,

    },

    typeText: {

      color: "#2874f0",

      fontWeight: "bold",

      marginLeft: 6,

    },

    name: {

      fontSize: 18,

      fontWeight: "bold",

      marginBottom: 8,

    },

    address: {

      color: "#555",

      lineHeight: 22,

    },

    phone: {

      marginTop: 10,

      color: "#444",

    },

    buttonRow: {

      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: 18,

    },

    editBtn: {

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        "#2874f0",

      paddingVertical: 10,

      paddingHorizontal: 22,

      borderRadius: 12,

    },

    deleteBtn: {

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        "#e94560",

      paddingVertical: 10,

      paddingHorizontal: 22,

      borderRadius: 12,

    },

    btnText: {

      color: "white",

      fontWeight: "bold",

      marginLeft: 6,

    },

    emptyContainer: {

      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: 100,

    },

    emptyTitle: {

      fontSize: 22,

      fontWeight: "bold",

      marginTop: 15,

    },

  });