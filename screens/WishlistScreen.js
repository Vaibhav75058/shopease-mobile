import React from "react";

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useWishlist,
} from "../src/context/WishlistContext";

export default function WishlistScreen({

  navigation,

}) {

  const {

    wishlist,

    removeFromWishlist,

  } = useWishlist();

  return (

    <View
      style={styles.container}
    >

      {/* HEADER */}

      <Text
        style={styles.heading}
      >

        My Wishlist ❤️

      </Text>

      {

        wishlist.length ===
          0 ? (

          <View
            style={
              styles.emptyContainer
            }
          >

            <Ionicons

              name="heart-outline"

              size={90}

              color="#ccc"

            />

            <Text
              style={
                styles.emptyText
              }
            >

              Wishlist is Empty

            </Text>

          </View>

        ) : (

          <FlatList

            data={wishlist}

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

              <TouchableOpacity

                style={
                  styles.card
                }

                onPress={() =>

                  navigation.navigate(

                    "ProductDetails",

                    {
                      product:
                        item,
                    }

                  )

                }

              >

                {/* IMAGE */}

                <Image

                  source={{
                    uri:
                      item.image,
                  }}

                  style={
                    styles.image
                  }

                />

                {/* INFO */}

                <View
                  style={
                    styles.info
                  }
                >

                  <Text

                    numberOfLines={2}

                    style={
                      styles.name
                    }

                  >

                    {item.name}

                  </Text>

                  <Text
                    style={
                      styles.price
                    }
                  >

                    ₹ {item.price}

                  </Text>

                </View>

                {/* DELETE */}

                <TouchableOpacity

                  style={
                    styles.deleteBtn
                  }

                  onPress={() =>

                    removeFromWishlist(
                      item._id
                    )

                  }

                >

                  <Ionicons

                    name="trash-outline"

                    size={22}

                    color="#e94560"

                  />

                </TouchableOpacity>

              </TouchableOpacity>

            )}

          />

        )

      }

    </View>

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

      fontSize: 30,

      fontWeight: "bold",

      marginBottom: 20,

      color: "#111",

    },

    card: {

      backgroundColor:
        "white",

      borderRadius: 20,

      padding: 14,

      marginBottom: 16,

      flexDirection: "row",

      alignItems: "center",

      elevation: 3,

    },

    image: {

      width: 90,

      height: 90,

      borderRadius: 15,

      resizeMode: "cover",

    },

    info: {

      flex: 1,

      marginLeft: 15,

    },

    name: {

      fontSize: 16,

      fontWeight: "600",

      color: "#111",

    },

    price: {

      fontSize: 20,

      fontWeight: "bold",

      color: "#2874f0",

      marginTop: 10,

    },

    deleteBtn: {

      padding: 10,

    },

    emptyContainer: {

      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: 100,

    },

    emptyText: {

      fontSize: 22,

      fontWeight: "bold",

      color: "gray",

      marginTop: 15,

    },

  });