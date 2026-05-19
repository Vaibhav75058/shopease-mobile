import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import axios from "axios";

export default function CategoryProductsScreen({

  route,

  navigation,

}) {

  const {
    category,
  } = route.params;

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/products"

          );

        /* FILTER CATEGORY */

        const filtered =
          response.data.filter(

            (item) =>

              item.category
                ?.toLowerCase()

                ===

              category
                ?.toLowerCase()

          );

        setProducts(
          filtered
        );

      } catch (error) {

        console.log(

          error.response?.data ||

          error.message

        );

      } finally {

        setLoading(false);

      }

    };

  const renderItem =
    ({ item }) => (

      <TouchableOpacity

        style={styles.card}

        onPress={() =>

         navigation.navigate(

  "ProductDetails",

  {
    product: item,
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

          style={styles.image}

        />

        {/* NAME */}

        <Text

          numberOfLines={2}

          style={styles.name}

        >

          {item.name}

        </Text>

        {/* PRICE */}

        <Text
          style={styles.price}
        >

          ₹ {item.price}

        </Text>

        {/* CATEGORY */}

        <View
          style={
            styles.categoryBox
          }
        >

          <Text
            style={
              styles.categoryText
            }
          >

            {item.category}

          </Text>

        </View>

      </TouchableOpacity>

    );

  return (

    <View
      style={styles.container}
    >

      {/* HEADER */}

      <View
        style={styles.header}
      >

        <Text
          style={styles.heading}
        >

          {category}

        </Text>

        <Text
          style={styles.subHeading}
        >

          {

            products.length

          } Products Found

        </Text>

      </View>

      {/* PRODUCTS */}

      {

        products.length ===
          0 ? (

          <View
            style={
              styles.emptyContainer
            }
          >

            <Text
              style={
                styles.emptyText
              }
            >

              No Products Found

            </Text>

          </View>

        ) : (

          <FlatList

            data={products}

            keyExtractor={(
              item
            ) =>
              item._id
            }

            numColumns={2}

            showsVerticalScrollIndicator={
              false
            }

            columnWrapperStyle={{
              justifyContent:
                "space-between",
            }}

            contentContainerStyle={{
              paddingBottom: 100,
            }}

            renderItem={
              renderItem
            }

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

    header: {

      marginBottom: 20,

    },

    heading: {

      fontSize: 30,

      fontWeight: "bold",

      color: "#111",

    },

    subHeading: {

      color: "gray",

      marginTop: 5,

      fontSize: 15,

    },

    card: {

      width: "48%",

      backgroundColor:
        "white",

      borderRadius: 20,

      padding: 12,

      marginBottom: 18,

      elevation: 3,

    },

    image: {

      width: "100%",

      height: 160,

      borderRadius: 15,

      resizeMode: "cover",

    },

    name: {

      fontSize: 15,

      fontWeight: "600",

      color: "#111",

      marginTop: 10,

      minHeight: 45,

    },

    price: {

      fontSize: 18,

      fontWeight: "bold",

      color: "#2874f0",

      marginTop: 8,

    },

    categoryBox: {

      backgroundColor:
        "#eef4ff",

      alignSelf:
        "flex-start",

      paddingHorizontal: 10,

      paddingVertical: 5,

      borderRadius: 20,

      marginTop: 10,

    },

    categoryText: {

      color: "#2874f0",

      fontWeight: "bold",

      fontSize: 12,

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

      fontSize: 20,

      color: "gray",

      fontWeight: "bold",

    },

  });