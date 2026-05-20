import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

import axios from "axios";

export default function CategoriesScreen() {

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    name,
    setName,
  ] = useState("");

  const [
    image,
    setImage,
  ] = useState("");

  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories =
    async () => {

      try {

        const response =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/categories"

          );

        setCategories(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  const addCategory =
    async () => {

      if (
        !name ||
        !image
      ) {

        Alert.alert(
          "Fill all fields"
        );

        return;

      }

      try {

        await axios.post(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/categories",

          {
            name,
            image,
          }

        );

        Alert.alert(
          "Success",
          "Category Added"
        );

        setName("");

        setImage("");

        fetchCategories();

      } catch (error) {

        Alert.alert(
          "Error",
          error.response?.data?.message
        );

      }

    };

  return (

    <View
      style={styles.container}
    >

      <Text
        style={styles.heading}
      >

        Categories

      </Text>

      <TextInput

        placeholder="Category Name"

        style={styles.input}

        value={name}

        onChangeText={setName}

      />

      <TextInput

        placeholder="Category Image URL"

        style={styles.input}

        value={image}

        onChangeText={setImage}

      />

      <TouchableOpacity

        style={styles.button}

        onPress={addCategory}

      >

        <Text
          style={styles.buttonText}
        >

          Add Category

        </Text>

      </TouchableOpacity>

      <FlatList

        data={categories}

        keyExtractor={(item) =>
          item._id
        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Image

              source={{
                uri:
                  item.image,
              }}

              style={styles.image}

            />

            <Text style={styles.name}>
              {item.name}
            </Text>

          </View>

        )}

      />

    </View>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#fff",

      padding: 15,

    },

    heading: {

      fontSize: 28,

      fontWeight: "bold",

      marginBottom: 20,

    },

    input: {

      backgroundColor:
        "#f5f5f5",

      borderRadius: 14,

      padding: 15,

      marginBottom: 15,

    },

    button: {

      backgroundColor:
        "#2874f0",

      padding: 16,

      borderRadius: 14,

      alignItems: "center",

      marginBottom: 20,

    },

    buttonText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 16,

    },

    card: {

      backgroundColor:
        "#f5f5f5",

      borderRadius: 14,

      padding: 12,

      flexDirection: "row",

      alignItems: "center",

      marginBottom: 12,

    },

    image: {

      width: 50,

      height: 50,

      borderRadius: 12,

      marginRight: 15,

    },

    name: {

      fontWeight: "bold",

      fontSize: 16,

    },

  });