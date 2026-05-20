import React from "react";

import {
  View,
  TextInput,
 
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import Ionicons
  from "@expo/vector-icons/Ionicons";

export default function SearchBar({

  search,
  setSearch,

}) {

  return (

    <View style={styles.container}>

      <Image
        source={require("../../assets/icons/search.png")}
        style={{
          width: 24,
          height: 24,
          tintColor: "#666",
          resizeMode: "contain",
        }}
      />

      <TextInput

        placeholder="Search products..."

        style={styles.input}

        value={search}

        onChangeText={setSearch}

        placeholderTextColor="#999"

      />

      {search.length > 0 && (

        <TouchableOpacity
          onPress={() =>
            setSearch("")
          }
        >

          <Image
            source={require("../../assets/icons/close.png")}
            style={{
              width: 22,
              height: 22,
              tintColor: "#777",
              resizeMode: "contain",
            }}
          />

        </TouchableOpacity>

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    backgroundColor: "white",

    borderRadius: 18,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 15,

    height: 58,

    elevation: 4,

    marginBottom: 20,

  },

  input: {

    flex: 1,

    marginLeft: 10,

    fontSize: 16,

    color: "#111",

  },

});