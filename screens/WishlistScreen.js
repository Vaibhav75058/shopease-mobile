import React from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useWishlist }
  from "../src/context/WishlistContext";

export default function WishlistScreen({

  navigation,

}) {

  const {
    wishlistItems,
  } = useWishlist();

  return (

    <SafeAreaView
      style={styles.container}
    >

      <Text style={styles.heading}>
        My Wishlist ❤️
      </Text>

      {wishlistItems.length === 0 ? (

        <View style={styles.emptyBox}>

          <Text style={styles.emptyText}>
            Wishlist is Empty 😄
          </Text>

        </View>

      ) : (

        <FlatList

          data={wishlistItems}

          keyExtractor={(item) => item._id}

          numColumns={2}

          columnWrapperStyle={{
            justifyContent:
              "space-between",
          }}

          renderItem={({ item }) => (

            <TouchableOpacity

              style={styles.card}

              onPress={() =>

                navigation.navigate(

                  "ProductDetails",

                  { product: item }

                )

              }

            >

              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.image}
              />

              <Text
                numberOfLines={1}
                style={styles.name}
              >
                {item.name}
              </Text>

              <Text style={styles.price}>
                ₹ {item.price}
              </Text>

            </TouchableOpacity>

          )}

        />

      )}

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#fff",

    padding: 15,

  },

  heading: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 20,

  },

  emptyBox: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

  },

  emptyText: {

    fontSize: 22,

    fontWeight: "bold",

  },

  card: {

    width: "48%",

    backgroundColor: "#f5f5f5",

    borderRadius: 18,

    padding: 12,

    marginBottom: 15,

  },

  image: {

    width: "100%",

    height: 150,

    borderRadius: 15,

  },

  name: {

    fontSize: 16,

    fontWeight: "bold",

    marginTop: 10,

  },

  price: {

    fontSize: 18,

    color: "#e94560",

    fontWeight: "bold",

    marginTop: 8,

  },

});